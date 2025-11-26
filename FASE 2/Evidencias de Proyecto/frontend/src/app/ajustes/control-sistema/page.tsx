"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SettingsHero } from "../components/Hero";
import { SettingsTabs } from "../components/Tabs";

export default function ControlSistemaPage() {
  const { t } = useLanguage();
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
      { value: 1, label: t.systemControl.oneHour },
      { value: 2, label: t.systemControl.twoHours },
      { value: 3, label: t.systemControl.threeHours },
    ],
    [t]
  );

  const idleOptions = useMemo(() => [30, 35, 40, 45], []);

  return (
    <>
      <SettingsHero />
      <div className="settings-grid">
        <SettingsTabs>
          <div className="settings-form">
            <p className="settings-label">{t.systemControl.autoClose}</p>
            <p style={{ marginTop: 8, marginBottom: 12, color: "var(--settings-muted)", fontSize: "14px" }}>
              {t.systemControl.autoCloseDescription}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {hourOptions.map((opt) => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="close-hours"
                    value={opt.value}
                    checked={hours === opt.value}
                    onChange={() => setHours(opt.value)}
                  />
                  <span className="settings-option-light" style={{ fontSize: "14px" }}>{opt.label}</span>
                </label>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "var(--settings-muted)" }}>
              {t.systemControl.defaultOption}
            </p>

            <p className="settings-label" style={{ marginTop: 24 }}>{t.systemControl.idleExpiration}</p>
            <p style={{ marginTop: 8, marginBottom: 12, color: "var(--settings-muted)", fontSize: "14px" }}>
              {t.systemControl.idleDescription}
            </p>
            <div className="settings-actions" style={{ alignItems: "center", marginBottom: 16 }}>
              {idleOptions.map((m) => (
                <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="idle-minutes"
                    value={m}
                    checked={idleMinutes === m}
                    onChange={() => setIdleMinutes(m)}
                  />
                  <span className="settings-option-light" style={{ fontSize: "14px" }}>{m} {t.systemControl.minutes}</span>
                </label>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "var(--settings-muted)" }}>{t.systemControl.allowedRange}</p>
          </div>
        </SettingsTabs>
      </div>
    </>
  );
}

