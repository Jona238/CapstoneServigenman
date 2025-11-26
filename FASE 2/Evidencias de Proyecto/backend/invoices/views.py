from __future__ import annotations

import io
import re
from decimal import Decimal
from typing import Any, Dict, List, Tuple, Optional
from datetime import datetime, date

from django.http import HttpRequest, HttpResponseNotAllowed, JsonResponse
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import FacturaVenta, CalendarEntry, FacturaCompra, MaterialCompra

# Optional dependencies (loaded lazily to avoid breaking if not installed yet)
try:  # pragma: no cover - optional import
    from PyPDF2 import PdfReader  # type: ignore
except Exception:  # pragma: no cover - optional import
    PdfReader = None

try:  # pragma: no cover - optional import
    from pdf2image import convert_from_bytes  # type: ignore
except Exception:  # pragma: no cover - optional import
    convert_from_bytes = None

try:  # pragma: no cover - optional import
    from PIL import Image  # type: ignore
except Exception:  # pragma: no cover - optional import
    Image = None

try:  # pragma: no cover - optional import
    import pytesseract  # type: ignore
except Exception:  # pragma: no cover - optional import
    pytesseract = None


InvoiceType = str


@csrf_exempt
def extract_invoice_data(request: HttpRequest):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    invoice_file = (
        request.FILES.get("file")
        or request.FILES.get("archivo")
        or request.FILES.get("attachment")
    )
    invoice_type: InvoiceType = str(request.POST.get("tipo_factura", "")).lower()

    if not invoice_file:
        return JsonResponse({"detail": "No se envió archivo de factura."}, status=400)

    if invoice_type not in {"compra", "venta"}:
        return JsonResponse(
            {"detail": "tipo_factura debe ser 'compra' o 'venta'."},
            status=400,
        )

    raw_bytes = invoice_file.read()
    warnings: List[str] = []
    if len(raw_bytes) > 15 * 1024 * 1024:
        return JsonResponse(
            {"detail": "El archivo supera los 15 MB permitidos."},
            status=413,
        )

    text, ocr_used, ocr_warnings = _extract_text_with_fallback(
        raw_bytes, filename=invoice_file.name
    )
    warnings.extend(ocr_warnings)

    fields, rule_warnings = _extract_fields_from_text(text, invoice_type)
    warnings.extend(rule_warnings)
    response = {
        "type": invoice_type,
        "raw_text": text,
        "ocr_used": ocr_used,
        "warnings": warnings,
        **fields,
    }
    return JsonResponse(response, status=200)


@csrf_exempt
def invoices_collection(request: HttpRequest):
    if request.method == "GET":
        items = [serialize_invoice(inv) for inv in FacturaVenta.objects.all()]
        return JsonResponse(items, safe=False, status=200)

    if request.method == "POST":
        payload = _parse_invoice_payload(request)
        instance = FacturaVenta.objects.create(**payload)
        if attachment := request.FILES.get("attachment"):
            instance.attachment = attachment
            instance.save(update_fields=["attachment"])
        _create_calendar_entry_for_invoice(instance, request)
        return JsonResponse(serialize_invoice(instance), status=201)

    return HttpResponseNotAllowed(["GET", "POST"])


@csrf_exempt
def invoice_detail(request: HttpRequest, invoice_id: str):
    invoice = get_object_or_404(FacturaVenta, pk=invoice_id)

    if request.method == "GET":
        return JsonResponse(serialize_invoice(invoice), status=200)

    if request.method == "DELETE":
        invoice.delete()
        return JsonResponse({"deleted": True, "id": invoice_id}, status=204)

    if request.method == "PUT":
        payload = _parse_invoice_payload(request)
        for field, value in payload.items():
            setattr(invoice, field, value)
        if request.FILES.get("attachment"):
            invoice.attachment = request.FILES["attachment"]
        invoice.save()
        if invoice.invoice_type == "venta":
            _create_calendar_entry_for_invoice(invoice, request, replace=True)
        return JsonResponse(serialize_invoice(invoice), status=200)

    return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])


def _extract_text_with_fallback(data: bytes, filename: str) -> Tuple[str, bool, List[str]]:
    name = filename.lower()
    warnings: List[str] = []
    text = ""
    ocr_used = False

    if name.endswith(".pdf"):
        text = _extract_text_from_pdf_bytes(data)
        if not text.strip():
            ocr_text, ocr_warnings = _extract_text_from_pdf_ocr(data)
            text = ocr_text
            warnings.extend(ocr_warnings)
            ocr_used = bool(text)
    else:
        if _is_ocr_ready():
            text, ocr_warnings = _extract_text_from_image_bytes(data)
            warnings.extend(ocr_warnings)
            ocr_used = True
        else:
            warnings.append("OCR no disponible. Instala Tesseract + pytesseract.")

    return text.strip(), ocr_used, warnings


def _extract_text_from_pdf_bytes(data: bytes) -> str:
    if not PdfReader:
        return ""
    try:
        reader = PdfReader(io.BytesIO(data))
        pages_text: List[str] = []
        for page in reader.pages:
            try:
                page_text = page.extract_text() or ""
            except Exception:
                page_text = ""
            if page_text:
                pages_text.append(page_text)
        return "\n".join(pages_text)
    except Exception:
        return ""


def _extract_text_from_pdf_ocr(data: bytes) -> Tuple[str, List[str]]:
    warnings: List[str] = []
    if not _is_ocr_ready():
        warnings.append("OCR no disponible. Instala Tesseract + pytesseract.")
        return "", warnings
    if not convert_from_bytes:
        warnings.append("Falta dependencia pdf2image para convertir PDFs.")
        return "", warnings
    images = []
    try:
        images = convert_from_bytes(data, fmt="png")
    except Exception:
        warnings.append("No se pudo convertir el PDF a imágenes para OCR.")
        return "", warnings

    ocr_chunks: List[str] = []
    for image in images:
        try:
            text = pytesseract.image_to_string(image, lang=_tesseract_lang())
            if text:
                ocr_chunks.append(text)
        except Exception:
            warnings.append("No se pudo correr OCR en una de las páginas.")
    return "\n".join(ocr_chunks), warnings


def _extract_text_from_image_bytes(data: bytes) -> Tuple[str, List[str]]:
    warnings: List[str] = []
    if not _is_ocr_ready():
        warnings.append("OCR no disponible. Instala Tesseract + pytesseract.")
        return "", warnings
    if not Image:
        warnings.append("Falta Pillow para procesar imágenes.")
        return "", warnings
    try:
        with Image.open(io.BytesIO(data)) as image:
            text = pytesseract.image_to_string(image, lang=_tesseract_lang())
            return text, warnings
    except Exception:
        warnings.append("No se pudo leer la imagen para OCR.")
        return "", warnings


def _tesseract_lang() -> str:
    # prefer Spanish, fallback to English if not available
    return "spa+eng"


def _is_ocr_ready() -> bool:
    return pytesseract is not None


def _extract_fields_from_text(text: str, invoice_type: InvoiceType) -> Tuple[Dict[str, Any], List[str]]:
    normalized = "\n".join(
        line.strip() for line in text.splitlines() if line.strip()
    )
    warnings: List[str] = []
    inferred_type = _guess_invoice_type(normalized)
    invoice_number = _find_invoice_number(normalized)
    issue_date = _find_issue_date(normalized)
    total_amount = _find_total_amount(normalized)
    net_amount, vat_amount = _compute_net_vat(total_amount)
    counterpart = _find_counterpart(normalized, invoice_type)
    rut = _find_client_rut(text) if invoice_type == "venta" else _find_rut(text)
    if not rut:
        rut = _find_rut(text)
    address = _find_address(text)
    contact = _find_contact(text)
    sale_qty, sale_unit_price = (
        _find_sale_quantity_unit_price(normalized, net_amount) if invoice_type == "venta" else (None, None)
    )

    if invoice_type == "compra":
        materials: List[Dict[str, str]] = []
        if inferred_type == "venta":
            warnings.append("Documento parece factura de venta, cambia a pestaña Venta")
        else:
            materials = _find_materials(normalized)
        return (
            {
                "invoice_number": invoice_number,
                "issue_date": issue_date,
                "supplier": counterpart,
                "total_amount": total_amount,
                "net_amount": net_amount,
                "vat_amount": vat_amount,
                "rut": rut,
                "address": address,
                "contact": contact,
                "materials": materials,
            },
            warnings,
        )

    work_description = _find_work_description(normalized)
    if invoice_type == "venta" and (sale_unit_price is None or sale_unit_price == ""):
        try:
            base_net = float(net_amount) if net_amount else (float(total_amount) / 1.19 if total_amount else 0.0)
            qty = sale_qty or 1
            if base_net > 0 and qty > 0:
                sale_unit_price = round(base_net / qty)
        except Exception:
            pass
    return (
        {
            "invoice_number": invoice_number,
            "issue_date": issue_date,
            "client": counterpart,
            "total_amount": total_amount,
            "net_amount": net_amount,
            "vat_amount": vat_amount,
            "work_description": work_description,
            "rut": rut,
            "address": address,
            "contact": contact,
            "quantity": sale_qty,
            "unit_price": sale_unit_price,
        },
        warnings,
    )


def _guess_invoice_type(text: str) -> InvoiceType | None:
    lower_text = text.lower()
    sale_markers = ["se\u00f1or", "senor", "servicio", "fve", "descripci\u00f3n del trabajo", "descripcion del trabajo"]
    if any(marker in lower_text for marker in sale_markers):
        return "venta"
    purchase_markers = ["codigo", "descripci\u00f3n", "descripcion", "cantidad", "precio", "subtotal"]
    if any(marker in lower_text for marker in purchase_markers):
        return "compra"
    return None


def _find_invoice_number(text: str) -> str | None:
    patterns = [
        r"factura\s*(?:electr[oó]nica)?\s*(?:n[oº°]|num|#)[:\s-]*([A-Za-z0-9-]+)",
        r"\bFVE\s*(?:n[oº°]|#)?[:\s-]*([A-Za-z0-9-]+)",
        r"\bN[oº°]\s*[:#]?\s*([A-Za-z0-9-]{3,})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None


def _find_issue_date(text: str) -> str | None:
    date_patterns = [
        r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b",
        r"\b(\d{4}[/-]\d{1,2}[/-]\d{1,2})\b",
        r"\b(\d{1,2}\s+(?:ene|feb|mar|abr|may|jun|jul|ago|set|sep|oct|nov|dic)[a-z]*\s+\d{2,4})",
        r"fecha\s*emisi[oó]n[:\s]*([0-3]?\d)\s+de\s+([a-záéíóúñ]+)\s+del?\s+(\d{4})",
    ]
    for pattern in date_patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            if len(match.groups()) == 3 and "emisi" in pattern:
                day = match.group(1).zfill(2)
                month_name = match.group(2).lower()
                year = match.group(3)
                month_map = {
                    "enero": "01",
                    "febrero": "02",
                    "marzo": "03",
                    "abril": "04",
                    "mayo": "05",
                    "junio": "06",
                    "julio": "07",
                    "agosto": "08",
                    "septiembre": "09",
                    "setiembre": "09",
                    "octubre": "10",
                    "noviembre": "11",
                    "diciembre": "12",
                }
                month = month_map.get(month_name)
                if month:
                    return f"{year}-{month}-{day}"
                return f"{day}/{month_name}/{year}"
            return match.group(1)
    return None


def _find_total_amount(text: str) -> str | None:
    primary = re.search(
        r"(total(?:\s+a\s+pagar)?|monto\s*total)\s*[:\-]?\s*\$?\s*([\d\.\s,]+)",
        text,
        flags=re.IGNORECASE,
    )
    if primary:
        cleaned = _clean_amount(primary.group(2))
        if cleaned:
            return cleaned

    amount_patterns = [
        r"(?:total(?:\s+general)?|monto\s+total|total\s+a\s+pagar)[^\d]{0,10}([\$]?\s?[0-9\.\, ]+)",
        r"\btotal\b[^\d]{0,5}([\$]?\s?[0-9\.\, ]+)",
    ]
    for pattern in amount_patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return _clean_amount(match.group(1))
    return None


def _clean_amount(value: str) -> str:
    clean = re.sub(r"[^\d,\.]", "", value or "")
    if not clean:
        return clean
    if "," in clean and "." in clean:
        if clean.rfind(",") > clean.rfind("."):
            clean = clean.replace(".", "").replace(",", ".")
        else:
            clean = clean.replace(",", "")
    elif "," in clean:
        clean = clean.replace(".", "").replace(",", ".")
    elif clean.count(".") > 1:
        clean = clean.replace(".", "")
    return clean


def _compute_net_vat(total_amount: str | None) -> Tuple[str | None, str | None]:
    if not total_amount:
        return None, None
    try:
        total = float(total_amount.replace(",", "."))
        net = round(total / 1.19)
        vat = round(total * 0.19)
        return str(net), str(vat)
    except Exception:
        return None, None


def _find_rut(text: str) -> str | None:
    patterns = [
        r"(R\.?\s*U\.?\s*T\.?\s*:?\s*)([\d\.]{4,15}-[\dkK])",
        r"(R\.?\s*U\.?\s*T\.?)\s*:\s*\n\s*([\d\.]{4,15}-[\dkK])",
        r"(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            candidate = match.group(match.lastindex).strip()
            # simple guard to avoid picking obvious dates or amounts
            if re.search(r"/", candidate):
                continue
            normalized = re.sub(r"[.\s]", "", candidate)
            if re.fullmatch(r"\d{7,9}-[\dkK]", normalized):
                return normalized
    return None


def _find_client_rut(text: str) -> str | None:
    match = re.search(
        r"SEÑOR\(ES\):\s*(.+?)\n\s*R\.?\s*U\.?\s*T\.?\s*[:\.]?\s*([0-9\.\s]+-\s*[\dkK])",
        text,
        flags=re.IGNORECASE,
    )
    if match:
        candidate = match.group(2)
        normalized = re.sub(r"[.\s]", "", candidate)
        if re.fullmatch(r"\d{7,9}-[\dkK]", normalized):
            return normalized
    return None


def _find_address(text: str) -> str | None:
    match = re.search(r"(Direcci[oó]n|Domicilio)\s*:\s*([^\n\r]+)", text, flags=re.IGNORECASE)
    if not match:
        match = re.search(r"(Direcci[oó]n|Domicilio)\s*:\s*\n\s*([^\n\r]+)", text, flags=re.IGNORECASE)
    if match:
        return match.group(2).strip()
    return None


def _find_contact(text: str) -> str | None:
    match = re.search(r"(Contacto|Atenci[oó]n|Atencion)\s*:\s*([^\n\r]+)", text, flags=re.IGNORECASE)
    if match:
        cand = match.group(2).strip()
        cand = re.split(r"(correo|email|tel[eé]fono|fono|celular)\s*:?", cand, flags=re.IGNORECASE)[0]
        return cand.strip(" -:,.")
    match = re.search(
        r"(Contacto|Fono|Tel[eé]fono|Tel|Email|Correo)\s*:\s*([^\n\r]+)",
        text,
        flags=re.IGNORECASE,
    )
    if match:
        cand = match.group(2).strip()
        return cand
    return None


def _find_sale_quantity_unit_price(text: str, net_amount: str | None = None) -> Tuple[int | None, int | None]:
    if not re.search(r"(cantidad|precio|valor|%impto|codigo)", text, flags=re.IGNORECASE):
        return 1, None

    pattern = r"(?P<qty>\d{1,2})\s+(?P<unit>\d{1,3}(?:\.\d{3})+)\s+(?P<value>\d{1,3}(?:\.\d{3})+)"
    match = re.search(pattern, text, flags=re.IGNORECASE)
    if not match:
        return 1, None

    qty = int(match.group("qty"))
    unit_price_raw = re.sub(r"[^\d]", "", match.group("unit") or "")
    try:
        unit_price = int(unit_price_raw) if unit_price_raw else None
    except Exception:
        unit_price = None

    if net_amount:
        try:
            net_clean = float(re.sub(r"[^\d]", "", net_amount))
            if unit_price:
                subtotal = qty * unit_price
                if net_clean > 0:
                    diff_ratio = abs(subtotal - net_clean) / net_clean
                    if diff_ratio > 0.05:
                        return 1, None
            else:
                unit_price = round(net_clean / qty) if qty > 0 else None
        except Exception:
            pass

    return qty, unit_price


def _find_counterpart(text: str, invoice_type: InvoiceType) -> str | None:
    # prioridad para venta: capturar cliente tras SEÑOR(ES)/SRES/CLIENTE, incluso con salto de línea
    multi = re.search(
        r"(SEÑOR\(ES\)|SENOR\(ES\)|SRES|CLIENTE)\s*:\s*([^\n\r]+)",
        text,
        flags=re.IGNORECASE,
    )
    if not multi:
        multi = re.search(
            r"(SEÑOR\(ES\)|SENOR\(ES\)|SRES|CLIENTE)\s*:\s*\n\s*([^\n\r]+)",
            text,
            flags=re.IGNORECASE,
        )
    if multi:
        candidate = multi.group(2).strip(" :-")
        if len(candidate) >= 4 and candidate.lower() not in {"es", "rut", "giro"}:
            return candidate.title()

    priority_pattern = "(SE[\u00d1N]OR(?:ES)?|SRES|CLIENTE)[^A-Za-z0-9]*([A-Za-z0-9 .,-]*)"
    lines = text.splitlines()
    for idx, line in enumerate(lines):
        match = re.search(priority_pattern, line, flags=re.IGNORECASE)
        if match:
            candidate = match.group(2).strip(" :-")
            if candidate:
                return candidate
            for following in lines[idx + 1 :]:
                if following.strip():
                    return following.strip(" :-")

    counterparts = [
        r"proveedor[:\s]+(.+)",
        r"cliente[:\s]+(.+)",
        r"raz[o\u00f3]n\s+social[:\s]+(.+)",
        r"se[\u00f1n]or(?:es)?[:\s]+(.+)",
    ]
    for pattern in counterparts:
        for line in text.splitlines():
            match = re.search(pattern, line, flags=re.IGNORECASE)
            if match:
                return match.group(1).strip(" :-")
    if invoice_type == "venta":
        # fallback to first uppercase line as client clue
        for line in text.splitlines():
            if line.isupper() and len(line.split()) <= 6:
                return line.title()
    return None

def _find_materials(text: str) -> List[Dict[str, str]]:
    materials: List[Dict[str, str]] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or len(line) < 5:
            continue
        lower_line = line.lower()
        stop_words = [
            "total",
            "sub total",
            "subtotal",
            "iva",
            "neto",
            "fecha",
            "octubre",
            "rut",
            "señor",
            "senor",
            "documento",
        ]
        month_markers = [
            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "setiembre",
            "octubre",
            "noviembre",
            "diciembre",
        ]
        if any(word in lower_line for word in stop_words + month_markers):
            continue
        if re.search(r"\d{1,2}[/-]\d{1,2}[/-]\d{2,4}", line):
            continue
        match = re.search(
            r"(?P<qty>\d{1,4}(?:[.,]\d+)?)\s*(?:unid(?:ad)?(?:es)?|uds?|x)?\s+(?P<desc>[A-Za-zÁÉÍÓÚÜÑáéíóúüñ 0-9\-\.,\s/]{4,})",
            line,
            flags=re.IGNORECASE,
        )
        if match:
            desc = match.group("desc").strip(" -.,").strip()
            qty_text = match.group("qty").replace(",", ".")
            try:
                qty_value = float(qty_text)
            except Exception:
                continue
            if qty_value < 1 or qty_value > 999:
                continue
            materials.append({"description": desc, "quantity": qty_text})
            if len(materials) >= 8:
                break
    return materials




def _find_work_description(text: str) -> Optional[str]:
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    if not lines:
        return None

    # 1) encontrar primera línea de ítem "-"
    start_idx = None
    for i, ln in enumerate(lines):
        if ln.startswith("-"):
            start_idx = i + 1
            break
    if start_idx is None or start_idx >= len(lines):
        return None

    # patrones de corte
    table_row_re = re.compile(
        r"\b\d{1,2}\s+\d{1,3}(?:\.\d{3})+\s+\d{1,3}(?:\.\d{3})+\b"
    )
    clp_re = re.compile(r"\b\d{1,3}(?:\.\d{3})+\b")

    stop_starts = (
        "referencias", "forma de pago", "timbre", "monto neto",
        "i.v.a", "iva", "total", "res.", "verifique documento", "sii"
    )
    col_headers = (
        "codigo", "descripción", "descripcion", "cantidad", "precio",
        "%impto", "impto", "valor", "adic.", "%desc"
    )

    collected: List[str] = []

    for ln in lines[start_idx:]:
        low = ln.lower()

        # stop por secciones posteriores
        if any(low.startswith(s) for s in stop_starts):
            break

        # stop por headers de columna (si aparecen al inicio)
        if any(re.match(rf"^\s*{re.escape(h)}\b", low) for h in col_headers):
            break

        # ---- CORTE INLINE: fila numérica pegada al texto ----
        m_table = table_row_re.search(ln)
        if m_table:
            # quedarse con el texto antes de los números
            prefix = ln[:m_table.start()].strip()
            # limpiar headers residuales adentro
            prefix_low = prefix.lower()
            if prefix and not any(h in prefix_low for h in col_headers):
                collected.append(prefix)
            break

        # ---- CORTE INLINE: 2+ montos CLP pegados ----
        money_like = clp_re.findall(ln)
        if len(money_like) >= 2:
            # guardar solo lo que hay antes del primer monto
            first_money = clp_re.search(ln)
            if first_money:
                prefix = ln[:first_money.start()].strip()
                prefix_low = prefix.lower()
                if prefix and not any(h in prefix_low for h in col_headers):
                    collected.append(prefix)
            break

        # si no es stop, limpiar headers sueltos dentro de la línea
        clean_ln = ln
        for h in col_headers:
            clean_ln = re.sub(rf"\b{re.escape(h)}\b", "", clean_ln, flags=re.I).strip()
        if clean_ln:
            collected.append(clean_ln)

    desc = " ".join(collected).strip()
    # limpieza final por si quedó algún monto suelto
    desc = re.sub(clp_re, "", desc).strip()
    desc = re.sub(r"\s{2,}", " ", desc)
    return desc or None


@csrf_exempt
def calendar_collection(request: HttpRequest):
    if request.method == "GET":
        date_from = request.GET.get("from")
        date_to = request.GET.get("to")
        entries = CalendarEntry.objects.all()
        if date_from:
            entries = entries.filter(date__gte=date_from)
        if date_to:
            entries = entries.filter(date__lte=date_to)
        return JsonResponse([serialize_calendar_entry(e) for e in entries], safe=False, status=200)

    if request.method == "POST":
        payload = _parse_calendar_payload(request)
        entry = CalendarEntry.objects.create(**payload)
        return JsonResponse(serialize_calendar_entry(entry), status=201)

    return HttpResponseNotAllowed(["GET", "POST"])


@csrf_exempt
def calendar_detail(request: HttpRequest, entry_id: str):
    entry = get_object_or_404(CalendarEntry, pk=entry_id)

    if request.method == "PATCH":
        payload = _parse_calendar_payload(request, partial=True)
        for field, value in payload.items():
            setattr(entry, field, value)
        entry.save()
        return JsonResponse(serialize_calendar_entry(entry), status=200)

    if request.method == "DELETE":
        entry.delete()
        return JsonResponse({"deleted": True, "id": entry_id}, status=204)

    return HttpResponseNotAllowed(["PATCH", "DELETE"])


def serialize_invoice(instance: FacturaVenta) -> Dict[str, Any]:
    return {
        "id": str(instance.id),
        "invoice_type": instance.invoice_type,
        "invoice_number": instance.invoice_number,
        "issue_date": instance.issue_date.isoformat() if instance.issue_date else "",
        "supplier": instance.supplier,
        "total_amount": float(instance.total_amount),
        "net_amount": float(instance.net_amount),
        "vat_amount": float(instance.vat_amount),
        "description": instance.description,
        "rut": instance.rut,
        "address": instance.address,
        "contact": instance.contact,
        "quantity": instance.quantity,
        "unit_price": float(instance.unit_price) if instance.unit_price is not None else None,
        "materials": instance.materials or [],
        "attachment": instance.attachment.url if instance.attachment else None,
        "created_at": instance.created_at.isoformat(),
    }


def _parse_invoice_payload(request: HttpRequest) -> Dict[str, Any]:
    data = request.POST or request.GET
    invoice_type = (data.get("tipo_factura") or data.get("invoice_type") or "compra").lower()
    issue_date = _parse_date(data.get("issue_date"))
    materials = data.get("materials")
    if materials:
        try:
            import json

            materials = json.loads(materials)
        except Exception:
            materials = None
    payload: Dict[str, Any] = {
        "invoice_type": invoice_type if invoice_type in {"compra", "venta"} else "compra",
        "invoice_number": data.get("invoice_number") or "",
        "issue_date": issue_date,
        "supplier": data.get("supplier") or data.get("client") or "",
        "rut": data.get("rut") or "",
        "address": data.get("address") or "",
        "contact": data.get("contact") or "",
        "description": data.get("description") or data.get("work_description") or "",
        "total_amount": _parse_decimal(data.get("amount") or data.get("total_amount")),
        "net_amount": _parse_decimal(data.get("net_amount")),
        "vat_amount": _parse_decimal(data.get("vat_amount")),
        "quantity": _parse_int(data.get("quantity")),
        "unit_price": _parse_decimal(data.get("unit_price")),
        "materials": materials,
    }
    return payload


def _parse_decimal(value: Any) -> Decimal:
    if value in (None, ""):
        return Decimal("0")
    try:
        return Decimal(str(value).replace(",", "")).quantize(Decimal("0.01"))
    except Exception:
        return Decimal("0")


def _parse_int(value: Any) -> Optional[int]:
    try:
        return int(value)
    except Exception:
        return None


def _parse_date(value: Any) -> Optional[Any]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value)).date()
    except Exception:
        try:
            return datetime.strptime(str(value), "%Y-%m-%d").date()
        except Exception:
            return None


def _create_calendar_entry_for_invoice(invoice: FacturaVenta, request: HttpRequest, replace: bool = False) -> None:
    if invoice.invoice_type != "venta" or not invoice.issue_date:
        return
    if replace:
        CalendarEntry.objects.filter(invoice_sale=invoice).delete()
    title = f"Factura Venta #{invoice.invoice_number or invoice.id} - {invoice.supplier or 'Cliente'}"
    CalendarEntry.objects.create(
        date=invoice.issue_date,
        type="factura_venta",
        title=title,
        description=invoice.description or "",
        invoice_sale=invoice,
    )


def serialize_calendar_entry(entry: CalendarEntry) -> Dict[str, Any]:
    return {
        "id": str(entry.id),
        "date": entry.date.isoformat(),
        "title": entry.title,
        "description": entry.description,
        "type": entry.type,
        "invoice_sale": str(entry.invoice_sale_id) if entry.invoice_sale_id else None,
        "invoice_purchase": entry.invoice_purchase_id,
        "created_at": entry.created_at.isoformat(),
    }


def _parse_calendar_payload(request: HttpRequest, partial: bool = False) -> Dict[str, Any]:
    data = request.POST or request.GET
    body_json: Dict[str, Any] = {}
    if request.content_type and "application/json" in request.content_type:
        try:
            import json
            body_json = json.loads(request.body.decode() or "{}")
        except Exception:
            body_json = {}
    def pick(key: str, default=None):
        return body_json.get(key) if key in body_json else data.get(key, default)

    date_val = pick("date")
    parsed_date = _parse_date(date_val) if date_val or not partial else None
    payload: Dict[str, Any] = {}
    if parsed_date:
        payload["date"] = parsed_date
    if (t := pick("title")) is not None:
        payload["title"] = t
    if (d := pick("description")) is not None:
        payload["description"] = d
    if (tp := pick("type")) is not None:
        allowed_types = {choice[0] for choice in CalendarEntry.ENTRY_TYPES}
        payload["type"] = tp if tp in allowed_types else "nota"
    invoice_sale = pick("invoice_sale")
    if invoice_sale:
        try:
            payload["invoice_sale"] = FacturaVenta.objects.get(pk=invoice_sale)
        except Exception:
            payload["invoice_sale"] = None
    invoice_purchase = pick("invoice_purchase")
    if invoice_purchase:
        try:
            payload["invoice_purchase"] = FacturaCompra.objects.get(pk=invoice_purchase)
        except Exception:
            payload["invoice_purchase"] = None
    return payload


# ---------------------------
# Facturas de compra
# ---------------------------

def serialize_purchase(instance: FacturaCompra) -> Dict[str, Any]:
    return {
        "id": instance.id,
        "supplier": instance.supplier,
        "issue_date": instance.issue_date.isoformat() if instance.issue_date else "",
        "rut": instance.rut,
        "net_amount": float(instance.net_amount),
        "tax_amount": float(instance.tax_amount),
        "total_amount": float(instance.total_amount),
        "payment_type": instance.payment_type,
        "cheque_bank": instance.cheque_bank,
        "cheque_number": instance.cheque_number,
        "cheque_due_date": instance.cheque_due_date.isoformat() if instance.cheque_due_date else None,
        "is_paid": instance.is_paid,
        "payment_method": instance.payment_method,
        "payment_status": instance.payment_status,
        "due_date": (instance.due_date or instance.cheque_due_date).isoformat() if (instance.due_date or instance.cheque_due_date) else None,
        "payment_notes": instance.payment_notes,
        "attachment": instance.attachment.url if instance.attachment else None,
        "materials": [
            {
                "id": material.id,
                "description": material.description,
                "quantity": material.quantity,
                "unit_price": float(material.unit_price) if material.unit_price is not None else None,
            }
            for material in instance.materials.all()
        ],
        "created_at": instance.created_at.isoformat(),
    }


@csrf_exempt
def purchase_invoices_collection(request: HttpRequest):
    if request.method == "GET":
        items = FacturaCompra.objects.all().prefetch_related("materials").order_by("-issue_date", "-created_at")
        return JsonResponse([serialize_purchase(item) for item in items], safe=False, status=200)

    if request.method == "POST":
        payload, files = _parse_purchase_payload(request)
        required_errors = []
        if not payload.get("supplier"):
            required_errors.append("supplier es requerido")
        if not payload.get("issue_date"):
            required_errors.append("issue_date es requerido (YYYY-MM-DD)")
        if not payload.get("total_amount"):
            required_errors.append("total_amount es requerido")
        if required_errors:
            return JsonResponse({"detail": required_errors}, status=400)
        try:
            materials = payload.pop("materials", [])
            factura = FacturaCompra.objects.create(**payload)
            if files.get("attachment"):
                factura.attachment = files["attachment"]
                factura.save(update_fields=["attachment"])
            _replace_materials(factura, materials)
            sync_materials_to_inventory(factura)
            _sync_calendar_for_purchase(factura, replace=True)
            return JsonResponse(serialize_purchase(factura), status=201)
        except Exception as exc:
            return JsonResponse({"detail": str(exc)}, status=400)

    return HttpResponseNotAllowed(["GET", "POST"])


@csrf_exempt
def purchase_invoice_detail(request: HttpRequest, pk: int):
    factura = get_object_or_404(FacturaCompra, pk=pk)

    if request.method == "GET":
        return JsonResponse(serialize_purchase(factura), status=200)

    if request.method == "PUT":
        payload, files = _parse_purchase_payload(request)
        materials = payload.pop("materials", None)
        for field in [
            "supplier",
            "issue_date",
            "rut",
            "net_amount",
            "tax_amount",
            "total_amount",
            "payment_type",
            "cheque_bank",
            "cheque_number",
            "cheque_due_date",
            "is_paid",
            "payment_method",
            "payment_status",
            "due_date",
            "payment_notes",
        ]:
            if field in payload:
                setattr(factura, field, payload[field])
        if files.get("attachment"):
            factura.attachment = files["attachment"]
        factura.save()
        if materials is not None:
            _replace_materials(factura, materials)
            sync_materials_to_inventory(factura)
        _sync_calendar_for_purchase(factura, replace=True)
        return JsonResponse(serialize_purchase(factura), status=200)

    if request.method == "DELETE":
        CalendarEntry.objects.filter(invoice_purchase=factura).delete()
        factura.delete()
        return JsonResponse({"deleted": True, "id": pk}, status=204)

    return HttpResponseNotAllowed(["GET", "PUT", "DELETE"])


def _parse_purchase_payload(request: HttpRequest) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    data: Dict[str, Any] = {}
    files: Dict[str, Any] = {}
    if request.content_type and "application/json" in request.content_type:
        try:
            import json
            data = json.loads(request.body.decode() or "{}")
        except Exception:
            data = {}
    else:
        data = request.POST.dict()
        files = request.FILES
    materials_raw = data.get("materials") or []
    if isinstance(materials_raw, str):
        try:
            import json
            materials_raw = json.loads(materials_raw)
        except Exception:
            materials_raw = []
    materials: List[Dict[str, Any]] = []
    for item in materials_raw:
        desc = (item.get("description") or "").strip()
        qty = item.get("quantity") or 0
        if not desc:
            continue
        try:
            qty_int = int(qty)
        except Exception:
            qty_int = 1
        qty_int = max(1, qty_int)
        materials.append(
            {
                "description": desc,
                "quantity": qty_int,
                "unit_price": _parse_decimal(item.get("unit_price")),
            }
        )
    payment_type = (data.get("payment_type") or "contado").lower()
    if payment_type not in {"contado", "transferencia", "cheque"}:
        payment_type = "contado"
    payment_method = (data.get("payment_method") or payment_type or "contado").lower()
    if payment_method not in {"contado", "transferencia", "cheque"}:
        payment_method = "contado"
    payment_status = (data.get("payment_status") or "pendiente").lower()
    if payment_status not in {"pendiente", "pagado", "parcial"}:
        payment_status = "pendiente"
    due_date_val = data.get("due_date") or data.get("cheque_due_date")
    payload = {
        "supplier": data.get("supplier", ""),
        "issue_date": _parse_date(data.get("issue_date")),
        "rut": data.get("rut", ""),
        "net_amount": _parse_decimal(data.get("net_amount")),
        "tax_amount": _parse_decimal(data.get("tax_amount")),
        "total_amount": _parse_decimal(data.get("total_amount")),
        "materials": materials,
        "payment_type": payment_type,
        "cheque_bank": data.get("cheque_bank", ""),
        "cheque_number": data.get("cheque_number", ""),
        "cheque_due_date": _parse_date(data.get("cheque_due_date")),
        "is_paid": str(data.get("is_paid", "")).lower() in {"true", "1", "yes"},
        "payment_method": payment_method,
        "payment_status": payment_status,
        "due_date": _parse_date(due_date_val),
        "payment_notes": data.get("payment_notes", ""),
    }
    return payload, files


def _replace_materials(factura: FacturaCompra, materials: List[Dict[str, Any]]):
    factura.materials.all().delete()
    material_objs: List[MaterialCompra] = []
    for item in materials:
        desc = (item.get("description") or "").strip()
        if not desc:
            continue
        qty = item.get("quantity", 1) or 1
        try:
            qty_int = int(qty)
        except Exception:
            qty_int = 1
        qty_int = max(1, qty_int)
        material_objs.append(
            MaterialCompra(
                factura=factura,
                description=desc,
                quantity=qty_int,
                unit_price=item.get("unit_price"),
            )
        )
    if material_objs:
        MaterialCompra.objects.bulk_create(material_objs)


def _sync_calendar_for_purchase(factura: FacturaCompra, replace: bool = False) -> None:
    if replace:
        CalendarEntry.objects.filter(invoice_purchase=factura).exclude(type="factura_venta").delete()

    # Factura de compra
    if factura.issue_date:
        CalendarEntry.objects.update_or_create(
            invoice_purchase=factura,
            type="factura_compra",
            defaults={
                "date": factura.issue_date,
                "title": f"Factura Compra #{factura.id} - {factura.supplier}",
                "description": f"Monto: {factura.total_amount}",
            },
        )
    else:
        CalendarEntry.objects.filter(invoice_purchase=factura, type="factura_compra").delete()

    # Pago pendiente (cheque) -> nuevo tipo pago_compra
    if (
        factura.payment_method == "cheque"
        and factura.payment_status != "pagado"
        and factura.due_date
    ):
        desc_parts = [f"Monto: {factura.total_amount}"]
        if factura.cheque_bank:
            desc_parts.append(f"Banco: {factura.cheque_bank}")
        if factura.cheque_number:
            desc_parts.append(f"Número: {factura.cheque_number}")
        if factura.payment_notes:
            desc_parts.append(f"Notas: {factura.payment_notes}")
        CalendarEntry.objects.update_or_create(
            invoice_purchase=factura,
            type="pago_compra",
            defaults={
                "date": factura.due_date,
                "title": f"Pago cheque compra #{factura.id} - {factura.supplier}",
                "description": " | ".join(desc_parts) or "Pago pendiente",
            },
        )
    else:
        CalendarEntry.objects.filter(invoice_purchase=factura, type__in=["pago_compra", "pago_pendiente"]).delete()


def sync_materials_to_inventory(invoice):
    """
    Sincroniza materiales de una factura de compra hacia inventario (Item).
    """
    from inventory.models import Item

    materials = invoice.materials.all()

    for m in materials:
        desc = (m.description or "").strip()
        qty = int(m.quantity or 0)
        price = m.unit_price or 0

        if not desc or qty <= 0:
            continue

        existing = Item.objects.filter(recurso__iexact=desc).first()

        if existing:
            existing.cantidad = (existing.cantidad or 0) + qty
            if price and price > 0:
                existing.precio = price
            existing.save()
        else:
            Item.objects.create(
                recurso=desc,
                categoria="Por clasificar",
                cantidad=qty,
                precio=price if price > 0 else 0,
                info="Agregado desde factura de compra",
            )


@csrf_exempt
def purchase_summary(request: HttpRequest):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    today = date.today()
    pending_qs = FacturaCompra.objects.filter(
        payment_method="cheque",
        payment_status__in=["pendiente", "parcial"],
        due_date__isnull=False,
    )

    total_pending = pending_qs.aggregate(total=Sum("total_amount"))["total"] or Decimal("0")

    qs = pending_qs.filter(due_date__gte=today)

    by_month = (
        qs.annotate(month=TruncMonth("due_date"))
        .values("month")
        .annotate(amount=Sum("total_amount"))
        .order_by("month")
    )

    pending_by_month = [
        {"month": value["month"].strftime("%Y-%m") if value["month"] else "", "amount": float(value["amount"] or 0)}
        for value in by_month
    ]

    upcoming_payments = [
        {
            "id": obj.id,
            "supplier": obj.supplier,
            "due_date": obj.due_date.isoformat() if obj.due_date else None,
            "total_amount": float(obj.total_amount),
            "payment_method": obj.payment_method,
            "payment_status": obj.payment_status,
        }
        for obj in qs.order_by("due_date")
    ]

    return JsonResponse(
        {
            "total_debt": float(total_pending),
            "upcoming_payments": upcoming_payments,
            "pending_by_month": pending_by_month,
        },
        status=200,
    )



