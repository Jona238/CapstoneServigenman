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

type InvoiceForm = {
  invoiceNumber: string;
  issueDate: string;
  supplier: string;
  amount: string;
  description: string;
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
  amountNumber: number;
  createdAt: string;
  attachment?: InvoiceAttachment;
};

type ValidationErrors = Partial<Record<keyof InvoiceForm, string>> & {
  file?: string;
};

const STORAGE_KEY = "servigenman_invoices_v1";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const DEFAULT_FORM: InvoiceForm = {
  invoiceNumber: "",
  issueDate: "",
  supplier: "",
  amount: "",
  description: "",
};

export default function InvoicesPage() {
  useBodyClass();
  const { t, locale } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [form, setForm] = useState<InvoiceForm>(DEFAULT_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed: InvoiceRecord[] = JSON.parse(cached);
        setInvoices(parsed);
      }
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

  const handleInputChange = (field: keyof InvoiceForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) {
      setFile(null);
      setErrors((prev) => ({ ...prev, file: undefined }));
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, file: t.invoices.errors.fileTooLarge }));
      event.target.value = "";
      setFile(null);
      return;
    }
    setFile(nextFile);
    setErrors((prev) => ({ ...prev, file: undefined }));
  };

  const validations = (): ValidationErrors => {
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
    const amountValue = Number(form.amount);
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
    const validationErrors = validations();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const amountNumber = Number(form.amount);
      let attachment: InvoiceAttachment | undefined;
      if (file) {
        const dataUrl = await toBase64(file);
        attachment = {
          id: createId(),
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
        };
      }

      const record: InvoiceRecord = {
        ...form,
        id: createId(),
        amountNumber,
        createdAt: new Date().toISOString(),
        attachment,
      };

      await persistInvoice(record, file);

      setInvoices((prev) => [record, ...prev]);
      setForm(DEFAULT_FORM);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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
                </div>
                <form className="invoice-form" onSubmit={handleSubmit} noValidate>
                  <div className="invoice-form__row">
                    <div className="invoice-field">
                      <label htmlFor="invoiceNumber">{t.invoices.form.number}</label>
                      <input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        type="text"
                        value={form.invoiceNumber}
                        onChange={handleInputChange("invoiceNumber")}
                        aria-invalid={Boolean(errors.invoiceNumber)}
                        aria-describedby={errors.invoiceNumber ? "invoiceNumber-error" : undefined}
                      />
                      {errors.invoiceNumber ? (
                        <span className="invoice-error" id="invoiceNumber-error">
                          {errors.invoiceNumber}
                        </span>
                      ) : null}
                    </div>
                    <div className="invoice-field">
                      <label htmlFor="issueDate">{t.invoices.form.date}</label>
                      <input
                        id="issueDate"
                        name="issueDate"
                        type="date"
                        value={form.issueDate}
                        onChange={handleInputChange("issueDate")}
                        aria-invalid={Boolean(errors.issueDate)}
                        aria-describedby={errors.issueDate ? "issueDate-error" : undefined}
                      />
                      {errors.issueDate ? (
                        <span className="invoice-error" id="issueDate-error">
                          {errors.issueDate}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="invoice-form__row">
                    <div className="invoice-field">
                      <label htmlFor="supplier">{t.invoices.form.supplier}</label>
                      <input
                        id="supplier"
                        name="supplier"
                        type="text"
                        value={form.supplier}
                        onChange={handleInputChange("supplier")}
                        aria-invalid={Boolean(errors.supplier)}
                        aria-describedby={errors.supplier ? "supplier-error" : undefined}
                      />
                      {errors.supplier ? (
                        <span className="invoice-error" id="supplier-error">
                          {errors.supplier}
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
                        value={form.amount}
                        onChange={handleInputChange("amount")}
                        aria-invalid={Boolean(errors.amount)}
                        aria-describedby={errors.amount ? "amount-error" : undefined}
                      />
                      {errors.amount ? (
                        <span className="invoice-error" id="amount-error">
                          {errors.amount}
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
                      value={form.description}
                      onChange={handleInputChange("description")}
                    />
                  </div>

                  <div className="invoice-field">
                    <label htmlFor="attachment">{t.invoices.form.attachment}</label>
                    <input
                      id="attachment"
                      name="attachment"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      aria-invalid={Boolean(errors.file)}
                      aria-describedby={errors.file ? "attachment-error" : undefined}
                    />
                    <small>{t.invoices.form.attachmentHint}</small>
                    {errors.file ? (
                      <span className="invoice-error" id="attachment-error">
                        {errors.file}
                      </span>
                    ) : null}
                  </div>

                  <div className="invoice-actions">
                    <button type="submit" className="invoice-btn" disabled={isSubmitting}>
                      {isSubmitting ? t.invoices.form.saving : t.invoices.form.submit}
                    </button>
                    <button
                      type="button"
                      className="invoice-btn invoice-btn--ghost"
                      onClick={() => {
                        setForm(DEFAULT_FORM);
                        setErrors({});
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
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
                            <td>{invoice.description || "—"}</td>
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
