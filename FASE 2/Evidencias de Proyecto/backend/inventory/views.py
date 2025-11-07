from __future__ import annotations

import json
from decimal import Decimal

from functools import wraps

from django.http import JsonResponse, HttpRequest, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.contrib.auth.models import AnonymousUser

from .models import Item, PendingChange


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


def _require_auth(request: HttpRequest):
    user = getattr(request, "user", None)
    if not user or isinstance(user, AnonymousUser) or not user.is_authenticated:
        return JsonResponse({"detail": "Not authenticated"}, status=401)
    return None


def _is_developer(user) -> bool:
    try:
        return bool(user and (user.is_staff or user.groups.filter(name="developer").exists() or user.username == "jona"))
    except Exception:
        return False


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
        if not _is_developer(user):
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
        if not _is_developer(user):
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
        if _is_developer(user):
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
    if not _is_developer(user):
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
    if not _is_developer(user):
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
    if not _is_developer(user):
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
    if not _is_developer(user):
        return JsonResponse({"detail": "Forbidden"}, status=403)
    count = PendingChange.objects.filter(status=PendingChange.STATUS_PENDING).count()
    return JsonResponse({"pending": count}, status=200)

