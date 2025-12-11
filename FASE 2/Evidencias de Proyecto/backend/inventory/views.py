from __future__ import annotations

import json
from decimal import Decimal

from functools import wraps

from django.http import JsonResponse, HttpRequest, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, F

from .models import Item, PendingChange, InventoryMovement
from .serializers import InventoryMovementSerializer
from .auth import CsrfExemptSessionAuthentication
from accounts.authentication import ensure_authenticated_user, user_is_developer


def require_authenticated(view_func):
    """Return 401 JSON when the user is not authenticated."""

    @wraps(view_func)
    def _wrapped(request: HttpRequest, *args, **kwargs):
        _, error = ensure_authenticated_user(request)
        if error:
            return error
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
    if "distribuidor" in payload:
        item.distribuidor = str(payload.get("distribuidor") or "")
    if "ubicacion_texto" in payload:
        item.ubicacion_texto = str(payload.get("ubicacion_texto") or "")
    if isinstance(payload.get("ubicacion_fotos"), list):
        item.set_ubicacion_fotos(payload.get("ubicacion_fotos"))
    elif "ubicacion_foto" in payload:
        raw = payload.get("ubicacion_foto") or ""
        item.set_ubicacion_fotos([raw] if raw else [])
    return item


def _require_auth(request: HttpRequest):
    """Wrapper reutilizable para vistas sin decorador."""
    _, error = ensure_authenticated_user(request)
    if error:
        return error
    return None


@csrf_exempt
@require_authenticated
def items_list_create(request: HttpRequest):
    auth_error = _require_auth(request)
    if auth_error:
        return auth_error
    if request.method == "GET":
        items = [obj.to_dict() for obj in Item.objects.all().order_by("id")]
        return JsonResponse({"results": items}, status=200)

    if request.method == "POST":
        payload = _parse_body(request)
        user = request.user
        if not user_is_developer(user):
            # Queue as pending create
            change = PendingChange.objects.create(
                action=PendingChange.ACTION_CREATE,
                status=PendingChange.STATUS_PENDING,
                item=None,
                item_id_snapshot=None,
                item_snapshot={},
                payload=payload,
                created_by=user,
                created_at=timezone.now(),
            )
            return JsonResponse({"pending": True, "change": change.to_dict()}, status=202)

        item = _item_from_payload(payload)
        item.save()
        return JsonResponse(item.to_dict(), status=201)

    return HttpResponseNotAllowed(["GET", "POST"])


@csrf_exempt
@require_authenticated
def item_detail_update_delete(request: HttpRequest, item_id: int):
    auth_error = _require_auth(request)
    if auth_error:
        return auth_error
    try:
        item = Item.objects.get(pk=item_id)
    except Item.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(item.to_dict(), status=200)

    if request.method in {"PUT", "PATCH"}:
        payload = _parse_body(request)
        user = request.user
        if not user_is_developer(user):
            change = PendingChange.objects.create(
                action=PendingChange.ACTION_UPDATE,
                status=PendingChange.STATUS_PENDING,
                item=item,
                item_id_snapshot=item.id,
                item_snapshot=item.to_dict(),
                payload=payload,
                created_by=user,
                created_at=timezone.now(),
            )
            return JsonResponse({"pending": True, "change": change.to_dict()}, status=202)

        partial = request.method == "PATCH"
        updated = _item_from_payload(payload if partial else payload, instance=item)
        updated.save()
        return JsonResponse(updated.to_dict(), status=200)

    if request.method == "DELETE":
        # Developer deletes immediately; others create a pending change
        user = request.user
        if user_is_developer(user):
            item.delete()
            return JsonResponse({"ok": True}, status=204)

        change = PendingChange.objects.create(
            action=PendingChange.ACTION_DELETE,
            status=PendingChange.STATUS_PENDING,
            item=item,
            item_id_snapshot=item.id,
            item_snapshot=item.to_dict(),
            payload={},
            created_by=user if user.is_authenticated else None,
            created_at=timezone.now(),
        )
        return JsonResponse({"pending": True, "change": change.to_dict()}, status=202)

    return HttpResponseNotAllowed(["GET", "PUT", "PATCH", "DELETE"])


@csrf_exempt
def pending_list(request: HttpRequest):
    auth_error = _require_auth(request)
    if auth_error:
        return auth_error
    user = request.user
    if not user_is_developer(user):
        return JsonResponse({"detail": "Forbidden"}, status=403)
    qs = PendingChange.objects.all()
    return JsonResponse({"results": [c.to_dict() for c in qs]}, status=200)


@csrf_exempt
def pending_approve(request: HttpRequest, change_id: int):
    auth_error = _require_auth(request)
    if auth_error:
        return auth_error
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    user = request.user
    if not user_is_developer(user):
        return JsonResponse({"detail": "Forbidden"}, status=403)
    try:
        change = PendingChange.objects.get(pk=change_id)
    except PendingChange.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)

    if change.status != PendingChange.STATUS_PENDING:
        return JsonResponse({"detail": "Already decided"}, status=400)

    if change.action == PendingChange.ACTION_DELETE:
        # Perform delete if item still exists
        if change.item_id_snapshot:
            try:
                item = Item.objects.get(pk=change.item_id_snapshot)
                item.delete()
            except Item.DoesNotExist:
                pass
    elif change.action == PendingChange.ACTION_UPDATE:
        try:
            item = Item.objects.get(pk=change.item_id_snapshot)
            updated = _item_from_payload(change.payload or {}, instance=item)
            updated.save()
        except Item.DoesNotExist:
            pass
    elif change.action == PendingChange.ACTION_CREATE:
        item = _item_from_payload(change.payload or {})
        item.save()
        change.item = item
        change.item_id_snapshot = item.id
    # mark approved
    change.status = PendingChange.STATUS_APPROVED
    change.decided_by = user
    change.decided_at = timezone.now()
    change.save(update_fields=["status", "decided_by", "decided_at"])
    return JsonResponse({"ok": True, "change": change.to_dict()}, status=200)


@csrf_exempt
def pending_reject(request: HttpRequest, change_id: int):
    auth_error = _require_auth(request)
    if auth_error:
        return auth_error
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    user = request.user
    if not user_is_developer(user):
        return JsonResponse({"detail": "Forbidden"}, status=403)
    try:
        change = PendingChange.objects.get(pk=change_id)
    except PendingChange.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)
    if change.status != PendingChange.STATUS_PENDING:
        return JsonResponse({"detail": "Already decided"}, status=400)
    change.status = PendingChange.STATUS_REJECTED
    change.decided_by = user
    change.decided_at = timezone.now()
    change.save(update_fields=["status", "decided_by", "decided_at"])
    return JsonResponse({"ok": True, "change": change.to_dict()}, status=200)


def pending_count(request: HttpRequest):
    auth_error = _require_auth(request)
    if auth_error:
        return auth_error
    user = request.user
    if not user_is_developer(user):
        return JsonResponse({"detail": "Forbidden"}, status=403)
    count = PendingChange.objects.filter(status=PendingChange.STATUS_PENDING).count()
    return JsonResponse({"pending": count}, status=200)


class InventoryMovementViewSet(viewsets.ModelViewSet):
    queryset = InventoryMovement.objects.select_related("item").order_by("-created_at", "-id")
    serializer_class = InventoryMovementSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CsrfExemptSessionAuthentication]


class CategorySummaryAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: HttpRequest):
        qs = Item.objects.all().order_by("categoria", "id")
        summary: dict[str, dict] = {}
        for item in qs:
            name = (item.categoria or "").strip() or "Sin categoria"
            if name not in summary:
                summary[name] = {
                    "name": name,
                    "total_units": 0,
                    "total_items": 0,
                    "total_value": Decimal("0"),
                    "cover_photo": None,
                }
            entry = summary[name]
            entry["total_units"] += item.cantidad or 0
            entry["total_items"] += 1
            try:
                entry["total_value"] += Decimal(item.cantidad or 0) * Decimal(item.precio or 0)
            except Exception:
                pass
            if not entry["cover_photo"] and item.foto:
                entry["cover_photo"] = item.foto

        fallback_image = (
            "data:image/png;base64,"
            "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAJ0lEQVR4Xu3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAA"
            "AAAAAAAAAAA4HkBdQAAaxJREFUeF7tW22P2zYQfSKiQBKJkmiQpNHY3NnRjaeqqrE4uxPWmXoyVFj4AhtqR5ztx2IDd"
            "zG8Xx9Ph0L8vyCHgWQI8P9Hz8v3yzbTvoQPnDgA/4MGAYP/gwYBg/+DBgGD/4MGAYP/gwYBg/+DBgGD/4MGAYP/gwYB"
            "g/+DBgGD/4MGAYP8fyOk8nXk6nXAOq0ql8vl8nE5nEwmEwmk0ml0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDa7XZ7"
            "nU6nU6nUwmEwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G"
            "63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nU"
            "wmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/"
            "HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0m"
            "k0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb"
            "7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43"
            "G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6n"
            "UwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4"
            "/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0"
            "mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbD"
            "b7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G4"
            "3G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6"
            "nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W"
            "4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk"
            "0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYb"
            "Db7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G"
            "43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU"
            "6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63"
            "W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwm"
            "k0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HY"
            "bDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3"
            "G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6n"
            "U6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W6"
            "3W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmE"
            "wmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7"
            "HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1Go3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwmEwmEwmk0mk0Go1G"
            "o3G43G63W63W63W4/HY7HY7HYbDb7fZ7nU6nU6nUwH/BwBhkR7FRVUZQAAAAASUVORK5CYII="
        )

        results = []
        for name, data in summary.items():
            results.append(
                {
                    "name": name,
                    "total_units": data["total_units"],
                    "total_items": data["total_items"],
                    "total_value": float(data["total_value"]),
                    "cover_photo": data["cover_photo"] or fallback_image,
                }
            )

        results.sort(key=lambda x: x["name"].lower())
        return Response(results, status=200)

