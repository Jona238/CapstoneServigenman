"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SettingsTabs } from "../components/Tabs";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="control-section">
      <h3 className="control-section__title">{title}</h3>
      <div className="control-card">{children}</div>
    </section>
  );
}

export default function ControlSistemaPage() {
  const [hours, setHours] = useState<number>(2);
  const [idleMinutes, setIdleMinutes] = useState<number>(30);

  useEffect(() => {
    const h = parseInt(window.localStorage.getItem("system.closeHours") || "2", 10);
    setHours(Number.isFinite(h) ? h : 2);
    const m = parseInt(window.localStorage.getItem("system.idleMinutes") || "30", 10);
    setIdleMinutes(Number.isFinite(m) ? m : 30);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("system.closeHours", String(hours));
    // Also update the exp cookie immediately to reflect the new policy
    try {
      const maxAge = Math.max(3600, Math.min(24 * 3600, hours * 3600));
      const expEpoch = Math.floor(Date.now() / 1000) + maxAge;
      document.cookie = `session_exp=${expEpoch}; path=/; Max-Age=${maxAge}`;
    } catch {}
  }, [hours]);

  useEffect(() => {
    // constrain to 30-45 minutes window per requirement
    const constrained = Math.max(30, Math.min(45, idleMinutes));
    window.localStorage.setItem("system.idleMinutes", String(constrained));
  }, [idleMinutes]);

  const hourOptions = useMemo(
    () => [
      { value: 1, label: "1 hora" },
      { value: 2, label: "2 horas (Recomendado)" },
      { value: 3, label: "3 horas (Menos recomendado)" },
    ],
    []
  );

  const idleOptions = useMemo(() => [30, 35, 40, 45], []);

  return (
    <div className="control-system-shell">
      <section className="settings-hero-card control-hero">
        <h2 className="control-title">Control del sistema</h2>
        <p className="control-hero__desc">
          Ajusta la expiración automática y el tiempo de inactividad permitido en la plataforma.
        </p>
      </section>
      <SettingsTabs>
        <Section title="Cierre automático del sistema">
          <p className="control-text">Define cada cuántas horas expira tu sesión de forma automática.</p>
          <div className="control-options">
            {hourOptions.map((opt) => (
              <label key={opt.value}>
                <input
                  type="radio"
                  name="close-hours"
                  value={opt.value}
                  checked={hours === opt.value}
                  onChange={() => setHours(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          <p className="control-hint">La opción por defecto es 2 horas (Recomendado).</p>
        </Section>

        <Section title="Expiración por inactividad">
          <p className="control-text">
            Configura el tiempo de inactividad permitido. Mostraremos un aviso con un cronómetro de 60 segundos antes de
            cerrar la sesión.
          </p>
          <div className="control-options">
            {idleOptions.map((m) => (
              <label key={m}>
                <input
                  type="radio"
                  name="idle-minutes"
                  value={m}
                  checked={idleMinutes === m}
                  onChange={() => setIdleMinutes(m)}
                />
                <span>{m} min</span>
              </label>
            ))}
          </div>
          <p className="control-hint">Rango permitido: 30-45 minutos.</p>
        </Section>
      </SettingsTabs>
    </div>
  );
}

