"use client";

import { useState } from "react";
import { SettingsHero } from "../components/Hero";
import { SettingsTabs } from "../components/Tabs";

export default function AccesibilidadPage() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

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
            <input
              id="highContrast"
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              style={{ accentColor: "#4b8ef7", marginRight: 8 }}
            />
            Alto contraste
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
