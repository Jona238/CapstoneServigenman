"use client";

import { useEffect, useState } from "react";
import { SettingsHero } from "../components/Hero";
import { SettingsTabs } from "../components/Tabs";

export default function AccesibilidadPage() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrastLevel, setHighContrastLevel] = useState(100);
  const [uiScale, setUiScale] = useState(100);
  const contrastMin = 0;
  const contrastMax = 200;
  const scaleMin = 90;
  const scaleMax = 120;
  const highContrastStorageKey = "accesibilidad_high_contrast";
  const uiScaleStorageKey = "accesibilidad_ui_scale";

  const updateDocumentContrast = (value: number) => {
    if (typeof document === "undefined") return;
    const factor = value / 100;
    document.documentElement.style.setProperty("--user-contrast", factor.toFixed(2));
  };

  const updateDocumentFontScale = (value: number) => {
    if (typeof document === "undefined") return;
    const factor = value / 100;
    document.documentElement.style.setProperty("--user-font-scale", factor.toFixed(2));
  };

  useEffect(() => {
    try {
      const storedContrast = localStorage.getItem(highContrastStorageKey);
      if (storedContrast !== null) {
        const parsed = Number.parseInt(storedContrast, 10);
        if (!Number.isNaN(parsed)) {
          const sanitized = Math.min(contrastMax, Math.max(contrastMin, parsed));
          setHighContrastLevel(sanitized);
          updateDocumentContrast(sanitized);
        }
      }
      const storedScale = localStorage.getItem(uiScaleStorageKey);
      if (storedScale !== null) {
        const parsedScale = Number.parseInt(storedScale, 10);
        if (!Number.isNaN(parsedScale)) {
          const sanitizedScale = Math.min(scaleMax, Math.max(scaleMin, parsedScale));
          setUiScale(sanitizedScale);
          updateDocumentFontScale(sanitizedScale);
        }
      }
    } catch {
      // Ignore storage access issues silently.
    }
  }, []);

  const applyHighContrast = (value: number) => {
    const sanitized = Math.min(contrastMax, Math.max(contrastMin, value));
    setHighContrastLevel(sanitized);
    updateDocumentContrast(sanitized);
    try {
      localStorage.setItem(highContrastStorageKey, sanitized.toString());
    } catch {
      // Ignore storage access issues silently.
    }
  };

  const applyUiScale = (value: number) => {
    const sanitized = Math.min(scaleMax, Math.max(scaleMin, value));
    setUiScale(sanitized);
    updateDocumentFontScale(sanitized);
    try {
      localStorage.setItem(uiScaleStorageKey, sanitized.toString());
    } catch {
      // Ignore storage access issues silently.
    }
  };

  return (
    <>
      <SettingsHero />
      <div className="settings-grid">
        <SettingsTabs>
          <div className="settings-form">
            <label className="settings-label" htmlFor="reduceMotion">
              <input
                id="reduceMotion"
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                style={{ accentColor: "#4b8ef7", marginRight: 8 }}
              />
              Reducir animaciones
            </label>

            <label className="settings-label" htmlFor="highContrast">
              Alto contraste
              <br />
              <input
                id="highContrast"
                type="range"
                min={contrastMin}
                max={contrastMax}
                step={10}
                value={highContrastLevel}
                onChange={(e) => applyHighContrast(Number(e.target.value))}
                className="settings-slider"
              />
              <span style={{ display: "block", marginTop: 4 }}>
                Nivel de contraste: {highContrastLevel}%
              </span>
            </label>

            <label className="settings-label" htmlFor="uiScale">
              Tamano de interfaz
              <br />
              <input
                id="uiScale"
                type="range"
                min={scaleMin}
                max={scaleMax}
                step={1}
                value={uiScale}
                onChange={(e) => applyUiScale(Number(e.target.value))}
                className="settings-slider"
              />
              <span style={{ display: "block", marginTop: 4 }}>
                Escala UI: {uiScale}%
              </span>
            </label>

            <div className="settings-actions">
              <button className="btn-primary" type="button" onClick={() => alert("Preferencias guardadas (demo)")}>Guardar</button>
            </div>
          </div>
        </SettingsTabs>
      </div>
    </>
  );
}

