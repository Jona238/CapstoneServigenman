import json
from typing import Dict, Optional

from django.contrib.auth import authenticate, get_user_model, login
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import logout as django_logout
from django.views.decorators.http import require_GET

from .auth0 import (
    Auth0AuthenticationError,
    Auth0ConfigurationError,
    authenticate_with_auth0,
)


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
        return JsonResponse(_build_response_payload(profile, auth0_result.tokens))

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

    return JsonResponse(
        {
            "message": "Login successful.",
            "user": {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
        }
    )


@require_GET
def me_view(request):
    """Return the current user if authenticated, otherwise 401."""
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Not authenticated"}, status=401)

    user = request.user
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
    return JsonResponse({"ok": True})
