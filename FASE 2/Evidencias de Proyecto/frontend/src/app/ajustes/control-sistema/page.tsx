"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SettingsTabs } from "../components/Tabs";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
      <div className="rounded-md border border-gray-200 bg-white p-4">{children}</div>
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
    <div className="container mx-auto max-w-5xl p-4">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Control del sistema</h2>
      <SettingsTabs>
        <Section title="Cierre automático del sistema">
          <p className="mb-3 text-sm text-gray-600">
            Define cada cuántas horas expira tu sesión de forma automática.
          </p>
          <div className="flex flex-col gap-2">
            {hourOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="close-hours"
                  value={opt.value}
                  checked={hours === opt.value}
                  onChange={() => setHours(opt.value)}
                />
                <span className="text-sm text-gray-800">{opt.label}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            La opción por defecto es 2 horas (Recomendado).
          </p>
        </Section>

        <Section title="Expiración por inactividad">
          <p className="mb-3 text-sm text-gray-600">
            Configura el tiempo de inactividad permitido. Mostraremos un aviso con
            un cronómetro de 60 segundos antes de cerrar la sesión.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {idleOptions.map((m) => (
              <label key={m} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="idle-minutes"
                  value={m}
                  checked={idleMinutes === m}
                  onChange={() => setIdleMinutes(m)}
                />
                <span className="text-sm text-gray-800">{m} min</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">Rango permitido: 30–45 minutos.</p>
        </Section>
      </SettingsTabs>
    </div>
  );
}

