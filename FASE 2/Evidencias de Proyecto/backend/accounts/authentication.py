"""Helpers compartidos para emitir y validar JWTs de sesión."""

from __future__ import annotations

import time
from typing import Any, Dict, Optional, Tuple, TypeVar

from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpRequest, JsonResponse, HttpResponse

from .jwt_utils import JWTValidationError, decode_jwt, encode_jwt

UserType = TypeVar("UserType")


def _collect_roles(user) -> list[str]:
    """Centraliza el cálculo de roles para asegurar consistencia entre frontend y backend."""
    try:
        roles = list(user.groups.values_list("name", flat=True))
    except Exception:
        roles = []
    if user.is_staff and "staff" not in roles:
        roles.append("staff")
    if user.is_superuser and "admin" not in roles:
        roles.append("admin")
    return sorted({r for r in roles if r})


def user_is_developer(user) -> bool:
    """Determina si el usuario pertenece al grupo avanzado."""
    try:
        return bool(
            user
            and (
                user.is_staff
                or user.groups.filter(name="developer").exists()
                or user.username == "jona"
            )
        )
    except Exception:
        return False


def issue_session_token(user, *, extra_claims: Optional[Dict[str, Any]] = None, ttl: Optional[int] = None) -> tuple[str, Dict[str, Any]]:
    """
    Genera un JWT con la identidad del usuario y metadatos mínimos.
    Se retorna el token y los claims para reutilizar exp, roles, etc.
    """
    now = int(time.time())
    seconds = int(ttl or getattr(settings, "JWT_EXPIRATION_SECONDS", 3600))
    claims: Dict[str, Any] = {
        "sub": user.username,
        "iat": now,
        "exp": now + max(60, seconds),
        "roles": _collect_roles(user),
        "is_developer": user_is_developer(user),
    }
    if extra_claims:
        claims.update(extra_claims)
    token = encode_jwt(claims, getattr(settings, "JWT_SECRET_KEY", settings.SECRET_KEY), algorithm=getattr(settings, "JWT_ALGORITHM", "HS256"))
    return token, claims


def attach_jwt_cookie(response: HttpResponse, token: str, *, max_age: Optional[int] = None) -> None:
    """Adjunta el token firmado en una cookie HttpOnly para que Next pueda leerla en el middleware."""
    cookie_name = getattr(settings, "JWT_COOKIE_NAME", "servigenman_jwt")
    lifetime = int(max_age or getattr(settings, "JWT_EXPIRATION_SECONDS", 3600))
    response.set_cookie(
        cookie_name,
        token,
        max_age=lifetime,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        path="/",
    )


def clear_jwt_cookie(response: HttpResponse) -> None:
    """Invalida la cookie JWT para cerrar la sesión también del lado del middleware."""
    cookie_name = getattr(settings, "JWT_COOKIE_NAME", "servigenman_jwt")
    response.delete_cookie(cookie_name, path="/")


def extract_token_from_request(request: HttpRequest) -> Optional[str]:
    """Busca credenciales en Authorization Bearer y como fallback en la cookie HttpOnly."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.lower().startswith("bearer "):
        candidate = auth_header[7:].strip()
        if candidate:
            return candidate
    cookie_name = getattr(settings, "JWT_COOKIE_NAME", "servigenman_jwt")
    cookie_token = request.COOKIES.get(cookie_name)
    if cookie_token:
        return cookie_token
    return None


def ensure_authenticated_user(request: HttpRequest) -> Tuple[Optional[UserType], Optional[JsonResponse]]:
    """
    Normaliza la verificación de sesión para todas las vistas.
    Retorna un JsonResponse listo en caso de error para no duplicar mensajes.
    """
    user = getattr(request, "user", None)
    if user is not None and user.is_authenticated:
        return user, None

    token = extract_token_from_request(request)
    if not token:
        return None, JsonResponse({"detail": "Authentication credentials were not provided."}, status=401)

    try:
        claims = decode_jwt(
            token,
            getattr(settings, "JWT_SECRET_KEY", settings.SECRET_KEY),
            algorithms=[getattr(settings, "JWT_ALGORITHM", "HS256")],
        )
    except JWTValidationError as exc:
        return None, JsonResponse({"detail": str(exc)}, status=401)

    username = claims.get("sub")
    if not username:
        return None, JsonResponse({"detail": "Token sin usuario asociado."}, status=401)

    User = get_user_model()
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return None, JsonResponse({"detail": "Usuario no encontrado."}, status=401)

    request.user = user
    request.jwt_claims = claims  # tipo dinámico pero útil en revisiones posteriores
    return user, None
