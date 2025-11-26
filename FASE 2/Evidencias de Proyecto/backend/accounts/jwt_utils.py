"""Minimal JWT helpers dedicated to Servigenman (HS256 only)."""

from __future__ import annotations

import base64
import binascii
import hashlib
import hmac
import json
import time
from typing import Any, Dict, Iterable


class JWTValidationError(Exception):
    """Custom error so the caller can differentiate problemas de firma/expiración."""


def _urlsafe_b64encode(value: bytes) -> str:
    """Return base64-url sin relleno para encajar con el formato JWT clásico."""
    encoded = base64.urlsafe_b64encode(value).decode("ascii")
    return encoded.rstrip("=")


def _urlsafe_b64decode(value: str) -> bytes:
    """Decode base64-url normalizando el padding que a veces se omite en JWT."""
    padding = "=" * ((4 - len(value) % 4) % 4)
    return base64.urlsafe_b64decode(value + padding)


def encode_jwt(payload: Dict[str, Any], secret: str, *, algorithm: str = "HS256") -> str:
    """Serializa y firma un diccionario usando HS256 para no depender de PyJWT."""
    if algorithm != "HS256":
        raise ValueError("Solo se soporta HS256 en esta implementación liviana.")
    header = {"alg": algorithm, "typ": "JWT"}
    header_segment = _urlsafe_b64encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_segment = _urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_segment}.{payload_segment}".encode("ascii")
    signature = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    signature_segment = _urlsafe_b64encode(signature)
    return f"{header_segment}.{payload_segment}.{signature_segment}"


def decode_jwt(token: str, secret: str, *, algorithms: Iterable[str] = ("HS256",)) -> Dict[str, Any]:
    """Valida firma y expiración del token, devolviendo el payload legible."""
    try:
        header_segment, payload_segment, signature_segment = token.split(".")
    except ValueError as exc:  # formato inválido
        raise JWTValidationError("Token malformado.") from exc

    try:
        header = json.loads(_urlsafe_b64decode(header_segment))
    except (json.JSONDecodeError, ValueError, binascii.Error) as exc:
        raise JWTValidationError("Cabecera del token inválida.") from exc

    alg = header.get("alg")
    if alg not in algorithms:
        raise JWTValidationError("Algoritmo de firma no permitido.")

    signing_input = f"{header_segment}.{payload_segment}".encode("ascii")
    expected_signature = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    try:
        provided_signature = _urlsafe_b64decode(signature_segment)
    except (ValueError, binascii.Error) as exc:
        raise JWTValidationError("Firma no legible.") from exc

    if not hmac.compare_digest(expected_signature, provided_signature):
        raise JWTValidationError("Firma inválida.")

    try:
        payload = json.loads(_urlsafe_b64decode(payload_segment))
    except (json.JSONDecodeError, ValueError, binascii.Error) as exc:
        raise JWTValidationError("Payload del token inválido.") from exc

    exp = payload.get("exp")
    now = int(time.time())
    if exp is None or not isinstance(exp, (int, float)):
        raise JWTValidationError("Token sin expiración.")
    if int(exp) <= now:
        raise JWTValidationError("Token expirado.")

    nbf = payload.get("nbf")
    if isinstance(nbf, (int, float)) and int(nbf) > now:
        raise JWTValidationError("Token aún no es válido (nbf).")

    return payload


__all__ = ["encode_jwt", "decode_jwt", "JWTValidationError"]
