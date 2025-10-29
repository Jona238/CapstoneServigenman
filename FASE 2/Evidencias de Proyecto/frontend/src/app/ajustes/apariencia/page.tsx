"use client";

import { useEffect, useState } from "react";
import { SettingsHero } from "../components/Hero";
import { SettingsTabs } from "../components/Tabs";

export default function AparienciaPage() {
  const [fontScale, setFontScale] = useState<string>("md");
  const [currency, setCurrency] = useState<string>("CLP");

  useEffect(() => {
    try {
      const fs = localStorage.getItem("ajustes_font_scale");
      if (fs) setFontScale(fs);
      const cur = localStorage.getItem("ajustes_currency");
      if (cur) setCurrency(cur);
    } catch {}
  }, []);

  const applyFontScale = (value: string) => {
    setFontScale(value);
    try {
      localStorage.setItem("ajustes_font_scale", value);
      document.documentElement.setAttribute("data-font-scale", value);
    } catch {}
  };

  const applyCurrency = (value: string) => {
    setCurrency(value);
    try {
      localStorage.setItem("ajustes_currency", value);
      localStorage.setItem("ajustes_currency_decimals", value === "CLP" ? "0" : "2");
      window.dispatchEvent(new StorageEvent("storage", { key: "ajustes_currency", newValue: value }));
    } catch {}
  };

  return (
    <>
      <SettingsHero />
      <div className="settings-grid">
        <SettingsTabs>
          <div className="settings-form">
          <p className="settings-label">Tema</p>
          <div className="settings-actions">
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" id="themeSwitch" style={{ accentColor: "#4b8ef7" }} />
              <span id="themeLabel">Claro</span>
            </label>
          </div>

          <p className="settings-label">Tamaño de letra</p>
          <div className="settings-actions">
            <button type="button" className="btn-secondary" onClick={() => applyFontScale("sm")} aria-pressed={fontScale === "sm"}>Pequeña</button>
            <button type="button" className="btn-secondary" onClick={() => applyFontScale("md")} aria-pressed={fontScale === "md"}>Mediana</button>
            <button type="button" className="btn-secondary" onClick={() => applyFontScale("lg")} aria-pressed={fontScale === "lg"}>Grande</button>
          </div>

          <p className="settings-label">Moneda</p>
          <div className="settings-actions" style={{ alignItems: "center" }}>
            <select value={currency} onChange={(e) => applyCurrency(e.target.value)} className="settings-input" style={{ maxWidth: 240 }}>
              <option value="CLP">Peso chileno (CLP)</option>
              <option value="USD">Dólar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
          </div>
        </SettingsTabs>
      </div>
    </>
  );
}
