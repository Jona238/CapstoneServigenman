"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

type CalendarEventType = "maintenance" | "purchase" | "expiration";
type FilterValue = "all" | CalendarEventType;

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
const EVENT_TYPES: CalendarEventType[] = ["maintenance", "purchase", "expiration"];

const typeClassName: Record<CalendarEventType, string> = {
  maintenance: "calendar-tag--maintenance",
  purchase: "calendar-tag--purchase",
  expiration: "calendar-tag--expiration",
};

export default function CalendarPage() {
  useBodyClass();
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

  // Load stored events
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

  // Persist events on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // ignore quota errors
    }
  }, [events]);

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
    const base = {
      maintenance: 0,
      purchase: 0,
      expiration: 0,
      total: events.length,
      nextEvent: null as CalendarEvent | null,
    };

    events.forEach((event) => {
      base[event.type] += 1;
    });

    base.nextEvent = sortedEvents.find((event) => event.date >= todayKey) ?? null;
    return base;
  }, [events, sortedEvents, todayKey]);

  const filteredEvents = useMemo(() => {
    if (filter === "all") {
      return sortedEvents;
    }
    return sortedEvents.filter((event) => event.type === filter);
  }, [sortedEvents, filter]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents.filter((event) => event.date >= todayKey);
  }, [filteredEvents, todayKey]);

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
      maintenance: calendar.types.maintenance,
      purchase: calendar.types.purchase,
      expiration: calendar.types.expiration,
    }),
    [calendar],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.date) {
      return;
    }

    const payload: CalendarEvent = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      id: editingId ?? createEventId(),
    };

    setEvents((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? payload : item));
      }
      return [...prev, payload];
    });

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
            <section className="calendar-hero">
            <div>
              <p className="calendar-hero__eyebrow">{calendar.heroEyebrow}</p>
              <h2>{calendar.heroTitle}</h2>
              <p>{calendar.heroSubtitle}</p>
            </div>
            <div className="calendar-hero__stats">
              <article className="calendar-stat">
                <p className="calendar-stat__label">{calendar.stats.totalEvents}</p>
                <p className="calendar-stat__value">{stats.total}</p>
              </article>
              <article className="calendar-stat">
                <p className="calendar-stat__label">{calendar.stats.nextEvent}</p>
                <p className="calendar-stat__value calendar-stat__value--accent">
                  {stats.nextEvent
                    ? formatFullDate(stats.nextEvent.date, locale)
                    : calendar.stats.noNextEvent}
                </p>
              </article>
              <article className="calendar-stat">
                <p className="calendar-stat__label">{calendar.stats.maintenanceCount}</p>
                <p className="calendar-stat__value">{stats.maintenance}</p>
              </article>
              <article className="calendar-stat">
                <p className="calendar-stat__label">{calendar.stats.purchaseCount}</p>
                <p className="calendar-stat__value">{stats.purchase}</p>
              </article>
              <article className="calendar-stat">
                <p className="calendar-stat__label">{calendar.stats.expirationCount}</p>
                <p className="calendar-stat__value">{stats.expiration}</p>
              </article>
            </div>
          </section>

            <div className="calendar-grid">
            <section className="calendar-card calendar-card--form">
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

                  <div className="calendar-form__field">
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

              <div className="calendar-weekdays">
                {dayNames.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
              <div className="calendar-days">
                {calendarDays.map((day) => (
                  <button
                    type="button"
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    className={[
                      "calendar-day",
                      !day.inMonth ? "calendar-day--outside" : "",
                      day.isToday ? "calendar-day--today" : "",
                      day.isSelected ? "calendar-day--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span>{day.dayNumber}</span>
                    {day.events.length > 0 ? (
                      <span className="calendar-day__badges">
                        {day.events.slice(0, 3).map((event) => (
                          <span
                            key={event.id}
                            className={`calendar-badge ${typeClassName[event.type]}`}
                            aria-label={typeLabels[event.type]}
                          />
                        ))}
                        {day.events.length > 3 ? (
                          <span className="calendar-badge calendar-badge--count">+{day.events.length - 3}</span>
                        ) : null}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="calendar-day-detail">
                <div className="calendar-day-detail__header">
                  <h4>{selectedDayTitle}</h4>
                  {isSelectedDayToday ? (
                    <span className="calendar-chip">{calendar.labels.today}</span>
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

              <div className="calendar-legend">
                <p>{calendar.legend}</p>
                <div>
                  {EVENT_TYPES.map((type) => (
                    <span key={type} className={`calendar-tag ${typeClassName[type]}`}>
                      {typeLabels[type]}
                    </span>
                  ))}
                </div>
              </div>
            </section>

              <section className="calendar-card calendar-card--list">
              <div className="calendar-card__header">
                <div>
                  <p className="calendar-card__eyebrow">{calendar.upcomingTitle}</p>
                  <h3>{calendar.upcomingSubtitle}</h3>
                </div>
                <span className="calendar-chip calendar-chip--muted">{calendar.localOnly}</span>
              </div>

              <div className="calendar-filters">
                <p>{calendar.filters.label}</p>
                <div className="calendar-filter__options">
                  <button
                    type="button"
                    className={filter === "all" ? "calendar-filter calendar-filter--active" : "calendar-filter"}
                    onClick={() => setFilter("all")}
                  >
                    {calendar.filters.all} ({events.length})
                  </button>
                  {EVENT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={filter === type ? "calendar-filter calendar-filter--active" : "calendar-filter"}
                      onClick={() => setFilter(type)}
                    >
                      {typeLabels[type]} ({stats[type]})
                    </button>
                  ))}
                </div>
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
            </div>
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
    type: "maintenance",
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
