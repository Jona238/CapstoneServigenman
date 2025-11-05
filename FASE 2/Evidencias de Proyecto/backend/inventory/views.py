from __future__ import annotations

import json
from decimal import Decimal

from functools import wraps

from django.http import JsonResponse, HttpRequest, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt

from .models import Item


def require_authenticated(view_func):
    """Return 401 JSON when the user is not authenticated."""

    @wraps(view_func)
    def _wrapped(request: HttpRequest, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse(
                {"detail": "Authentication credentials were not provided."},
                status=401,
            )
        return view_func(request, *args, **kwargs)

    return _wrapped


def _parse_body(request: HttpRequest) -> dict:
    try:
        if not request.body:
            return {}
        return json.loads(request.body.decode("utf-8"))
    except Exception:
        return {}


def _item_from_payload(payload: dict, instance: Item | None = None) -> Item:
    item = instance or Item()
    if "recurso" in payload:
        item.recurso = str(payload.get("recurso") or "").strip()
    if "categoria" in payload:
        item.categoria = str(payload.get("categoria") or "").strip()
    if "cantidad" in payload:
        try:
            item.cantidad = int(payload.get("cantidad") or 0)
        except Exception:
            item.cantidad = 0
    if "precio" in payload:
        try:
            item.precio = Decimal(str(payload.get("precio") or 0))
        except Exception:
            item.precio = Decimal("0")
    if "foto" in payload:
        item.foto = str(payload.get("foto") or "")
    if "info" in payload:
        item.info = str(payload.get("info") or "")
    return item


@csrf_exempt
@require_authenticated
def items_list_create(request: HttpRequest):
    if request.method == "GET":
        items = [obj.to_dict() for obj in Item.objects.all().order_by("id")]
        return JsonResponse({"results": items}, status=200)

    if request.method == "POST":
        payload = _parse_body(request)
        item = _item_from_payload(payload)
        item.save()
        return JsonResponse(item.to_dict(), status=201)

    return HttpResponseNotAllowed(["GET", "POST"])


@csrf_exempt
@require_authenticated
def item_detail_update_delete(request: HttpRequest, item_id: int):
    try:
        item = Item.objects.get(pk=item_id)
    except Item.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(item.to_dict(), status=200)

    if request.method in {"PUT", "PATCH"}:
        payload = _parse_body(request)
        partial = request.method == "PATCH"
        updated = _item_from_payload(payload if partial else payload, instance=item)
        updated.save()
        return JsonResponse(updated.to_dict(), status=200)

    if request.method == "DELETE":
        item.delete()
        return JsonResponse({"ok": True}, status=204)

    return HttpResponseNotAllowed(["GET", "PUT", "PATCH", "DELETE"])

