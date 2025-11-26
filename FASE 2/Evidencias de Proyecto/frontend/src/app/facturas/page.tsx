"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/hooks/useCurrency";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

type InvoiceType = "compra" | "venta";

type InvoiceForm = {
  invoiceNumber: string;
  issueDate: string;
  supplier: string;
  amount: string;
  netAmount: string;
  vatAmount: string;
  description: string;
  rut: string;
  address: string;
  contact: string;
  quantity: string;
  unitPrice: string;
  paymentType?: string;
  chequeBank?: string;
  chequeNumber?: string;
  chequeDueDate?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  dueDate?: string;
  paymentNotes?: string;
};

type MaterialRow = {
  description: string;
  quantity: string;
  unitPrice?: string;
};

type PurchaseMaterialRow = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

type PurchaseInvoice = {
  id: string;
  supplier: string;
  issue_date: string;
  rut: string;
  net_amount: number;
  tax_amount: number;
  total_amount: number;
  materials: PurchaseMaterialRow[];
};

type InvoiceAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
};

type InvoiceRecord = InvoiceForm & {
  id: string;
  type: InvoiceType;
  amountNumber: number;
  netAmountNumber: number;
  vatAmountNumber: number;
  quantityNumber?: number;
  unitPriceNumber?: number;
  createdAt: string;
  attachment?: InvoiceAttachment;
  materials?: MaterialRow[];
  paymentType?: string;
  chequeBank?: string;
  chequeNumber?: string;
  chequeDueDate?: string;
};

type ValidationErrors = Partial<Record<keyof InvoiceForm, string>> & {
  file?: string;
};

const STORAGE_KEY = "servigenman_invoices_v2";
const STORAGE_KEYS = [STORAGE_KEY, "servigenman_invoices_v1"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const DEFAULT_FORM: InvoiceForm = {
  invoiceNumber: "",
  issueDate: "",
  supplier: "",
  amount: "",
  netAmount: "",
  vatAmount: "",
  description: "",
  rut: "",
  address: "",
  contact: "",
  quantity: "",
  unitPrice: "",
  paymentType: "contado",
  chequeBank: "",
  chequeNumber: "",
  chequeDueDate: "",
  paymentMethod: "contado",
  paymentStatus: "pendiente",
  dueDate: "",
  paymentNotes: "",
};

const DEFAULT_FORMS: Record<InvoiceType, InvoiceForm> = {
  compra: { ...DEFAULT_FORM },
  venta: { ...DEFAULT_FORM },
};

const DEFAULT_ERRORS: Record<InvoiceType, ValidationErrors> = {
  compra: {},
  venta: {},
};

const DEFAULT_MATERIALS: Record<InvoiceType, MaterialRow[]> = {
  compra: [],
  venta: [],
};

const DEFAULT_FILES: Record<InvoiceType, File | null> = {
  compra: null,
  venta: null,
};

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export default function InvoicesPage() {
  useBodyClass();
  const { t, locale } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<InvoiceType>("compra");
  const [forms, setForms] = useState<Record<InvoiceType, InvoiceForm>>(DEFAULT_FORMS);
  const [materials, setMaterials] = useState<Record<InvoiceType, MaterialRow[]>>(DEFAULT_MATERIALS);
  const [errors, setErrors] = useState<Record<InvoiceType, ValidationErrors>>(DEFAULT_ERRORS);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState<InvoiceRecord[]>([]);
  const [files, setFiles] = useState<Record<InvoiceType, File | null>>(DEFAULT_FILES);
  const [purchaseMaterials, setPurchaseMaterials] = useState<PurchaseMaterialRow[]>([
    { id: createId(), description: "", quantity: "1", unitPrice: "" },
  ]);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormPanel, setShowFormPanel] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    year: "",
    month: "",
    client: "",
    minAmount: "",
    maxAmount: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;
  const fileInputRefs = useRef<Record<InvoiceType, HTMLInputElement | null>>({
    compra: null,
    venta: null,
  });

  const apiBaseUrl = useMemo(() => {
    const sanitize = (u: string) => u.replace(/\/+$/, "");
    const env = process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
    if (env) return sanitize(env);
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return sanitize("http://localhost:8000");
      }
      return sanitize(window.location.origin);
    }
    return "";
  }, []);

  const fetchInvoicesFromApi = useCallback(async () => {
    if (!apiBaseUrl) return;
    try {
      const response = await fetch(`${apiBaseUrl}/api/invoices/`, { credentials: "include" });
      if (!response.ok) return;
      const data = await response.json();
      const items = Array.isArray(data) ? data : data.results || [];
      const normalized = items.map(mapApiInvoiceToRecord);
      setInvoices(normalized);
    } catch {
      // ignore network errors
    }
  }, [apiBaseUrl]);

  const fetchPurchaseInvoicesFromApi = useCallback(async () => {
    if (!apiBaseUrl) return;
    try {
      const response = await fetch(`${apiBaseUrl}/api/purchase-invoices/`, { credentials: "include" });
      if (!response.ok) return;
      const data = await response.json();
      const items = Array.isArray(data) ? data : data.results || [];
      const normalized: InvoiceRecord[] = items.map((item: any) => ({
        id: String(item.id || createId()),
        type: "compra",
        invoiceNumber: item.invoice_number || "",
        issueDate: item.issue_date || "",
        supplier: item.supplier || "",
        amount: String(item.total_amount || 0),
        netAmount: String(item.net_amount || 0),
        vatAmount: String(item.tax_amount || 0),
        paymentType: item.payment_type || "contado",
        paymentMethod: item.payment_method || item.payment_type || "contado",
        paymentStatus: item.payment_status || "pendiente",
        dueDate: item.due_date || item.cheque_due_date || "",
        paymentNotes: item.payment_notes || "",
        chequeBank: item.cheque_bank || "",
        chequeNumber: item.cheque_number || "",
        chequeDueDate: item.cheque_due_date || "",
        description: "",
        rut: item.rut || "",
        address: "",
        contact: "",
        quantity: "",
        unitPrice: "",
        amountNumber: Number(item.total_amount || 0),
        netAmountNumber: Number(item.net_amount || 0),
        vatAmountNumber: Number(item.tax_amount || 0),
        quantityNumber: undefined,
        unitPriceNumber: undefined,
        createdAt: item.created_at || "",
        materials: Array.isArray(item.materials)
          ? item.materials.map((m: any, idx: number) => ({
              description: m.description || `Material ${idx + 1}`,
              quantity: String(m.quantity || 1),
              unitPrice: m.unit_price !== null && m.unit_price !== undefined ? String(m.unit_price) : "",
            }))
          : [],
      }));
      setPurchaseInvoices(normalized);
    } catch {
      // ignore network errors
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    try {
      let cached: string | null = null;
      for (const key of STORAGE_KEYS) {
        const value = localStorage.getItem(key);
        if (value) {
          cached = value;
          break;
        }
      }
      if (!cached) return;
      const parsed: InvoiceRecord[] = JSON.parse(cached);
      const normalized = parsed.map((invoice) => ({
        ...invoice,
        type: invoice.type === "venta" ? "venta" : "compra",
        amountNumber:
          typeof invoice.amountNumber === "number" && !Number.isNaN(invoice.amountNumber)
            ? invoice.amountNumber
            : parseAmount(invoice.amount),
        netAmountNumber:
          typeof invoice.netAmountNumber === "number" && !Number.isNaN(invoice.netAmountNumber)
            ? invoice.netAmountNumber
            : parseAmount(invoice.netAmount),
        vatAmountNumber:
          typeof invoice.vatAmountNumber === "number" && !Number.isNaN(invoice.vatAmountNumber)
            ? invoice.vatAmountNumber
            : parseAmount(invoice.vatAmount),
        materials: invoice.materials || [],
        rut: invoice.rut || "",
        address: invoice.address || "",
        contact: invoice.contact || "",
        netAmount: invoice.netAmount || "",
        vatAmount: invoice.vatAmount || "",
        quantity: invoice.quantity || "",
        unitPrice: invoice.unitPrice || "",
        quantityNumber: invoice.quantityNumber || undefined,
        unitPriceNumber: invoice.unitPriceNumber || undefined,
      }));
      setInvoices(normalized);
    } catch {
      // ignore invalid cache
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return () => {};
    }
    const layoutClass = "inventory-layout";
    document.body.classList.add(layoutClass);
    return () => {
      document.body.classList.remove(layoutClass);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    } catch {
      // ignore quota issues
    }
  }, [invoices]);

  useEffect(() => {
    fetchInvoicesFromApi();
    fetchPurchaseInvoicesFromApi();
  }, [fetchInvoicesFromApi, fetchPurchaseInvoicesFromApi]);

  const currentForm = forms[activeTab];
  const currentErrors = errors[activeTab];
  const currentFile = files[activeTab];
  const currentMaterials = materials[activeTab];
  const calculatedIva = useMemo(() => {
    const amt = parseAmount(currentForm.amount);
    const netCandidate = parseAmount(currentForm.netAmount);
    const result = computeNetVat(amt, netCandidate);
    return result.vat;
  }, [currentForm.amount, currentForm.netAmount]);

  const computedNet = useMemo(() => {
    const amt = parseAmount(currentForm.amount);
    const netCandidate = parseAmount(currentForm.netAmount);
    const result = computeNetVat(amt, netCandidate);
    return result.net;
  }, [currentForm.amount, currentForm.netAmount]);

  const handleTabChange = (nextTab: InvoiceType) => {
    setActiveTab(nextTab);
    setStatusMessage(null);
  };

  const handleInputChange =
    (field: keyof InvoiceForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForms((prev) => {
        let nextForm = applyAmountSideEffects(prev[activeTab], field, event.target.value);
        if (activeTab === "venta") {
          if (field === "netAmount") {
            const netVal = parseAmount(nextForm.netAmount);
            if (netVal > 0) {
              const vat = Math.round(netVal * 0.19);
              nextForm = { ...nextForm, vatAmount: String(vat), amount: String(netVal + vat) };
            }
          }
          if (field === "quantity" || field === "unitPrice") {
            const qty = parseInt(nextForm.quantity || "0", 10) || 0;
            const unit = parseAmount(nextForm.unitPrice);
            if (qty > 0 && unit > 0) {
              const netVal = qty * unit;
              const vat = Math.round(netVal * 0.19);
              nextForm = {
                ...nextForm,
                netAmount: String(netVal),
                vatAmount: String(vat),
                amount: String(netVal + vat),
              };
            }
          }
        }
        return { ...prev, [activeTab]: nextForm };
      });
      setErrors((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], [field]: undefined },
      }));
    };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, tab: InvoiceType) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) {
      setFiles((prev) => ({ ...prev, [tab]: null }));
      setErrors((prev) => ({ ...prev, [tab]: { ...prev[tab], file: undefined } }));
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        [tab]: { ...prev[tab], file: t.invoices.errors.fileTooLarge },
      }));
      event.target.value = "";
      setFiles((prev) => ({ ...prev, [tab]: null }));
      return;
    }
    setFiles((prev) => ({ ...prev, [tab]: nextFile }));
    setErrors((prev) => ({ ...prev, [tab]: { ...prev[tab], file: undefined } }));
  };

  const validations = (form: InvoiceForm, file: File | null): ValidationErrors => {
    const nextErrors: ValidationErrors = {};
    if (!form.invoiceNumber.trim()) {
      nextErrors.invoiceNumber = t.invoices.errors.invoiceRequired;
    }
    if (!form.issueDate) {
      nextErrors.issueDate = t.invoices.errors.dateRequired;
    }
    if (!form.supplier.trim()) {
      nextErrors.supplier = t.invoices.errors.supplierRequired;
    }
    const amountValue = parseAmount(form.amount);
    if (!form.amount || Number.isNaN(amountValue) || amountValue <= 0) {
      nextErrors.amount = t.invoices.errors.amountInvalid;
    }
    if (file && file.size > MAX_FILE_SIZE) {
      nextErrors.file = t.invoices.errors.fileTooLarge;
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    if (activeTab === "compra") {
      const validationErrors: ValidationErrors = {};
      if (!currentForm.supplier.trim()) validationErrors.supplier = t.invoices.errors.supplierRequired;
      if (!currentForm.issueDate) validationErrors.issueDate = t.invoices.errors.dateRequired;
      if (!currentForm.netAmount || parseAmount(currentForm.netAmount) <= 0) {
        validationErrors.netAmount = t.invoices.errors.amountInvalid;
      }
      if (!currentForm.amount || parseAmount(currentForm.amount) <= 0) {
        validationErrors.amount = t.invoices.errors.amountInvalid;
      }
      if (Object.keys(validationErrors).length) {
        setErrors((prev) => ({ ...prev, [activeTab]: validationErrors }));
        return;
      }
      setIsSubmitting(true);
      try {
        await persistPurchase(Boolean(editingId), editingId || undefined);
        setForms((prev) => ({ ...prev, compra: { ...DEFAULT_FORM } }));
        setPurchaseMaterials([{ id: createId(), description: "", quantity: "1", unitPrice: "" }]);
        setFiles((prev) => ({ ...prev, compra: null }));
        if (fileInputRefs.current.compra) {
          fileInputRefs.current.compra!.value = "";
        }
        setEditingId(null);
        setShowFormPanel(false);
        setStatusMessage({ type: "success", text: t.invoices.messages.saved });
      } catch {
        setStatusMessage({ type: "error", text: t.invoices.messages.error });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const validationErrors = validations(currentForm, currentFile);
    if (Object.keys(validationErrors).length) {
      setErrors((prev) => ({ ...prev, [activeTab]: validationErrors }));
      return;
    }

    setIsSubmitting(true);
    setErrors(DEFAULT_ERRORS);
    try {
      const amountNumber = parseAmount(currentForm.amount);
      let attachment: InvoiceAttachment | undefined;
      if (currentFile) {
        const dataUrl = await toBase64(currentFile);
        attachment = {
          id: createId(),
          name: currentFile.name,
          size: currentFile.size,
          type: currentFile.type,
          dataUrl,
        };
      }

      const netAmountNumber = parseAmount(currentForm.netAmount);
      const netVat = computeNetVat(amountNumber, netAmountNumber);
      const vatAmountNumber = netVat.vat;
      const quantityNumber = currentForm.quantity ? parseInt(currentForm.quantity, 10) || 0 : undefined;
      const unitPriceNumber = parseAmount(currentForm.unitPrice);

      const record: InvoiceRecord = {
        ...currentForm,
        type: activeTab,
        id: editingId || createId(),
        amountNumber,
        netAmountNumber: netVat.net,
        vatAmountNumber,
        quantityNumber,
        unitPriceNumber,
        createdAt: new Date().toISOString(),
        attachment,
        materials: activeTab === "compra" ? currentMaterials : undefined,
      };

      await persistInvoice(record, currentFile, Boolean(editingId));

      setInvoices((prev) =>
        editingId ? prev.map((item) => (item.id === editingId ? record : item)) : [record, ...prev],
      );
      setForms((prev) => ({ ...prev, [activeTab]: { ...DEFAULT_FORM } }));
      setMaterials((prev) => ({ ...prev, [activeTab]: [] }));
      setFiles((prev) => ({ ...prev, [activeTab]: null }));
      if (fileInputRefs.current[activeTab]) {
        fileInputRefs.current[activeTab]!.value = "";
      }
      setEditingId(null);
      setShowFormPanel(false);
      fetchInvoicesFromApi();
      setStatusMessage({ type: "success", text: t.invoices.messages.saved });
    } catch {
      setStatusMessage({ type: "error", text: t.invoices.messages.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const persistInvoice = async (record: InvoiceRecord, attachment: File | null, isEdit: boolean) => {
    if (!apiBaseUrl) return;
    try {
      const payload = new FormData();
      payload.append("invoice_number", record.invoiceNumber);
      payload.append("issue_date", record.issueDate);
      payload.append("supplier", record.supplier);
      payload.append("amount", String(record.amountNumber));
      payload.append("net_amount", String(record.netAmountNumber));
      payload.append("vat_amount", String(record.vatAmountNumber));
      payload.append("description", record.description);
      payload.append("tipo_factura", record.type);
      if (record.rut) {
        payload.append("rut", record.rut);
      }
      if (record.address) {
        payload.append("address", record.address);
      }
      if (record.contact) {
        payload.append("contact", record.contact);
      }
      if (record.materials?.length) {
        payload.append("materials", JSON.stringify(record.materials));
      }
      if (record.quantityNumber) {
        payload.append("quantity", String(record.quantityNumber));
      }
      if (record.unitPriceNumber) {
        payload.append("unit_price", String(record.unitPriceNumber));
      }
      if (record.id) {
        payload.append("id", record.id);
      }
      payload.append("source", "frontend-demo");
      if (attachment) {
        payload.append("attachment", attachment);
      }
      const endpoint = isEdit ? `${apiBaseUrl}/api/invoices/${record.id}/` : `${apiBaseUrl}/api/invoices/`;
      const method = isEdit ? "PUT" : "POST";
      await fetch(endpoint, {
        method,
        credentials: "include",
        body: payload,
      }).catch(() => {
        // Ignore network issues; optimistic update
      });
    } catch {
      // swallow errors to avoid blocking UI
    }
  };

  const persistPurchase = async (isEdit: boolean, id?: string) => {
    if (!apiBaseUrl) return;
    const materialsPayload = purchaseMaterials
      .filter((m) => m.description.trim())
      .map((m) => ({
        description: m.description.trim(),
        quantity: Number(m.quantity) || 1,
        unit_price: m.unitPrice === "" ? null : Number(m.unitPrice),
      }));

    const body = {
      supplier: forms.compra.supplier,
      issue_date: forms.compra.issueDate,
      rut: forms.compra.rut,
      net_amount: Number(forms.compra.netAmount || 0),
      tax_amount: Number(forms.compra.vatAmount || 0),
      total_amount: Number(forms.compra.amount || 0),
      payment_type: forms.compra.paymentType || "contado",
      payment_method: forms.compra.paymentMethod || forms.compra.paymentType || "contado",
      payment_status: forms.compra.paymentStatus || "pendiente",
      due_date: forms.compra.dueDate || null,
      payment_notes: forms.compra.paymentNotes || "",
      cheque_bank: forms.compra.chequeBank || "",
      cheque_number: forms.compra.chequeNumber || "",
      cheque_due_date: forms.compra.chequeDueDate || null,
      materials: materialsPayload,
    };

    const method = isEdit && id ? "PUT" : "POST";
    const endpoint = isEdit && id ? `${apiBaseUrl}/api/purchase-invoices/${id}/` : `${apiBaseUrl}/api/purchase-invoices/`;
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      let errDetail = "";
      try {
        const data = await response.json();
        errDetail = JSON.stringify(data);
      } catch {
        errDetail = `${response.status} ${response.statusText}`;
      }
      console.error("Error al guardar compra", errDetail);
      throw new Error(errDetail);
    }
    await fetchPurchaseInvoicesFromApi();
  };

  const filteredBase = useMemo(() => {
    const source = activeTab === "compra" ? purchaseInvoices : invoices;
    return source.filter((inv) => {
      if (activeTab !== "compra" && inv.type !== activeTab) return false;
      const date = inv.issueDate ? new Date(inv.issueDate) : null;
      const yearMatch = filters.year ? date?.getFullYear() === Number(filters.year) : true;
      const monthMatch = filters.month ? (date ? date.getMonth() + 1 === Number(filters.month) : false) : true;
      const clientMatch = filters.client
        ? inv.supplier.toLowerCase().includes(filters.client.toLowerCase())
        : true;
      const minMatch = filters.minAmount ? inv.amountNumber >= Number(filters.minAmount) : true;
      const maxMatch = filters.maxAmount ? inv.amountNumber <= Number(filters.maxAmount) : true;
      return yearMatch && monthMatch && clientMatch && minMatch && maxMatch;
    });
  }, [filters, invoices, purchaseInvoices, activeTab]);

  const filteredInvoices = filteredBase;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredInvoices, activeTab]);

  const computeSummary = (list: InvoiceRecord[]) => {
    const sumVat = (list: InvoiceRecord[]) =>
      list.reduce((acc, invoice) => {
        const vat =
          typeof invoice.vatAmountNumber === "number" ? invoice.vatAmountNumber : parseAmount(invoice.vatAmount);
        return acc + (Number.isFinite(vat) ? vat : 0);
      }, 0);

    const sumAmount = (list: InvoiceRecord[]) => list.reduce((acc, invoice) => acc + invoice.amountNumber, 0);
    const totalNet = list.reduce(
      (acc, invoice) =>
        acc +
        (typeof invoice.netAmountNumber === "number" ? invoice.netAmountNumber : parseAmount(invoice.netAmount)),
      0,
    );
    const totalQty = list.reduce(
      (acc, invoice) => acc + (invoice.quantityNumber || parseInt(invoice.quantity || "0", 10) || 0),
      0,
    );
    const avgAmount = list.length ? sumAmount(list) / list.length : 0;
    const byClient = list.reduce<Record<string, { count: number; amount: number }>>((map, inv) => {
      const key = inv.supplier || inv.client || inv.rut || "N/A";
      if (!map[key]) map[key] = { count: 0, amount: 0 };
      map[key].count += 1;
      map[key].amount += inv.amountNumber;
      return map;
    }, {});
    const clientMostCount = Object.entries(byClient).sort((a, b) => b[1].count - a[1].count)[0]?.[0] ?? "--";
    const clientMostAmount = Object.entries(byClient).sort((a, b) => b[1].amount - a[1].amount)[0]?.[0] ?? "--";
    const lastInvoice = list[0];
    return {
      count: list.length,
      total: sumAmount(list),
      vat: sumVat(list),
      lastParty: lastInvoice?.supplier ?? t.invoices.summary.noRecords,
      totalNet,
      totalQty,
      avgAmount,
      clientMostCount,
      clientMostAmount,
      ranking: Object.entries(byClient)
        .map(([name, data]) => ({ name, count: data.count, amount: data.amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
    };
  };

  const summary = useMemo(() => computeSummary(filteredInvoices), [filteredInvoices]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredInvoices.slice(start, start + PAGE_SIZE);
  }, [filteredInvoices, currentPage]);

  const monthlySpark = useMemo(() => {
    const totals = Array(12).fill(0);
    filteredInvoices.forEach((inv) => {
      if (!inv.issueDate) return;
      const date = new Date(inv.issueDate);
      if (Number.isNaN(date.getTime())) return;
      const month = date.getMonth();
      totals[month] += inv.amountNumber;
    });
    const max = Math.max(...totals, 0.0001);
    return totals.map((val, idx) => ({
      label: MONTH_LABELS[idx],
      value: val,
      height: Math.max((val / max) * 48, 4),
    }));
  }, [filteredInvoices]);

  const handleAutofill = async () => {
    if (activeTab !== "venta") return;
    const saleFile = files.venta;
    if (!saleFile) {
      setStatusMessage({ type: "error", text: "Selecciona un archivo para leer la factura de venta." });
      return;
    }
    if (!apiBaseUrl) {
      setStatusMessage({ type: "error", text: t.invoices.messages.error });
      return;
    }
    setIsReading(true);
    setStatusMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", saleFile);
      formData.append("tipo_factura", "venta");
      const response = await fetch(`${apiBaseUrl}/api/facturas/extract/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        let detail = "";
        try {
          const err = await response.json();
          detail = err.detail || JSON.stringify(err);
        } catch {
          detail = `${response.status} ${response.statusText}`;
        }
        setStatusMessage({ type: "error", text: detail || t.invoices.messages.error });
        return;
      }
      const data = await response.json();
      const nextForm: InvoiceForm = {
        ...forms.venta,
        invoiceNumber: data.invoice_number ?? forms.venta.invoiceNumber,
        issueDate: normalizeDateInput(data.issue_date) || forms.venta.issueDate,
        supplier: data.client ?? data.supplier ?? forms.venta.supplier,
        amount: data.total_amount !== undefined && data.total_amount !== null ? String(data.total_amount) : forms.venta.amount,
        netAmount: data.net_amount !== undefined && data.net_amount !== null ? String(data.net_amount) : forms.venta.netAmount,
        vatAmount: data.vat_amount !== undefined && data.vat_amount !== null ? String(data.vat_amount) : forms.venta.vatAmount,
        description: data.work_description ?? forms.venta.description,
        rut: data.rut ? unformatRut(String(data.rut)) : forms.venta.rut,
        address: data.address ?? forms.venta.address,
        contact: data.contact ?? forms.venta.contact,
        quantity: data.quantity !== undefined && data.quantity !== null ? String(data.quantity) : forms.venta.quantity || "1",
        unitPrice:
          data.unit_price !== undefined && data.unit_price !== null ? String(data.unit_price) : forms.venta.unitPrice,
      };
      const parsedNet = parseAmount(nextForm.netAmount);
      const qty = parseInt(nextForm.quantity || "0", 10) || 0;
      const unit = parseAmount(nextForm.unitPrice);
      const inferredNet = qty > 0 && unit > 0 ? qty * unit : parsedNet;
      const netVal = inferredNet > 0 ? inferredNet : parsedNet;
      if (netVal > 0) {
        const vat = Math.round(netVal * 0.19);
        nextForm.netAmount = String(netVal);
        nextForm.vatAmount = String(vat);
        nextForm.amount = String(netVal + vat);
      } else {
        const parsedTotal = parseAmount(nextForm.amount);
        const netVat = computeNetVat(parsedTotal, parsedNet);
        if (!nextForm.netAmount && netVat.net) nextForm.netAmount = String(netVat.net);
        if (!nextForm.vatAmount && netVat.vat) nextForm.vatAmount = String(netVat.vat);
      }
      setForms((prev) => ({ ...prev, venta: nextForm }));
      setStatusMessage({ type: "success", text: "Factura leída y campos autocompletados." });
    } catch (error) {
      console.error("Error al autocompletar factura de venta", error);
      setStatusMessage({ type: "error", text: t.invoices.messages.error });
    } finally {
      setIsReading(false);
    }
  };

  const addMaterialRow = () => {
    setMaterials((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { description: "", quantity: "1" }],
    }));
  };

  const updateMaterialRow = (index: number, field: keyof MaterialRow, value: string) => {
    setMaterials((prev) => {
      const nextRows = [...prev[activeTab]];
      nextRows[index] = { ...nextRows[index], [field]: value };
      return { ...prev, [activeTab]: nextRows };
    });
  };

  const addPurchaseMaterialRow = () => {
    setPurchaseMaterials((prev) => [...prev, { id: createId(), description: "", quantity: "1", unitPrice: "" }]);
  };

  const updatePurchaseMaterialRow = (id: string, field: keyof PurchaseMaterialRow, value: string) => {
    setPurchaseMaterials((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: field === "quantity" ? value || "1" : value } : row)),
    );
  };

  const removePurchaseMaterialRow = (id: string) => {
    setPurchaseMaterials((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  };

  const resetTab = () => {
    setForms((prev) => ({ ...prev, [activeTab]: { ...DEFAULT_FORM } }));
    setMaterials((prev) => ({ ...prev, [activeTab]: [] }));
    if (activeTab === "compra") {
      setPurchaseMaterials([{ id: createId(), description: "", quantity: "1", unitPrice: "" }]);
    }
    setFiles((prev) => ({ ...prev, [activeTab]: null }));
    setErrors((prev) => ({ ...prev, [activeTab]: {} }));
    setEditingId(null);
    if (fileInputRefs.current[activeTab]) {
      fileInputRefs.current[activeTab]!.value = "";
    }
  };

  const closeFormPanel = () => {
    resetTab();
    setShowFormPanel(false);
  };

  const handleEdit = (invoice: InvoiceRecord) => {
    setActiveTab(invoice.type);
    setShowFormPanel(true);
    setForms((prev) => ({
      ...prev,
      [invoice.type]: {
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        supplier: invoice.supplier,
        amount: String(invoice.amountNumber),
        netAmount: String(invoice.netAmountNumber || ""),
        vatAmount: String(invoice.vatAmountNumber || ""),
        description: invoice.description,
        rut: invoice.rut || "",
        address: invoice.address || "",
        contact: invoice.contact || "",
        quantity: invoice.quantityNumber ? String(invoice.quantityNumber) : "",
        unitPrice: invoice.unitPriceNumber ? String(invoice.unitPriceNumber) : "",
        paymentType: invoice.paymentType || "contado",
        paymentMethod: invoice.paymentMethod || invoice.paymentType || "contado",
        paymentStatus: invoice.paymentStatus || "pendiente",
        dueDate: invoice.dueDate || invoice.chequeDueDate || "",
        paymentNotes: invoice.paymentNotes || "",
        chequeBank: invoice.chequeBank || "",
        chequeNumber: invoice.chequeNumber || "",
        chequeDueDate: invoice.chequeDueDate || "",
      },
    }));
    if (invoice.type === "compra") {
      const nextMaterials =
        invoice.materials && invoice.materials.length
          ? invoice.materials.map((item) => ({
              id: createId(),
              description: item.description || "",
              quantity: item.quantity || "1",
              unitPrice: item.unitPrice || "",
            }))
          : [{ id: createId(), description: "", quantity: "1", unitPrice: "" }];
      setPurchaseMaterials(nextMaterials);
    }
    setEditingId(invoice.id);
    setStatusMessage({ type: "success", text: "Modo edicion activo" });
    if (fileInputRefs.current[invoice.type]) {
      fileInputRefs.current[invoice.type]!.value = "";
    }
  };

  const handleDelete = async (invoice: InvoiceRecord) => {
    const confirmDelete = typeof window !== "undefined" ? window.confirm("?Eliminar esta factura?") : true;
    if (!confirmDelete) return;
    if (invoice.type === "compra") {
      setPurchaseInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));
      if (!apiBaseUrl) return;
      try {
        await fetch(`${apiBaseUrl}/api/purchase-invoices/${invoice.id}/`, {
          method: "DELETE",
          credentials: "include",
        }).catch(() => {});
        fetchPurchaseInvoicesFromApi();
      } catch {
        // ignore
      }
      return;
    }
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));
    if (!apiBaseUrl) return;
    try {
      await fetch(`${apiBaseUrl}/api/invoices/${invoice.id}/`, {
        method: "DELETE",
        credentials: "include",
      }).catch(() => {});
      fetchInvoicesFromApi();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="inventory-page invoice-page">
        <AppHeader />
        <div className="inventory-shell invoice-shell">
          <main className="invoice-layout invoice-main">
            <section className="inventory-card invoice-panel">
              <div className="inventory-card__heading">
                <div>
                  <p className="invoice-eyebrow">{t.invoices.hero.eyebrow}</p>
                  <h2>{t.invoices.hero.title}</h2>
                  <p>{t.invoices.hero.subtitle}</p>
                </div>
                <div className="invoice-tabs invoice-tabs--kpi" role="tablist" aria-label="Tipo de KPIs">
                  {(["venta", "compra"] as InvoiceType[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab}
                      className={`invoice-tab ${activeTab === tab ? "invoice-tab--active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === "venta" ? "Facturas de venta" : "Facturas de compra"}
                    </button>
                  ))}
                </div>
              <div className="invoice-kpis">
                <article>
                  <p>{activeTab === "compra" ? "Facturas de compra" : "Facturas de venta"}</p>
                  <strong>{summary.count}</strong>
                </article>
                <article>
                  <p>{activeTab === "compra" ? "Gasto total" : "Ingreso total"}</p>
                  <strong>{formatCurrency(summary.total)}</strong>
                </article>
                <article>
                  <p>{activeTab === "compra" ? "IVA compras" : "IVA ventas"}</p>
                  <strong>{formatCurrency(summary.vat)}</strong>
                </article>
                <article>
                  <p>{activeTab === "compra" ? "Ultimo proveedor" : "Ultimo cliente"}</p>
                  <strong>{summary.lastParty}</strong>
                </article>
              </div>
              </div>

              {statusMessage ? (
                <div
                  className={`invoice-alert invoice-alert--${statusMessage.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {statusMessage.text}
                </div>
              ) : null}
              <div className="invoice-form-launch">
                <button
                  type="button"
                  className="invoice-btn"
                  onClick={() => {
                    resetTab();
                    setShowFormPanel(true);
                  }}
                >
                  + Registrar nueva factura
                </button>
              </div>

              <section className="invoice-section">
                <div className="invoice-section__heading">
                  <h3>{t.invoices.table.title}</h3>
                  <p>{t.invoices.table.helper}</p>
                </div>

                {filteredInvoices.length === 0 ? (
                  <p className="invoice-empty">
                    {activeTab === "compra" ? "No hay facturas de compra registradas" : t.invoices.table.empty}
                  </p>
                ) : (
                  <div className="invoice-table__wrapper">
                    {activeTab === "compra" ? (
                      <>
                        <table className="invoice-table">
                          <thead>
                            <tr>
                              <th>{t.invoices.table.number}</th>
                              <th>{t.invoices.table.date}</th>
                              <th>{t.invoices.form.supplier}</th>
                              <th>{t.invoices.form.amount}</th>
                              <th>Materiales</th>
                              <th>{t.common.actions}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedInvoices.map((invoice) => (
                              <tr key={invoice.id}>
                                <td>{invoice.invoiceNumber || invoice.id}</td>
                                <td>{formatDate(invoice.issueDate, locale)}</td>
                                <td>{invoice.supplier}</td>
                                <td>{formatCurrency(invoice.amountNumber)}</td>
                                <td>{invoice.materials?.length ?? 0}</td>
                                <td>
                                  <button
                                    className="invoice-btn invoice-btn--ghost"
                                    type="button"
                                    onClick={() => handleEdit(invoice)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="invoice-btn invoice-btn--ghost"
                                    type="button"
                                    onClick={() => handleDelete(invoice)}
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="invoice-pagination">
                          <button
                            type="button"
                            className="invoice-btn invoice-btn--ghost"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                          >
                            {t.inventory.previous || "Anterior"}
                          </button>
                          <span className="invoice-page-info">
                            {(t.inventory.page || "P?gina")} {currentPage} / {totalPages}
                          </span>
                          <button
                            type="button"
                            className="invoice-btn invoice-btn--ghost"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                          >
                            {t.inventory.next || "Siguiente"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <table className="invoice-table">
                          <thead>
                            <tr>
                              <th>{t.invoices.table.number}</th>
                              <th>{t.invoices.table.date}</th>
                              <th>{t.invoices.table.supplier}</th>
                              <th>{t.invoices.table.amount}</th>
                              <th>{t.invoices.table.description}</th>
                              <th>{t.invoices.table.attachment}</th>
                              <th>{t.common.actions}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedInvoices.map((invoice) => (
                              <tr key={invoice.id}>
                                <td>{invoice.invoiceNumber}</td>
                                <td>{formatDate(invoice.issueDate, locale)}</td>
                                <td>{invoice.supplier}</td>
                                <td>{formatCurrency(invoice.amountNumber)}</td>
                                <td>{invoice.description || "--"}</td>
                                <td>
                                  {invoice.attachment && invoice.attachment.dataUrl ? (
                                    <a
                                      href={invoice.attachment.dataUrl}
                                      download={invoice.attachment.name}
                                      className="invoice-link"
                                    >
                                      {invoice.attachment.name}
                                    </a>
                                  ) : (
                                    <span>{t.invoices.table.noAttachment}</span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    className="invoice-btn invoice-btn--ghost"
                                    type="button"
                                    onClick={() => handleEdit(invoice)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="invoice-btn invoice-btn--ghost"
                                    type="button"
                                    onClick={() => handleDelete(invoice)}
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="invoice-pagination">
                          <button
                            type="button"
                            className="invoice-btn invoice-btn--ghost"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                          >
                            {t.inventory.previous || "Anterior"}
                          </button>
                          <span className="invoice-page-info">
                            {(t.inventory.page || "P?gina")} {currentPage} / {totalPages}
                          </span>
                          <button
                            type="button"
                            className="invoice-btn invoice-btn--ghost"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                          >
                            {t.inventory.next || "Siguiente"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>
            </section>
            <aside className="invoice-sidebar">
              <div className="invoice-sidecard invoice-sidecard--accent">
                <h4 className="invoice-sidecard__title">🔎 Filtros</h4>
                <div className="invoice-filters">
                  <label>
                    <span className="invoice-filter-label">Año</span>
                    <select
                      value={filters.year}
                      onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
                    >
                      <option value="">Todos</option>
                      {[...new Set(invoices.map((inv) => new Date(inv.issueDate).getFullYear()).filter((y) => !Number.isNaN(y)))]
                        .sort((a, b) => b - a)
                        .map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    <span className="invoice-filter-label">Mes</span>
                    <select
                      value={filters.month}
                      onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value }))}
                    >
                      <option value="">Todos</option>
                      {MONTH_LABELS.map((label, idx) => (
                        <option key={label} value={idx + 1}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="invoice-filter-label">Cliente</span>
                    <input
                      type="text"
                      value={filters.client}
                      onChange={(e) => setFilters((prev) => ({ ...prev, client: e.target.value }))}
                    />
                  </label>
                  <label>
                    <span className="invoice-filter-label">Monto mín.</span>
                    <input
                      type="number"
                      value={filters.minAmount}
                      onChange={(e) => setFilters((prev) => ({ ...prev, minAmount: e.target.value }))}
                    />
                  </label>
                  <label>
                    <span className="invoice-filter-label">Monto máx.</span>
                    <input
                      type="number"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxAmount: e.target.value }))}
                    />
                  </label>
                </div>
              </div>

              <div className="invoice-sidecard invoice-sidecard--accent">
                <h4 className="invoice-sidecard__title">📊 Mini-estadísticas</h4>
                <div className="invoice-mini-stats">
                  <div>
                    <p>🧮 Promedio factura</p>
                    <strong className="invoice-mini-figure">{formatCurrency(summary.avgAmount || 0)}</strong>
                  </div>
                  <div>
                    <p>Total neto</p>
                    <strong className="invoice-mini-figure">{formatCurrency(summary.totalNet || 0)}</strong>
                  </div>
                  <div>
                    <p>％ IVA acumulado</p>
                    <strong className="invoice-mini-figure">{formatCurrency(summary.vat || 0)}</strong>
                  </div>
                  <div>
                    <p>Cant. trabajos</p>
                    <strong className="invoice-mini-figure">{summary.totalQty || 0}</strong>
                  </div>
                  <div>
                    <p>👥 Cliente +facturas</p>
                    <strong className="invoice-mini-figure">{summary.clientMostCount}</strong>
                  </div>
                  <div>
                    <p>💰 Cliente +monto</p>
                    <strong className="invoice-mini-figure">{summary.clientMostAmount}</strong>
                  </div>
                </div>
              </div>

              <div className="invoice-sidecard">
                <h4 className="invoice-sidecard__title">🏆 Top clientes</h4>
                <div className="invoice-ranking">
                  {(summary.ranking || []).map((item) => (
                    <div key={item.name}>
                      <strong>{item.name}</strong> — {item.count} facturas · {formatCurrency(item.amount)}
                    </div>
                  ))}
                  {(summary.ranking || []).length === 0 ? <p>No hay datos</p> : null}
                </div>
              </div>

              <div className="invoice-sidecard">
                <h4 className="invoice-sidecard__title">📈 Evolución mensual</h4>
                <div className="invoice-sparkline">
                  {monthlySpark.map((m) => (
                    <div key={m.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div className="invoice-sparkbar" style={{ height: `${m.height}px` }} title={`${m.label}: ${formatCurrency(m.value)}`} />
                      <span className="invoice-sparklabel">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </main>
          {showFormPanel ? (
            <div className="invoice-modal" role="dialog" aria-modal="true">
              <div className="invoice-modal__backdrop" />
              <div className="invoice-modal__dialog" onClick={(event) => event.stopPropagation()}>
                <div className="invoice-modal__header">
                  <div>
                    <h3>{t.invoices.form.title}</h3>
                    <p>{t.invoices.form.description}</p>
                    <div className="invoice-tabs" role="tablist" aria-label={t.invoices.form.tabLabel}>
                      {(["compra", "venta"] as InvoiceType[]).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          role="tab"
                          aria-selected={activeTab === tab}
                          className={`invoice-tab ${activeTab === tab ? "invoice-tab--active" : ""}`}
                          onClick={() => handleTabChange(tab)}
                        >
                          {tab === "compra" ? t.invoices.form.tabs.purchase : t.invoices.form.tabs.sale}
                        </button>
                      ))}
                    </div>
                    <p className="invoice-tab__hint">
                      {activeTab === "compra" ? t.invoices.form.purchaseHelper : t.invoices.form.salesHelper}
                    </p>
                  </div>
                  <button type="button" className="invoice-btn invoice-btn--ghost" onClick={closeFormPanel}>
                    Cerrar
                  </button>
                </div>

                <form className="invoice-form" onSubmit={handleSubmit} noValidate>
                  {activeTab === "compra" ? (
                    <>
                      <div className="invoice-form__row">
                        <div className="invoice-field">
                          <label htmlFor="supplier">{t.invoices.form.supplier}</label>
                          <input
                            id="supplier"
                            name="supplier"
                            type="text"
                            value={currentForm.supplier}
                            onChange={handleInputChange("supplier")}
                            aria-invalid={Boolean(currentErrors.supplier)}
                            aria-describedby={currentErrors.supplier ? "supplier-error" : undefined}
                          />
                          {currentErrors.supplier ? (
                            <span className="invoice-error" id="supplier-error">
                              {currentErrors.supplier}
                            </span>
                          ) : null}
                        </div>
                        <div className="invoice-field">
                          <label htmlFor="issueDate">{t.invoices.form.issueDate}</label>
                          <input
                            id="issueDate"
                            name="issueDate"
                            type="date"
                            value={currentForm.issueDate}
                            onChange={handleInputChange("issueDate")}
                            aria-invalid={Boolean(currentErrors.issueDate)}
                            aria-describedby={currentErrors.issueDate ? "issueDate-error" : undefined}
                          />
                          {currentErrors.issueDate ? (
                            <span className="invoice-error" id="issueDate-error">
                              {currentErrors.issueDate}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="invoice-form__row">
                        <div className="invoice-field">
                          <label htmlFor="rut">{t.invoices.form.rut}</label>
                          <input
                            id="rut"
                            name="rut"
                            type="text"
                            value={formatRut(currentForm.rut)}
                            onChange={handleInputChange("rut")}
                          />
                        </div>
                        <div className="invoice-field">
                          <label htmlFor="netAmount">{t.invoices.form.netAmount}</label>
                          <input
                            id="netAmount"
                            name="netAmount"
                            type="number"
                            value={currentForm.netAmount}
                            onChange={handleInputChange("netAmount")}
                          />
                        </div>
                      </div>

                      <div className="invoice-form__row">
                      <div className="invoice-field">
                        <label htmlFor="vatAmount">{t.invoices.form.vatAmount}</label>
                        <input
                          id="vatAmount"
                          name="vatAmount"
                          type="number"
                          value={currentForm.vatAmount}
                          onChange={handleInputChange("vatAmount")}
                        />
                      </div>
                      <div className="invoice-field">
                        <label htmlFor="amount">{t.invoices.form.amount}</label>
                        <input
                          id="amount"
                          name="amount"
                          type="number"
                          value={currentForm.amount}
                          onChange={handleInputChange("amount")}
                          aria-invalid={Boolean(currentErrors.amount)}
                          aria-describedby={currentErrors.amount ? "amount-error" : undefined}
                        />
                        {currentErrors.amount ? (
                          <span className="invoice-error" id="amount-error">
                            {currentErrors.amount}
                          </span>
                        ) : null}
                      </div>
                      </div>

                      <div className="invoice-form__row">
                        <div className="invoice-field">
                          <label htmlFor="paymentType">Forma de pago</label>
                          <select
                            id="paymentType"
                            name="paymentType"
                            value={currentForm.paymentMethod || currentForm.paymentType || "contado"}
                            onChange={handleInputChange("paymentMethod")}
                          >
                            <option value="contado">Contado</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="cheque">Cheque</option>
                          </select>
                        </div>
                      </div>

                      {currentForm.paymentMethod === "cheque" || currentForm.paymentType === "cheque" ? (
                        <>
                          <div className="invoice-form__row">
                            <div className="invoice-field">
                              <label htmlFor="chequeBank">Banco del cheque</label>
                              <input
                                id="chequeBank"
                                name="chequeBank"
                                type="text"
                                value={currentForm.chequeBank || ""}
                                onChange={handleInputChange("chequeBank")}
                              />
                            </div>
                            <div className="invoice-field">
                              <label htmlFor="chequeNumber">Número de cheque</label>
                              <input
                                id="chequeNumber"
                                name="chequeNumber"
                                type="text"
                                value={currentForm.chequeNumber || ""}
                                onChange={handleInputChange("chequeNumber")}
                              />
                            </div>
                          </div>
                          <div className="invoice-form__row">
                            <div className="invoice-field">
                              <label htmlFor="chequeDueDate">Fecha de vencimiento del cheque</label>
                              <input
                                id="chequeDueDate"
                                name="chequeDueDate"
                                type="date"
                                value={currentForm.dueDate || currentForm.chequeDueDate || ""}
                                onChange={handleInputChange("dueDate")}
                              />
                            </div>
                          </div>
                          <div className="invoice-field">
                            <label htmlFor="paymentNotes">Notas de pago</label>
                            <textarea
                              id="paymentNotes"
                              name="paymentNotes"
                              rows={2}
                              value={currentForm.paymentNotes || ""}
                              onChange={handleInputChange("paymentNotes")}
                            />
                          </div>
                        </>
                      ) : null}

                      <div className="invoice-field">
                        <label htmlFor="attachment">{t.invoices.form.attachment}</label>
                        <div className="invoice-upload-row">
                          <input
                            id="attachment"
                            name="attachment"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            ref={(node) => (fileInputRefs.current[activeTab] = node)}
                            onChange={(event) => handleFileChange(event, activeTab)}
                            aria-invalid={Boolean(currentErrors.file)}
                            aria-describedby={currentErrors.file ? "attachment-error" : undefined}
                          />
                        </div>
                        <small>{t.invoices.form.autofillHint}</small>
                        {currentErrors.file ? (
                          <span className="invoice-error" id="attachment-error">
                            {currentErrors.file}
                          </span>
                        ) : null}
                      </div>

                      <div className="invoice-materials">
                        <div className="invoice-section__heading">
                          <h4>Materiales de la factura</h4>
                          <p>Agrega cada material con su cantidad y precio unitario opcional.</p>
                        </div>
                        <div className="invoice-materials__list">
                          {purchaseMaterials.map((row) => (
                            <div className="invoice-material" key={row.id}>
                              <div className="invoice-field">
                                <label>Descripci?n del material</label>
                                <input
                                  type="text"
                                  value={row.description}
                                  onChange={(e) => updatePurchaseMaterialRow(row.id, "description", e.target.value)}
                                />
                              </div>
                              <div className="invoice-field">
                                <label>Cantidad</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={row.quantity}
                                  onChange={(e) => updatePurchaseMaterialRow(row.id, "quantity", e.target.value || "1")}
                                />
                              </div>
                              <div className="invoice-field">
                                <label>Precio unitario (opcional)</label>
                                <input
                                  type="number"
                                  value={row.unitPrice}
                                  onChange={(e) => updatePurchaseMaterialRow(row.id, "unitPrice", e.target.value)}
                                />
                              </div>
                              {purchaseMaterials.length > 1 ? (
                                <button
                                  type="button"
                                  className="invoice-btn invoice-btn--ghost"
                                  onClick={() => removePurchaseMaterialRow(row.id)}
                                >
                                  Eliminar
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                        <button type="button" className="invoice-btn invoice-btn--ghost" onClick={addPurchaseMaterialRow}>
                          Agregar material
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="invoice-form__row">
                        <div className="invoice-field">
                          <label htmlFor="invoiceNumber">{t.invoices.form.number}</label>
                          <input
                            id="invoiceNumber"
                            name="invoiceNumber"
                            type="text"
                            value={currentForm.invoiceNumber}
                            onChange={handleInputChange("invoiceNumber")}
                            aria-invalid={Boolean(currentErrors.invoiceNumber)}
                            aria-describedby={currentErrors.invoiceNumber ? "invoiceNumber-error" : undefined}
                          />
                          {currentErrors.invoiceNumber ? (
                            <span className="invoice-error" id="invoiceNumber-error">
                              {currentErrors.invoiceNumber}
                            </span>
                          ) : null}
                        </div>
                        <div className="invoice-field">
                          <label htmlFor="issueDate">{t.invoices.form.issueDate}</label>
                          <input
                            id="issueDate"
                            name="issueDate"
                            type="date"
                            value={currentForm.issueDate}
                            onChange={handleInputChange("issueDate")}
                            aria-invalid={Boolean(currentErrors.issueDate)}
                            aria-describedby={currentErrors.issueDate ? "issueDate-error" : undefined}
                          />
                          {currentErrors.issueDate ? (
                            <span className="invoice-error" id="issueDate-error">
                              {currentErrors.issueDate}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="invoice-form__row">
                        <div className="invoice-field">
                          <label htmlFor="supplier">{t.invoices.form.client}</label>
                          <input
                            id="supplier"
                            name="supplier"
                            type="text"
                            value={currentForm.supplier}
                            onChange={handleInputChange("supplier")}
                            aria-invalid={Boolean(currentErrors.supplier)}
                            aria-describedby={currentErrors.supplier ? "supplier-error" : undefined}
                          />
                          {currentErrors.supplier ? (
                            <span className="invoice-error" id="supplier-error">
                              {currentErrors.supplier}
                            </span>
                          ) : null}
                        </div>
                        <div className="invoice-field">
                          <label htmlFor="amount">{t.invoices.form.amount}</label>
                          <input
                            id="amount"
                            name="amount"
                            type="number"
                            value={currentForm.amount}
                            onChange={handleInputChange("amount")}
                            aria-invalid={Boolean(currentErrors.amount)}
                            aria-describedby={currentErrors.amount ? "amount-error" : undefined}
                          />
                          {currentErrors.amount ? (
                            <span className="invoice-error" id="amount-error">
                              {currentErrors.amount}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="invoice-form__row">
                        <div className="invoice-field">
                          <label htmlFor="netAmount">{t.invoices.form.netAmount}</label>
                          <input
                            id="netAmount"
                            name="netAmount"
                            type="number"
                            value={currentForm.netAmount || computedNet || ""}
                            onChange={handleInputChange("netAmount")}
                          />
                        </div>
                        <div className="invoice-field">
                          <label htmlFor="vatAmount">{t.invoices.form.vatAmount}</label>
                          <input
                            id="vatAmount"
                            name="vatAmount"
                            type="number"
                            value={currentForm.vatAmount || calculatedIva || ""}
                            onChange={handleInputChange("vatAmount")}
                          />
                        </div>
                      </div>

                      <div className="invoice-form__row">
                        <div className="invoice-field">
                          <label htmlFor="quantity">Cantidad del trabajo</label>
                          <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            value={currentForm.quantity || "1"}
                            onChange={handleInputChange("quantity")}
                          />
                        </div>
                        <div className="invoice-field">
                          <label htmlFor="unitPrice">Precio unitario (CLP)</label>
                          <input
                            id="unitPrice"
                            name="unitPrice"
                            type="number"
                            value={currentForm.unitPrice}
                            onChange={handleInputChange("unitPrice")}
                          />
                        </div>
                      </div>

                      {currentForm.unitPrice ? (
                        <div className="invoice-field">
                          <label>Subtotal neto estimado</label>
                          <input
                            type="text"
                            readOnly
                            value={formatCurrency(
                              (parseInt(currentForm.quantity || "1", 10) || 1) * parseAmount(currentForm.unitPrice || "0"),
                            )}
                          />
                        </div>
                      ) : null}

                      <div className="invoice-form__row">
                        <div className="invoice-field">
                          <label htmlFor="rut">{t.invoices.form.rut}</label>
                          <input
                            id="rut"
                            name="rut"
                            type="text"
                            value={formatRut(currentForm.rut)}
                            onChange={handleInputChange("rut")}
                          />
                        </div>
                        <div className="invoice-field">
                          <label htmlFor="contact">{t.invoices.form.contact}</label>
                          <input
                            id="contact"
                            name="contact"
                            type="text"
                            value={currentForm.contact}
                            onChange={handleInputChange("contact")}
                          />
                        </div>
                      </div>

                      <div className="invoice-field">
                        <label htmlFor="address">{t.invoices.form.address}</label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={currentForm.address}
                          onChange={handleInputChange("address")}
                        />
                      </div>

                      <div className="invoice-field">
                        <label htmlFor="description">{t.invoices.form.descriptionLabel}</label>
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={currentForm.description}
                          onChange={handleInputChange("description")}
                        />
                      </div>

                      <div className="invoice-field">
                        <label htmlFor="attachment">{t.invoices.form.attachment}</label>
                        <div className="invoice-upload-row">
                          <input
                            id="attachment"
                            name="attachment"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            ref={(node) => (fileInputRefs.current[activeTab] = node)}
                            onChange={(event) => handleFileChange(event, activeTab)}
                            aria-invalid={Boolean(currentErrors.file)}
                            aria-describedby={currentErrors.file ? "attachment-error" : undefined}
                          />
                          <button
                            type="button"
                            className="invoice-btn invoice-btn--secondary"
                            onClick={handleAutofill}
                            disabled={isReading || !currentFile}
                          >
                            {isReading ? t.invoices.form.autofilling : t.invoices.form.autofill}
                          </button>
                        </div>
                        <small>{t.invoices.form.autofillHint}</small>
                        {currentErrors.file ? (
                          <span className="invoice-error" id="attachment-error">
                            {currentErrors.file}
                          </span>
                        ) : null}
                      </div>
                    </>
                  )}

                  <div className="invoice-actions">
                    <button type="submit" className="invoice-btn" disabled={isSubmitting}>
                      {isSubmitting ? t.invoices.form.saving : t.invoices.form.submit}
                    </button>
                    <button type="button" className="invoice-btn invoice-btn--ghost" onClick={resetTab}>
                      {t.invoices.form.reset}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
          <AppFooter />
        </div>
      </div>
    </>
  );
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function formatDate(value: string, locale: string) {
  if (!value) return "--";
  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = value.match(isoPattern);
  if (match) {
    const [, y, m, d] = match;
    return `${d}/${m}/${y}`;
  }
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function parseAmount(value: string) {
  if (!value) return 0;
  const raw = value.replace(/[^\d,.\-]/g, "");
  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");
  let normalized = raw;
  if (hasComma && hasDot) {
    if (raw.lastIndexOf(",") > raw.lastIndexOf(".")) {
      normalized = raw.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = raw.replace(/,/g, "");
    }
  } else if (hasComma) {
    normalized = raw.replace(",", ".");
  }
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeAmountInput(value: string | number | undefined) {
  if (value === undefined || value === null) return "";
  const str = typeof value === "number" ? String(value) : String(value);
  const cleaned = str.replace(/[^\d,.\-]/g, "");
  if (!cleaned) return "";
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  if (hasComma && hasDot && cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")) {
    return cleaned.replace(/\./g, "").replace(",", ".");
  }
  if (hasComma && !hasDot) {
    return cleaned.replace(",", ".");
  }
  return cleaned;
}

function formatCLP(value: string | number) {
  const num = typeof value === "number" ? value : parseAmount(value);
  if (!num || Number.isNaN(num)) return "";
  return new Intl.NumberFormat("es-CL").format(num);
}

function unformatCLP(str: string | undefined) {
  if (!str) return "";
  return str.replace(/[^\d-]/g, "");
}

function unformatRut(str: string | undefined) {
  if (!str) return "";
  return str.replace(/[^0-9kK-]/g, "").replace(/\s+/g, "");
}

function formatRut(raw: string | undefined) {
  if (!raw) return "";
  const clean = unformatRut(raw);
  const parts = clean.split("-");
  if (parts[0].length < 2) return clean;
  const body = parts[0];
  const dv = parts[1] || "";
  const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dv ? `${withDots}-${dv}` : withDots;
}

function applyAmountSideEffects(form: InvoiceForm, field: keyof InvoiceForm, value: string) {
  if (field === "amount") {
    const raw = unformatCLP(value);
    const parsed = parseAmount(raw);
    if (!parsed || Number.isNaN(parsed)) {
      return { ...form, amount: raw, netAmount: "", vatAmount: "" };
    }
    const netVat = computeNetVat(parsed, parseAmount(form.netAmount));
    return {
      ...form,
      amount: raw,
      netAmount: netVat.net ? String(netVat.net) : form.netAmount,
      vatAmount: netVat.vat ? String(netVat.vat) : form.vatAmount,
    };
  }
  if (field === "netAmount") {
    const raw = unformatCLP(value);
    const parsedNet = parseAmount(raw);
    const parsedTotal = parseAmount(form.amount);
    const netVat = computeNetVat(parsedTotal, parsedNet);
    return {
      ...form,
      netAmount: raw,
      vatAmount: netVat.vat ? String(netVat.vat) : form.vatAmount,
    };
  }
  if (field === "vatAmount") {
    const raw = unformatCLP(value);
    return { ...form, vatAmount: raw };
  }
  if (field === "rut") {
    return { ...form, rut: unformatRut(value) };
  }
  return { ...form, [field]: value };
}

function computeNetVat(totalValue: number, netOptional?: number) {
  if (!totalValue || Number.isNaN(totalValue)) {
    return { net: 0, vat: 0 };
  }
  if (netOptional && !Number.isNaN(netOptional) && netOptional > 0) {
    const vat = Math.round(netOptional * 0.19);
    return { net: netOptional, vat };
  }
  const net = Math.round(totalValue / 1.19);
  const vat = Math.max(totalValue - net, 0);
  return { net, vat };
}

function normalizeDateInput(value: string | undefined) {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const slashMatch = trimmed.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, "0");
    const month = slashMatch[2].padStart(2, "0");
    const year = slashMatch[3].length === 2 ? `20${slashMatch[3]}` : slashMatch[3];
    return `${year}-${month}-${day}`;
  }
  return trimmed;
}

function mapApiInvoiceToRecord(raw: any): InvoiceRecord {
  const amountNumber = Number(raw.total_amount ?? raw.amount ?? 0) || 0;
  const netAmountNumber = Number(raw.net_amount ?? 0) || 0;
  const vatAmountNumber = Number(raw.vat_amount ?? 0) || 0;
  const attachmentUrl: string | undefined = raw.attachment || undefined;
  const attachmentName =
    attachmentUrl?.split("/").filter(Boolean).slice(-1)[0] || raw.attachment_name || "archivo";

  return {
    id: String(raw.id || raw.pk || createId()),
    type: raw.invoice_type === "venta" ? "venta" : "compra",
    invoiceNumber: raw.invoice_number || "",
    issueDate: raw.issue_date || "",
    supplier: raw.supplier || raw.client || "",
    amount: String(amountNumber),
    netAmount: String(netAmountNumber),
    vatAmount: String(vatAmountNumber),
    description: raw.description || raw.work_description || "",
    rut: raw.rut || "",
    address: raw.address || "",
    contact: raw.contact || "",
    quantity: raw.quantity ? String(raw.quantity) : "",
    unitPrice: raw.unit_price ? String(raw.unit_price) : "",
    paymentType: raw.payment_type || raw.paymentType || "contado",
    chequeBank: raw.cheque_bank || raw.chequeBank || "",
    chequeNumber: raw.cheque_number || raw.chequeNumber || "",
    chequeDueDate: raw.cheque_due_date || raw.chequeDueDate || "",
    amountNumber,
    netAmountNumber,
    vatAmountNumber,
    quantityNumber: raw.quantity ?? undefined,
    unitPriceNumber: raw.unit_price ?? undefined,
    createdAt: raw.created_at || new Date().toISOString(),
    attachment: attachmentUrl
      ? {
          id: attachmentUrl,
          name: attachmentName,
          size: 0,
          type: "application/octet-stream",
          dataUrl: attachmentUrl,
        }
      : undefined,
    materials: raw.materials || [],
  };
}










