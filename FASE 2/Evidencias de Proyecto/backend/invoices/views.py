from __future__ import annotations

import io
import re
from decimal import Decimal
from typing import Any, Dict, List, Tuple, Optional
from datetime import datetime

from django.http import HttpRequest, HttpResponseNotAllowed, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import FacturaVenta, CalendarEntry

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
        payload["type"] = tp if tp in {"factura_venta", "nota"} else "nota"
    invoice_sale = pick("invoice_sale")
    if invoice_sale:
        try:
            payload["invoice_sale"] = FacturaVenta.objects.get(pk=invoice_sale)
        except Exception:
            payload["invoice_sale"] = None
    return payload



