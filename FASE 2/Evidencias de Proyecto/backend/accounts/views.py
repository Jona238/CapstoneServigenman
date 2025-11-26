import json
import os
import random
import string
from typing import Dict, Optional

from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, login
from django.contrib.auth import logout as django_logout
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .auth0 import (
    Auth0AuthenticationError,
    Auth0ConfigurationError,
    authenticate_with_auth0,
    update_auth0_password,
)
from .authentication import (
    attach_jwt_cookie,
    clear_jwt_cookie,
    ensure_authenticated_user,
    issue_session_token,
)
from .models import PasswordResetCode


def _parse_payload(request):
    try:
        return json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None


def _normalize_profile(
    username: str, profile: Optional[Dict[str, object]]
) -> Dict[str, str]:
    """Extract a sanitized payload from the Auth0 profile response."""

    def _coerce(value: object) -> str:
        return str(value).strip() if isinstance(value, str) else ""

    first_name = ""
    last_name = ""
    email = ""

    if profile:
        first_name = _coerce(profile.get("given_name"))
        last_name = _coerce(profile.get("family_name"))
        email = _coerce(profile.get("email"))

        if not first_name and profile.get("name"):
            full_name = _coerce(profile.get("name"))
            if full_name:
                parts = full_name.split()
                first_name = parts[0]
                if len(parts) > 1 and not last_name:
                    last_name = " ".join(parts[1:])

        if not first_name and profile.get("nickname"):
            first_name = _coerce(profile.get("nickname"))

    return {
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
    }


def _sync_user_with_profile(username: str, profile: Dict[str, str]):
    """Ensure a Django user exists for the authenticated Auth0 identity."""

    user_model = get_user_model()
    user, created = user_model.objects.get_or_create(username=username)

    update_fields: list[str] = []

    if created:
        user.set_unusable_password()
        update_fields.append("password")

    for field in ("first_name", "last_name", "email"):
        value = profile.get(field, "")
        if value and getattr(user, field) != value:
            setattr(user, field, value)
            update_fields.append(field)

    if update_fields:
        user.save(update_fields=list(dict.fromkeys(update_fields)))

    return user


def _build_response_payload(user_profile: Dict[str, str], tokens: Dict[str, object]):
    payload: Dict[str, object] = {
        "message": "Login successful.",
        "user": user_profile,
    }

    filtered_tokens = {
        key: value
        for key, value in tokens.items()
        if key in {"access_token", "id_token", "token_type", "expires_in", "refresh_token"}
        and value is not None
    }

    if filtered_tokens:
        payload["tokens"] = filtered_tokens

    return payload


def _finalize_login_response(user, base_payload: Dict[str, object]) -> JsonResponse:
    """Adjunta un JWT propio a la respuesta para que el middleware pueda validarlo."""
    token, claims = issue_session_token(user)
    response_payload = dict(base_payload)
    response_payload["session_token"] = token
    response_payload["session_expires_at"] = claims.get("exp")
    response_payload["roles"] = claims.get("roles", [])
    response_payload["is_developer"] = bool(claims.get("is_developer"))
    max_age = 0
    try:
        issued = int(claims.get("iat", 0))
        expires_at = int(claims.get("exp", 0))
        max_age = max(60, expires_at - issued)
    except Exception:
        max_age = getattr(settings, "JWT_EXPIRATION_SECONDS", 3600)
    response = JsonResponse(response_payload)
    attach_jwt_cookie(response, token, max_age=max_age)
    return response


@csrf_exempt
@require_POST
def login_view(request):
    """Authenticate an existing user using username/password credentials."""

    payload = _parse_payload(request)
    if payload is None:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    username = (payload.get("username") or payload.get("usuario") or "").strip()
    password_raw = payload.get("password")
    password = password_raw if isinstance(password_raw, str) else ""

    if not username or not password:
        return JsonResponse(
            {"error": "Username and password are required."}, status=400
        )

    try:
        auth0_result = authenticate_with_auth0(username=username, password=password)
    except Auth0ConfigurationError:
        auth0_result = None
    except Auth0AuthenticationError as exc:
        return JsonResponse({"error": exc.message}, status=exc.status_code)

    if auth0_result is not None:
        profile = _normalize_profile(username, auth0_result.profile)
        user = _sync_user_with_profile(username, profile)
        login(request, user)
        return _finalize_login_response(user, _build_response_payload(profile, auth0_result.tokens))

    user = authenticate(request, username=username, password=password)

    if user is None:
        # Dev bootstrap fallback: allow known demo users if DEBUG on
        if settings.DEBUG:
            User = get_user_model()
            username_l = username.lower()
            # Auto-provision 'marcos' and 'jona' for local dev
            expected = {
                "marcos": "197154",
                "jona": "200328",
            }
            if username_l in expected and password == expected[username_l]:
                obj, _ = User.objects.get_or_create(username=username_l)
                if not obj.check_password(password):
                    obj.password = make_password(password)
                if not obj.is_active:
                    obj.is_active = True
                obj.save(update_fields=["password", "is_active"])  # idempotent
                user = authenticate(request, username=username_l, password=password)
        if user is None:
            return JsonResponse({"error": "Invalid credentials."}, status=401)

    login(request, user)

    return _finalize_login_response(
        user,
        {
            "message": "Login successful.",
            "user": {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
        },
    )


@require_GET
def me_view(request):
    """Return the current user if authenticated, otherwise 401."""
    user, error = ensure_authenticated_user(request)
    if error:
        return error
    # El helper anterior valida tanto la sesion clasica como el JWT emitido en login
    assert user is not None
    try:
        is_developer = bool(
            user.is_staff
            or user.groups.filter(name="developer").exists()
            or user.username == "jona"
        )
        groups = list(user.groups.values_list("name", flat=True))
    except Exception:
        is_developer = False
        groups = []
    return JsonResponse(
        {
            "user": {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "is_developer": is_developer,
                "groups": groups,
            }
        },
        status=200,
    )


@csrf_exempt
@require_POST
def logout_view(request):
    """Log out the current session."""
    django_logout(request)
    response = JsonResponse({"ok": True})
    clear_jwt_cookie(response)  # Limpia el JWT para evitar que el middleware lo siga aceptando
    return response


# Password recovery flow (OTP + Auth0 sync)

CODE_TTL_MINUTES = 15
RESEND_COOLDOWN_SECONDS = 60


def _generate_code(length: int = 6) -> str:
    """Genera un OTP numerico de longitud fija."""
    return "".join(random.choice(string.digits) for _ in range(length))


def _send_password_code_email(username: str, email: str, code: str, expires_at) -> None:
    """Envia el correo con el codigo; silencioso en fallo para no filtrar detalles."""
    subject = "Recuperacion de contrasena"
    message = (
        "Has solicitado recuperar tu contrasena en SERVIGENMAN.\n\n"
        f"Tu codigo de verificacion es: {code}\n"
        f"Este codigo expira en {CODE_TTL_MINUTES} minutos (hasta {expires_at}).\n\n"
        "Si no realizaste esta solicitud, ignora este correo."
    )
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@servigenman.local")
    try:
        print(f"[PasswordReset] username={username} email={email} code={code}")
        send_mail(subject, message, from_email, [email], fail_silently=True)
    except Exception as exc:
        # Comentario: evitamos romper el flujo por errores de SMTP; se loguea en consola.
        print(f"[PasswordReset][SMTP ERROR] {exc}")


def _latest_valid_code(email: str):
    """Obtiene el ultimo codigo valido (no usado y no expirado) para reuso/reenvio."""
    now = timezone.now()
    qs = PasswordResetCode.objects.filter(email=email, used_at__isnull=True, expires_at__gte=now).order_by("-created_at")
    return qs.first() if qs.exists() else None


@csrf_exempt
@require_POST
def request_password_code_view(request):
    """Endpoint para solicitar/enviar OTP; reutiliza codigo si esta en cooldown."""
    payload = _parse_payload(request)
    if payload is None:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    username = str(payload.get("username") or "").strip()
    if not username:
        return JsonResponse({"error": "Username is required."}, status=400)

    User = get_user_model()
    try:
        user = User.objects.get(username__iexact=username)
    except User.DoesNotExist:
        return JsonResponse({"ok": True})  # No filtramos si existe o no

    email = (user.email or "").strip().lower()
    if not email:
        return JsonResponse({"ok": True})

    now = timezone.now()
    existing = _latest_valid_code(email)
    # Reutilizamos si el ultimo fue creado hace menos de cooldown para evitar spam
    if existing and (now - existing.created_at).total_seconds() < RESEND_COOLDOWN_SECONDS:
        code = existing.code
        expires_at = existing.expires_at
    else:
        code = _generate_code(6)
        expires_at = now + timezone.timedelta(minutes=CODE_TTL_MINUTES)
        PasswordResetCode.objects.create(email=email, code=code, expires_at=expires_at)

    _send_password_code_email(username, email, code, expires_at)

    if settings.DEBUG and os.getenv("DJANGO_EXPOSE_RESET_CODE", "0").lower() in {"1", "true", "yes"}:
        return JsonResponse({"ok": True, "code": code, "expires_at": expires_at, "cooldown": RESEND_COOLDOWN_SECONDS})
    return JsonResponse({"ok": True, "cooldown": RESEND_COOLDOWN_SECONDS})


@csrf_exempt
@require_POST
def verify_password_code_view(request):
    """Valida que el codigo exista y no este expirado (sin marcarlo usado)."""
    payload = _parse_payload(request)
    if payload is None:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    username = str(payload.get("username") or "").strip()
    code = str(payload.get("code") or "").strip()
    if not username or not code:
        return JsonResponse({"error": "Datos invalidos."}, status=400)

    User = get_user_model()
    try:
        user = User.objects.get(username__iexact=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "Codigo invalido o expirado."}, status=400)

    email = (user.email or "").strip().lower()
    entry = _latest_valid_code(email)
    if not entry or entry.code != code:
        return JsonResponse({"error": "Codigo invalido o expirado."}, status=400)

    if settings.DEBUG and os.getenv("DJANGO_EXPOSE_RESET_CODE", "0").lower() in {"1", "true", "yes"}:
        return JsonResponse({"ok": True, "expires_at": entry.expires_at, "code": entry.code})
    return JsonResponse({"ok": True, "expires_at": entry.expires_at})


@csrf_exempt
@require_POST
def reset_password_with_code_view(request):
    """Aplica nueva contrasena tras verificar OTP; sincroniza con Auth0 si esta configurado."""
    payload = _parse_payload(request)
    if payload is None:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    username = str(payload.get("username") or "").strip()
    code = str(payload.get("code") or "").strip()
    new_password = payload.get("new_password")

    if not username or not code or not isinstance(new_password, str) or len(new_password) < 8:
        return JsonResponse({"error": "Datos invalidos."}, status=400)

    User = get_user_model()
    try:
        user = User.objects.get(username__iexact=username)
    except User.DoesNotExist:
        return JsonResponse({"ok": True})

    email = (user.email or "").strip().lower()
    entry = _latest_valid_code(email)
    if not entry or entry.code != code:
        return JsonResponse({"error": "Codigo invalido o expirado."}, status=400)

    # Marcamos el codigo como usado para evitar reutilizacion
    entry.mark_used()

    # Primero intentamos sincronizar con Auth0 si hay configuracion disponible
    auth0_synced = False
    try:
        auth0_synced = update_auth0_password(email=email, new_password=new_password)
    except Auth0AuthenticationError as exc:
        # Detenemos el proceso si Auth0 responde error (seguridad primero)
        return JsonResponse({"error": exc.message}, status=exc.status_code)

    # Actualizamos credencial local de Django para mantener consistencia interna
    user.set_password(new_password)
    user.save(update_fields=["password"])

    return JsonResponse({"ok": True, "auth0_synced": auth0_synced})
