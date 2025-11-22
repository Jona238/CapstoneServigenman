from __future__ import annotations

import io
import re
from typing import Any, Dict, List, Tuple

from django.http import (
    HttpRequest,
    HttpResponseNotAllowed,
    JsonResponse,
)
from django.views.decorators.csrf import csrf_exempt

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

    fields = _extract_fields_from_text(text, invoice_type)
    response = {
        "type": invoice_type,
        "raw_text": text,
        "ocr_used": ocr_used,
        "warnings": warnings,
        **fields,
    }
    return JsonResponse(response, status=200)


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


def _extract_fields_from_text(text: str, invoice_type: InvoiceType) -> Dict[str, Any]:
    normalized = "\n".join(
        line.strip() for line in text.splitlines() if line.strip()
    )
    invoice_number = _find_invoice_number(normalized)
    issue_date = _find_issue_date(normalized)
    total_amount = _find_total_amount(normalized)
    counterpart = _find_counterpart(normalized, invoice_type)

    if invoice_type == "compra":
        materials = _find_materials(normalized)
        return {
            "invoice_number": invoice_number,
            "issue_date": issue_date,
            "supplier": counterpart,
            "total_amount": total_amount,
            "materials": materials,
        }

    work_description = _find_work_description(normalized)
    return {
        "invoice_number": invoice_number,
        "issue_date": issue_date,
        "client": counterpart,
        "total_amount": total_amount,
        "work_description": work_description,
    }


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
    ]
    for pattern in date_patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return match.group(1)
    return None


def _find_total_amount(text: str) -> str | None:
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
    # normalize comma decimals to dot and remove thousands separators heuristically
    if clean.count(",") == 1 and clean.count(".") > 1:
        # "1.234,56" -> "1234.56"
        clean = clean.replace(".", "").replace(",", ".")
    elif clean.count(",") == 1 and clean.count(".") == 0:
        # "1234,56" -> "1234.56"
        clean = clean.replace(",", ".")
    return clean


def _find_counterpart(text: str, invoice_type: InvoiceType) -> str | None:
    counterparts = [
        r"proveedor[:\s]+(.+)",
        r"cliente[:\s]+(.+)",
        r"raz[oó]n\s+social[:\s]+(.+)",
        r"señor(?:es)?[:\s]+(.+)",
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
        if re.search(r"total|sub\s*total|iva", line, flags=re.IGNORECASE):
            continue
        match = re.search(
            r"(?P<qty>\d{1,4}(?:[.,]\d+)?)\s*(?:unid(?:ad)?(?:es)?|uds?|x)?\s+(?P<desc>[A-Za-zÁÉÍÓÚÜÑ0-9\-\.,\s/]{4,})",
            line,
            flags=re.IGNORECASE,
        )
        if match:
            desc = match.group("desc").strip(" -.,").strip()
            qty = match.group("qty").replace(",", ".")
            materials.append({"description": desc, "quantity": qty})
            if len(materials) >= 8:
                break
    return materials


def _find_work_description(text: str) -> str | None:
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    keywords = {"servicio", "trabajo", "mant", "mantención", "descripcion", "descripción", "glosa"}
    candidates = [
        ln for ln in lines if any(kw in ln.lower() for kw in keywords)
    ]
    if candidates:
        return " ".join(candidates[:3]).strip()
    # Fallback to a concise slice of the body
    snippet = " ".join(lines[:4]).strip()
    return snippet or None
