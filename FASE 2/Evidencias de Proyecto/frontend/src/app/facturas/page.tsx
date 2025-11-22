"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
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
  description: string;
};

type MaterialRow = {
  description: string;
  quantity: string;
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
  createdAt: string;
  attachment?: InvoiceAttachment;
  materials?: MaterialRow[];
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
  description: "",
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

export default function InvoicesPage() {
  useBodyClass();
  const { t, locale } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<InvoiceType>("compra");
  const [forms, setForms] = useState<Record<InvoiceType, InvoiceForm>>(DEFAULT_FORMS);
  const [materials, setMaterials] = useState<Record<InvoiceType, MaterialRow[]>>(DEFAULT_MATERIALS);
  const [errors, setErrors] = useState<Record<InvoiceType, ValidationErrors>>(DEFAULT_ERRORS);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [files, setFiles] = useState<Record<InvoiceType, File | null>>(DEFAULT_FILES);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReading, setIsReading] = useState(false);
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
        materials: invoice.materials || [],
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

  const currentForm = forms[activeTab];
  const currentErrors = errors[activeTab];
  const currentFile = files[activeTab];
  const currentMaterials = materials[activeTab];

  const handleTabChange = (nextTab: InvoiceType) => {
    setActiveTab(nextTab);
    setStatusMessage(null);
  };

  const handleInputChange =
    (field: keyof InvoiceForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForms((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], [field]: event.target.value },
      }));
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

      const record: InvoiceRecord = {
        ...currentForm,
        type: activeTab,
        id: createId(),
        amountNumber,
        createdAt: new Date().toISOString(),
        attachment,
        materials: activeTab === "compra" ? currentMaterials : undefined,
      };

      await persistInvoice(record, currentFile);

      setInvoices((prev) => [record, ...prev]);
      setForms((prev) => ({ ...prev, [activeTab]: { ...DEFAULT_FORM } }));
      setMaterials((prev) => ({ ...prev, [activeTab]: [] }));
      setFiles((prev) => ({ ...prev, [activeTab]: null }));
      if (fileInputRefs.current[activeTab]) {
        fileInputRefs.current[activeTab]!.value = "";
      }
      setStatusMessage({ type: "success", text: t.invoices.messages.saved });
    } catch {
      setStatusMessage({ type: "error", text: t.invoices.messages.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const persistInvoice = async (record: InvoiceRecord, attachment: File | null) => {
    if (!apiBaseUrl) return;
    try {
      const payload = new FormData();
      payload.append("invoice_number", record.invoiceNumber);
      payload.append("issue_date", record.issueDate);
      payload.append("supplier", record.supplier);
      payload.append("amount", String(record.amountNumber));
      payload.append("description", record.description);
      payload.append("tipo_factura", record.type);
      if (record.materials?.length) {
        payload.append("materials", JSON.stringify(record.materials));
      }
      payload.append("source", "frontend-demo");
      if (attachment) {
        payload.append("attachment", attachment);
      }
      await fetch(`${apiBaseUrl}/api/invoices/`, {
        method: "POST",
        credentials: "include",
        body: payload,
      }).catch(() => {
        // Ignore network issues; optimistic update
      });
    } catch {
      // swallow errors to avoid blocking UI
    }
  };

  const summary = useMemo(() => {
    const totalAmount = invoices.reduce((acc, invoice) => acc + invoice.amountNumber, 0);
    const lastInvoice = invoices[0];
    return {
      count: invoices.length,
      totalAmount,
      lastSupplier: lastInvoice?.supplier ?? t.invoices.summary.noRecords,
    };
  }, [invoices, t]);

  const handleAutofill = async () => {
    setStatusMessage(null);
    if (!currentFile) {
      setErrors((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], file: t.invoices.errors.fileRequiredForOcr },
      }));
      return;
    }

    setIsReading(true);
    try {
      const payload = new FormData();
      payload.append("file", currentFile);
      payload.append("tipo_factura", activeTab);
      const response = await fetch(`${apiBaseUrl}/api/facturas/extract/`, {
        method: "POST",
        body: payload,
      });
      if (!response.ok) {
        throw new Error("extract_failed");
      }
      const data = await response.json();
      const nextForm: Partial<InvoiceForm> = {
        invoiceNumber: data.invoice_number || currentForm.invoiceNumber,
        issueDate: normalizeDateInput(data.issue_date) || currentForm.issueDate,
        supplier: data.supplier || data.client || currentForm.supplier,
        amount: normalizeAmountInput(data.total_amount) || currentForm.amount,
        description:
          activeTab === "venta"
            ? data.work_description || currentForm.description
            : currentForm.description,
      };

      setForms((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], ...nextForm },
      }));

      if (activeTab === "compra" && Array.isArray(data.materials)) {
        setMaterials((prev) => ({
          ...prev,
          compra: data.materials
            .map((item: any, index: number) => ({
              description: String(item.description ?? item.detalle ?? `Material ${index + 1}`),
              quantity: String(item.quantity ?? item.cantidad ?? ""),
            }))
            .filter((item) => item.description.trim()),
        }));
      }
      setStatusMessage({ type: "success", text: t.invoices.messages.autofillSuccess });
    } catch {
      setStatusMessage({ type: "error", text: t.invoices.messages.autofillError });
    } finally {
      setIsReading(false);
    }
  };

  const addMaterialRow = () => {
    setMaterials((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { description: "", quantity: "" }],
    }));
  };

  const updateMaterialRow = (index: number, field: keyof MaterialRow, value: string) => {
    setMaterials((prev) => {
      const nextRows = [...prev[activeTab]];
      nextRows[index] = { ...nextRows[index], [field]: value };
      return { ...prev, [activeTab]: nextRows };
    });
  };

  const resetTab = () => {
    setForms((prev) => ({ ...prev, [activeTab]: { ...DEFAULT_FORM } }));
    setMaterials((prev) => ({ ...prev, [activeTab]: [] }));
    setFiles((prev) => ({ ...prev, [activeTab]: null }));
    setErrors((prev) => ({ ...prev, [activeTab]: {} }));
    if (fileInputRefs.current[activeTab]) {
      fileInputRefs.current[activeTab]!.value = "";
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="inventory-page invoice-page">
        <AppHeader />
        <div className="inventory-shell invoice-shell">
          <main className="inventory-main invoice-main">
            <section className="inventory-card invoice-panel">
              <div className="inventory-card__heading">
                <div>
                  <p className="invoice-eyebrow">{t.invoices.hero.eyebrow}</p>
                  <h2>{t.invoices.hero.title}</h2>
                  <p>{t.invoices.hero.subtitle}</p>
                </div>
                <div className="invoice-kpis">
                  <article>
                    <p>{t.invoices.summary.totalInvoices}</p>
                    <strong>{summary.count}</strong>
                  </article>
                  <article>
                    <p>{t.invoices.summary.totalAmount}</p>
                    <strong>{formatCurrency(summary.totalAmount)}</strong>
                  </article>
                  <article>
                    <p>{t.invoices.summary.lastSupplier}</p>
                    <strong>{summary.lastSupplier}</strong>
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

              <section className="invoice-section">
                <div className="invoice-section__heading">
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
                <form className="invoice-form" onSubmit={handleSubmit} noValidate>
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
                      <label htmlFor="issueDate">{t.invoices.form.date}</label>
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
                      <label htmlFor="supplier">
                        {activeTab === "venta" ? t.invoices.form.client : t.invoices.form.supplier}
                      </label>
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
                        inputMode="decimal"
                        step="0.01"
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

                  {activeTab === "compra" && currentMaterials.length > 0 ? (
                    <div className="invoice-materials">
                      <div className="invoice-section__heading">
                        <h4>{t.invoices.form.materialsDetected}</h4>
                        <p>{t.invoices.form.materialsHelper}</p>
                      </div>
                      <div className="invoice-materials__list">
                        {currentMaterials.map((item, index) => (
                          <div className="invoice-material" key={`${item.description}-${index}`}>
                            <div className="invoice-field">
                              <label>{t.invoices.form.materialDescription}</label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(event) => updateMaterialRow(index, "description", event.target.value)}
                              />
                            </div>
                            <div className="invoice-field">
                              <label>{t.invoices.form.materialQuantity}</label>
                              <input
                                type="text"
                                value={item.quantity}
                                onChange={(event) => updateMaterialRow(index, "quantity", event.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="invoice-btn invoice-btn--ghost" onClick={addMaterialRow}>
                        {t.invoices.form.addMaterial}
                      </button>
                    </div>
                  ) : null}

                  <div className="invoice-actions">
                    <button type="submit" className="invoice-btn" disabled={isSubmitting}>
                      {isSubmitting ? t.invoices.form.saving : t.invoices.form.submit}
                    </button>
                    <button type="button" className="invoice-btn invoice-btn--ghost" onClick={resetTab}>
                      {t.invoices.form.reset}
                    </button>
                  </div>
                </form>
              </section>

              <section className="invoice-section">
                <div className="invoice-section__heading">
                  <h3>{t.invoices.table.title}</h3>
                  <p>{t.invoices.table.helper}</p>
                </div>

                {invoices.length === 0 ? (
                  <p className="invoice-empty">{t.invoices.table.empty}</p>
                ) : (
                  <div className="invoice-table__wrapper">
                    <table className="invoice-table">
                      <thead>
                        <tr>
                          <th>{t.invoices.table.number}</th>
                          <th>{t.invoices.table.date}</th>
                          <th>{t.invoices.table.supplier}</th>
                          <th>{t.invoices.table.amount}</th>
                          <th>{t.invoices.table.description}</th>
                          <th>{t.invoices.table.attachment}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </section>
          </main>
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
