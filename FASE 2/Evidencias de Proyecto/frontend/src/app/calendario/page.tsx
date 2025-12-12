"use client";

import { FormEvent, useEffect, useMemo, useState, useCallback, CSSProperties } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

type CalendarEventType =
  | "factura_venta"
  | "nota"
  | "factura_compra"
  | "inicio_trabajo"
  | "termino_trabajo"
  | "pago_pendiente"
  | "pago_compra";
type FilterValue = "all" | CalendarEventType;
type RangeMode = "month" | "all" | "custom";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
  type: CalendarEventType;
};

type FormState = {
  title: string;
  date: string;
  description: string;
  type: CalendarEventType;
};

type CalendarDayCell = {
  key: string;
  dayNumber: number;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
};

const CALENDAR_FALLBACK = {
  heroEyebrow: "Planificación operativa",
  heroTitle: "Calendario operativo",
  heroSubtitle: "Agenda de mantenimiento y abastecimiento.",
  stats: {
    totalEvents: "Eventos registrados",
    nextEvent: "Próximo evento",
    noNextEvent: "Sin fecha pendiente",
    maintenanceCount: "Mantenciones",
    purchaseCount: "Compras",
    expirationCount: "Vencimientos",
  },
  formTitle: "Registrar evento",
  formDescription: "Define fechas críticas para tu equipo.",
  form: {
    title: "Título del evento",
    titlePlaceholder: "Ej: Mantención preventiva",
    date: "Fecha",
    type: "Tipo",
    description: "Descripción / notas",
    descriptionPlaceholder: "Notas internas para cuadrillas o compras.",
    helper: "Datos guardados localmente.",
    createButton: "Agregar",
    updateButton: "Guardar cambios",
    cancelEdit: "Cancelar",
  },
  editing: "Editando evento",
  calendarTitle: "Calendario operativo",
  calendarSubtitle: "Selecciona un día para revisar sus hitos.",
  selectedDayTitle: "Agenda del {date}",
  selectedDayEmpty: "No hay eventos planificados para esta fecha.",
  legend: "Leyenda de tipos de evento",
  upcomingTitle: "Próximos hitos",
  upcomingSubtitle: "Planificación cronológica",
  upcomingEmpty: "No existen hitos pendientes.",
  localOnly: "Datos guardados localmente",
  filters: {
    label: "Filtrar por tipo",
    all: "Todos",
  },
  types: {
    maintenance: "Mantención",
    purchase: "Compra",
    expiration: "Vencimiento",
  },
  labels: {
    today: "Hoy",
  },
};

const STORAGE_KEY = "servigenman_calendar_events_v1";
const EVENT_TYPES: CalendarEventType[] = [
  "factura_venta",
  "factura_compra",
  "inicio_trabajo",
  "termino_trabajo",
  "pago_compra",
  "pago_pendiente",
  "nota",
];

const typeClassName: Record<CalendarEventType, string> = {
  factura_venta: "calendar-tag--purchase",
  factura_compra: "calendar-tag--warning",
  inicio_trabajo: "calendar-tag--info",
  termino_trabajo: "calendar-tag--danger",
  pago_compra: "calendar-tag--warning",
  pago_pendiente: "calendar-tag--warning",
  nota: "calendar-tag--maintenance",
};

const DAY_COLORS: Record<CalendarEventType, string> = {
  factura_venta: "#4f6bff",
  factura_compra: "#ff8c42",
  inicio_trabajo: "#2ed4d4",
  termino_trabajo: "#ff5c74",
  pago_compra: "#facc15",
  pago_pendiente: "#f5c64c",
  nota: "#3ccf7c",
};

export default function CalendarPage() {
  useBodyClass(["inventory-layout"]);
  const { t, locale } = useLanguage();
  const calendar = useMemo(() => ({
    ...CALENDAR_FALLBACK,
    ...(t.calendar ?? {}),
    stats: { ...CALENDAR_FALLBACK.stats, ...(t.calendar?.stats ?? {}) },
    form: { ...CALENDAR_FALLBACK.form, ...(t.calendar?.form ?? {}) },
    filters: { ...CALENDAR_FALLBACK.filters, ...(t.calendar?.filters ?? {}) },
    types: { ...CALENDAR_FALLBACK.types, ...(t.calendar?.types ?? {}) },
    labels: { ...CALENDAR_FALLBACK.labels, ...(t.calendar?.labels ?? {}) },
  }), [t]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [formData, setFormData] = useState<FormState>(() => getDefaultFormState());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => formatDateKey(new Date()));
  const [showDayModal, setShowDayModal] = useState(false);
  const [rangeMode, setRangeMode] = useState<RangeMode>("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

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

  const fetchEvents = useCallback(
    async (from?: string, to?: string) => {
      if (!apiBaseUrl) return;
      try {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        const query = params.toString();
        const url = query ? `${apiBaseUrl}/api/calendar/?${query}` : `${apiBaseUrl}/api/calendar/`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const items = Array.isArray(data) ? data : [];
        const normalized = items.map(mapApiEvent);
        setEvents(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch {
        // ignore JSON/localStorage errors
      }
    },
    [apiBaseUrl],
  );

  // Load stored events initially (offline cache)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CalendarEvent[] = JSON.parse(raw);
        setEvents(parsed);
      }
    } catch {
      // ignore JSON/localStorage errors
    }
  }, []);

  useEffect(() => {
    const computeRange = () => {
      if (rangeMode === "all") {
        return { from: undefined, to: undefined };
      }
      if (rangeMode === "custom") {
        if (!customFrom || !customTo) return null;
        return { from: customFrom, to: customTo };
      }
      const from = formatDateKey(startOfMonth(monthCursor));
      const toDate = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);
      const to = formatDateKey(toDate);
      return { from, to };
    };
    const range = computeRange();
    if (range) {
      fetchEvents(range.from, range.to);
    }
  }, [fetchEvents, monthCursor, rangeMode, customFrom, customTo]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      if (!map.has(event.date)) {
        map.set(event.date, []);
      }
      map.get(event.date)!.push(event);
    });
    return map;
  }, [events]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.date.localeCompare(b.date));
  }, [events]);

  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const isSelectedDayToday = selectedDay === todayKey;

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

  const stats = useMemo(() => {
    const base: Record<string, any> = {
      factura_venta: 0,
      factura_compra: 0,
      inicio_trabajo: 0,
      termino_trabajo: 0,
      pago_pendiente: 0,
      pago_compra: 0,
      nota: 0,
      total: events.length,
    };

    events.forEach((event) => {
      base[event.type] = (base[event.type] || 0) + 1;
    });

    return base;
  }, [events, sortedEvents, todayKey]);

  const filteredEvents = useMemo(() => {
    if (filter === "all") {
      return sortedEvents;
    }
    return sortedEvents.filter((event) => event.type === filter);
  }, [sortedEvents, filter]);

  const upcomingEvents = useMemo(() => filteredEvents.filter((event) => event.date >= todayKey), [filteredEvents, todayKey]);
  const nextEvent = useMemo(() => sortedEvents.find((event) => event.date >= todayKey) ?? null, [sortedEvents, todayKey]);

  const upcomingAll = useMemo(() => sortedEvents.filter((event) => event.date >= todayKey), [sortedEvents, todayKey]);

  const selectedDayEvents = useMemo(() => {
    const items = eventsByDay.get(selectedDay) ?? [];
    return [...items].sort((a, b) => a.title.localeCompare(b.title, locale));
  }, [eventsByDay, selectedDay, locale]);

  const dayNames = useMemo(() => {
    const base = new Date(Date.UTC(2023, 0, 2)); // Monday
    return Array.from({ length: 7 }).map((_, index) => {
      const ref = new Date(base);
      ref.setUTCDate(base.getUTCDate() + index);
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(ref);
    });
  }, [locale]);

  const calendarDays = useMemo(
    () => buildCalendarDays(monthCursor, selectedDay, eventsByDay),
    [monthCursor, selectedDay, eventsByDay],
  );

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(monthCursor);
  }, [locale, monthCursor]);

  const selectedDayLabel = useMemo(() => {
    if (!selectedDay) return "";
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(parseDateKey(selectedDay));
  }, [locale, selectedDay]);

  const typeLabels = useMemo(
    () => ({
      factura_venta: "Factura de venta",
      factura_compra: "Factura de compra",
      inicio_trabajo: "Inicio de trabajo",
      termino_trabajo: "Termino de trabajo",
      pago_compra: "Pago pendiente",
      pago_pendiente: "Pago pendiente",
      nota: "Nota",
    }),
    [],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.date) {
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    try {
      if (editingId) {
        await fetch(`${apiBaseUrl}/api/calendar/${editingId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${apiBaseUrl}/api/calendar/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }
      const from = formatDateKey(startOfMonth(monthCursor));
      const toDate = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);
      const to = formatDateKey(toDate);
      await fetchEvents(from, to);
    } catch {
      // ignore network errors
    }

    setSelectedDay(payload.date);
    setMonthCursor(startOfMonth(parseDateKey(payload.date)));
    setFormData(getDefaultFormState());
    setEditingId(null);
  };

  const beginEdit = (calendarEvent: CalendarEvent) => {
    setFormData({
      title: calendarEvent.title,
      date: calendarEvent.date,
      description: calendarEvent.description,
      type: calendarEvent.type,
    });
    setSelectedDay(calendarEvent.date);
    setMonthCursor(startOfMonth(parseDateKey(calendarEvent.date)));
    setEditingId(calendarEvent.id);
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormData(getDefaultFormState());
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(getDefaultFormState());
  };

  const changeMonth = (delta: number) => {
    setMonthCursor((prev) => startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + delta, 1)));
  };

  const selectedDayTitle = calendar.selectedDayTitle.replace("{date}", selectedDayLabel || "--");

  return (
    <>
      <AnimatedBackground />
      <div className="calendar-page inventory-page">
        <AppHeader />
        <div className="inventory-shell calendar-shell">
          <main className="calendar-main">
            <header className="hero">
              <div className="hero-text">
                <p className="hero-kicker">PLANIFICACIÓN OPERATIVA</p>
                <h1 className="hero-title">Calendario operativo</h1>
                <p className="hero-subtitle">Agenda de mantenimiento y abastecimiento.</p>
              </div>
              <div className="calendar-hero__stats">
                <article className="calendar-stat">
                  <p className="calendar-stat__label">{calendar.stats.totalEvents}</p>
                  <p className="calendar-stat__value">{stats.total}</p>
                </article>
                <article className="calendar-stat">
                  <p className="calendar-stat__label">{calendar.stats.nextEvent}</p>
                  <p className="calendar-stat__value calendar-stat__value--accent">
                    {nextEvent ? formatFullDate(nextEvent.date, locale) : calendar.stats.noNextEvent}
                  </p>
                </article>
                <article className="calendar-stat">
                  <p className="calendar-stat__label">Facturas de venta</p>
                  <p className="calendar-stat__value">{stats.factura_venta}</p>
                </article>
                <article className="calendar-stat">
                  <p className="calendar-stat__label">Notas</p>
                  <p className="calendar-stat__value">{stats.nota}</p>
                </article>
              </div>
            </header>

            <div className="calendar-grid calendar-grid--three">
            <section className="calendar-card calendar-card--form leftCard">
              <header>
                <p className="calendar-card__eyebrow">{calendar.formTitle}</p>
                <h3>{calendar.formDescription}</h3>
              </header>

              {editingId ? (
                <div className="calendar-mode-banner" role="status">
                  <strong>{calendar.editing}</strong>
                  <span>{formData.title || calendar.form.title}</span>
                </div>
              ) : null}

              <form className="calendar-form" onSubmit={handleSubmit}>
                <div className="calendar-form__field">
                  <label htmlFor="eventTitle">{calendar.form.title}</label>
                  <input
                    id="eventTitle"
                    name="title"
                    type="text"
                    value={formData.title}
                    placeholder={calendar.form.titlePlaceholder}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="calendar-form__row">
                  <div className="calendar-form__field">
                    <label htmlFor="eventDate">{calendar.form.date}</label>
                    <input
                      id="eventDate"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="calendar-form__field" style={{ maxWidth: "115px" }}>
                    <label htmlFor="eventType">{calendar.form.type}</label>
                    <select
                      id="eventType"
                      name="type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, type: e.target.value as CalendarEventType }))
                      }
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {typeLabels[type]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="calendar-form__field">
                  <label htmlFor="eventDescription">{calendar.form.description}</label>
                  <textarea
                    id="eventDescription"
                    name="description"
                    rows={4}
                    value={formData.description}
                    placeholder={calendar.form.descriptionPlaceholder}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </div>

                <p className="calendar-form__helper">{calendar.form.helper}</p>

                <div className="calendar-form__actions">
                  <button type="submit" className="calendar-btn calendar-btn--primary">
                    {editingId ? calendar.form.updateButton : calendar.form.createButton}
                  </button>
                  {editingId ? (
                    <button
                      type="button"
                      className="calendar-btn calendar-btn--ghost"
                      onClick={resetForm}
                    >
                      {calendar.form.cancelEdit}
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className="calendar-card calendar-card--calendar">
              <div className="calendar-card__header">
                <div>
                  <p className="calendar-card__eyebrow">{calendar.calendarTitle}</p>
                  <h3>{calendar.calendarSubtitle}</h3>
                </div>
                <div className="calendar-header-actions">
                  <div className="calendar-month-controls">
                    <button type="button" aria-label={t.common.previous} onClick={() => changeMonth(-1)}>
                      {"<"}
                    </button>
                    <p>{monthLabel}</p>
                    <button type="button" aria-label={t.common.next} onClick={() => changeMonth(1)}>
                      {">"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="calendar-weekdays">
                {dayNames.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
              <div className="calendar-days">
                {calendarDays.map((day) => {
                  const types = new Set(day.events.map((ev) => ev.type));
                  const presentTypes = Array.from(types) as CalendarEventType[];
                  const hasPayment =
                    presentTypes.includes("pago_compra") || presentTypes.includes("pago_pendiente");
                  let variant = "";
                  let inlineStyle: CSSProperties = {};
                  if (hasPayment) {
                    variant = "calendar-day--payment";
                    inlineStyle = { background: "#facc15", color: "#111827", borderColor: "#fde68a" };
                  } else if (presentTypes.length === 1) {
                    const only = presentTypes[0];
                    variant = `calendar-day--${only}`;
                    inlineStyle = { background: DAY_COLORS[only], color: "#0b0f1e" };
                  } else if (presentTypes.length === 2) {
                    const [a, b] = presentTypes;
                    inlineStyle = {
                      background: `linear-gradient(135deg, ${DAY_COLORS[a]} 50%, ${DAY_COLORS[b]} 50%)`,
                      color: "#0b0f1e",
                    };
                  } else if (presentTypes.length >= 3) {
                    const [a, b, c] = presentTypes;
                    inlineStyle = {
                      background: `linear-gradient(90deg, ${DAY_COLORS[a]} 33%, ${DAY_COLORS[b]} 33%, ${DAY_COLORS[b]} 66%, ${DAY_COLORS[c]} 66%)`,
                      color: "#0b0f1e",
                    };
                  }
                  const count = day.events.length;
                  return (
                  <button
                    type="button"
                    key={day.key}
                    onClick={() => {
                      setSelectedDay(day.key);
                      setShowDayModal(true);
                    }}
                    className={[
                      "calendar-day",
                      !day.inMonth ? "calendar-day--outside" : "",
                      day.isToday ? "calendar-day--today" : "",
                      day.isSelected ? "calendar-day--selected" : "",
                      variant,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={inlineStyle}
                  >
                    <span className="calendar-day__number">{day.dayNumber}</span>
                    {count > 0 ? (
                      <span className="calendar-day__badges">
                        <span className="calendar-badge calendar-badge--count day-count">{count}</span>
                      </span>
                    ) : null}
                  </button>
                  );
                })}
              </div>

              <div className="calendar-day-detail">
                <div className="calendar-day-detail__header">
                  <h4>{selectedDayTitle}</h4>
                  {isSelectedDayToday ? (
                    <span className="calendar-chip" style={{ marginBottom: "15px" }}>{calendar.labels.today} </span>
                  ) : null}
                </div>
                {selectedDayEvents.length === 0 ? (
                  <p className="calendar-empty">{calendar.selectedDayEmpty}</p>
                ) : (
                  <ul className="calendar-events">
                    {selectedDayEvents.map((event) => (
                      <li key={event.id} className="calendar-event">
                      <div>
                        <p className="calendar-event__title">{event.title}</p>
                        <p className="calendar-event__meta">
                          <span className={`calendar-tag ${typeClassName[event.type]}`}>
                            {typeLabels[event.type]}
                          </span>
                            {event.description ? <span>{event.description}</span> : null}
                        </p>
                        {event.type === "pago_pendiente" && event.description ? (
                          <p className="calendar-event__meta">{event.description}</p>
                        ) : null}
                      </div>
                        <div className="calendar-event__actions">
                          <button type="button" onClick={() => beginEdit(event)}>
                            {t.common.edit}
                          </button>
                          <button type="button" onClick={() => handleDelete(event.id)}>
                            {t.common.delete}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <aside className="calendar-sidebar rightColumn">
            <section className="calendar-card calendar-card--filters">
              <div className="calendar-card__header">
                <div>
                  <p className="calendar-card__eyebrow">Filtros</p>
                  <h3>Filtrar por fecha</h3>
                </div>
              </div>
              <div className="calendar-filter-panel">
                <div className="calendar-filter-block">
                  <div className="calendar-range__options calendar-range__options--wrap">
                    <button
                      type="button"
                      className={rangeMode === "month" ? "calendar-filter calendar-filter--active" : "calendar-filter"}
                      onClick={() => setRangeMode("month")}
                    >
                      Mes actual
                    </button>
                    <button
                      type="button"
                      className={rangeMode === "all" ? "calendar-filter calendar-filter--active" : "calendar-filter"}
                      onClick={() => setRangeMode("all")}
                    >
                      Todo
                    </button>
                    <button
                      type="button"
                      className={rangeMode === "custom" ? "calendar-filter calendar-filter--active" : "calendar-filter"}
                      onClick={() => setRangeMode("custom")}
                    >
                      Rango personalizado
                    </button>
                  </div>
                  {rangeMode === "custom" ? (
                    <div className="calendar-range__inputs">
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="calendar-range__input"
                        aria-label="Desde"
                      />
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="calendar-range__input"
                        aria-label="Hasta"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="calendar-filter-block">
                  <p className="calendar-range__label">Conteo por tipo</p>
                  <div className="calendar-filter__options calendar-filter__options--grid calendar-filter__options--static">
                    <span className="calendar-filter calendar-filter--static">
                      Todos ({events.length})
                    </span>
                    <span className="calendar-filter calendar-filter--static">
                      {typeLabels.factura_venta} ({stats.factura_venta})
                    </span>
                    <span className="calendar-filter calendar-filter--static">
                      {typeLabels.factura_compra} ({stats.factura_compra})
                    </span>
                    <span className="calendar-filter calendar-filter--static">
                      {typeLabels.inicio_trabajo} ({stats.inicio_trabajo})
                    </span>
                    <span className="calendar-filter calendar-filter--static">
                      {typeLabels.termino_trabajo} ({stats.termino_trabajo})
                    </span>
                    <span className="calendar-filter calendar-filter--static">
                      {typeLabels.nota} ({stats.nota})
                    </span>
                    <span className="calendar-filter calendar-filter--static">
                      {typeLabels.pago_pendiente} ({stats.pago_pendiente})
                    </span>
                  </div>
                </div>

                <div className="calendar-filter-block">
                  <p className="calendar-range__label">Leyenda</p>
                  <div className="calendar-legend-inline">
                    <span className="legend-item">
                      <span className="legend-swatch legend-swatch--venta" /> Factura de venta
                    </span>
                    <span className="legend-item">
                      <span className="legend-swatch legend-swatch--compra" /> Factura de compra
                    </span>
                    <span className="legend-item">
                      <span className="legend-swatch legend-swatch--inicio" /> Inicio de trabajo
                    </span>
                    <span className="legend-item">
                      <span className="legend-swatch legend-swatch--termino" /> Término de trabajo
                    </span>
                    <span className="legend-item">
                      <span className="legend-swatch legend-swatch--nota" /> Nota
                    </span>
                    <span className="legend-item">
                      <span className="legend-swatch legend-swatch--pago" /> Pago pendiente
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="calendar-card calendar-card--list nextMilestonesCard">
              <div className="calendar-card__header">
                <div>
                  <p className="calendar-card__eyebrow">{calendar.upcomingTitle}</p>
                  <h3>{calendar.upcomingSubtitle}</h3>
                </div>
                <span className="calendar-chip calendar-chip--muted">{calendar.localOnly}</span>
              </div>

              {upcomingEvents.length === 0 ? (
                <p className="calendar-empty">{calendar.upcomingEmpty}</p>
              ) : (
                <ul className="calendar-upcoming">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="calendar-upcoming__item">
                      <div>
                        <p className="calendar-event__title">{event.title}</p>
                        <p className="calendar-event__meta">
                          <span className={`calendar-tag ${typeClassName[event.type]}`}>
                            {typeLabels[event.type]}
                          </span>
                          <span>{formatFullDate(event.date, locale)}</span>
                        </p>
                        {event.type === "pago_pendiente" && event.description ? (
                          <p className="calendar-event__meta">{event.description}</p>
                        ) : null}
                      </div>
                      <div className="calendar-event__actions">
                        <button type="button" onClick={() => beginEdit(event)}>
                          {t.common.edit}
                        </button>
                        <button type="button" onClick={() => handleDelete(event.id)}>
                          {t.common.delete}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            </aside>
            </div>
            {showDayModal ? (
              <div className="calendar-modal" role="dialog" aria-modal="true">
                <div className="calendar-modal__backdrop" onClick={() => setShowDayModal(false)} />
                <div className="calendar-modal__dialog" onClick={(e) => e.stopPropagation()}>
                  <div className="calendar-modal__header">
                    <h4>Eventos del {selectedDayLabel || selectedDay}</h4>
                    <button type="button" className="calendar-btn" onClick={() => setShowDayModal(false)}>
                      Cerrar
                    </button>
                  </div>
                  {selectedDayEvents.length === 0 ? (
                    <p className="calendar-empty">{calendar.selectedDayEmpty}</p>
                  ) : (
                    <ul className="calendar-events">
                      {selectedDayEvents.map((event) => (
                        <li key={event.id} className="calendar-event">
                          <div>
                            <p className="calendar-event__title">{event.title}</p>
                            <p className="calendar-event__meta">
                              <span className={`calendar-tag ${typeClassName[event.type]}`}>
                                {typeLabels[event.type]}
                              </span>
                              {event.description ? <span>{event.description}</span> : null}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="calendar-modal__actions">
                    <button
                      type="button"
                      className="calendar-btn"
                      onClick={() => {
                        setFormData({ ...getDefaultFormState(), date: selectedDay, type: "nota" });
                        setEditingId(null);
                        setShowDayModal(false);
                      }}
                    >
                      Agregar nota
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <AppFooter />
          </main>
        </div>
      </div>
    </>
  );
}

function getDefaultFormState(): FormState {
  return {
    title: "",
    date: "",
    description: "",
    type: "nota",
  };
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatFullDate(dateKey: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseDateKey(dateKey));
}

function createEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mapApiEvent(raw: any): CalendarEvent {
  return {
    id: String(raw.id || createEventId()),
    title: raw.title || "Evento",
    date: raw.date || "",
    description: raw.description || "",
    type: (raw.type as CalendarEventType) || "nota",
  };
}

function buildCalendarDays(
  monthCursor: Date,
  selectedDay: string,
  eventsByDay: Map<string, CalendarEvent[]>,
): CalendarDayCell[] {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday as first day of week
  const totalDays = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;
  const todayKey = formatDateKey(new Date());

  return Array.from({ length: totalCells }).map((_, index) => {
    const dayDate = new Date(year, month, index - startOffset + 1);
    const key = formatDateKey(dayDate);
    return {
      key,
      dayNumber: dayDate.getDate(),
      inMonth: dayDate.getMonth() === month,
      isToday: key === todayKey,
      isSelected: key === selectedDay,
      events: eventsByDay.get(key) ?? [],
    };
  });
}











