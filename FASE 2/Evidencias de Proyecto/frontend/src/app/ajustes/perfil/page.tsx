"use client";

import { useState } from "react";
import Link from "next/link";
import { SettingsHero } from "../components/Hero";
import { SettingsTabs } from "../components/Tabs";

export default function PerfilPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved("Cambios guardados correctamente");
    setTimeout(() => setSaved(null), 1500);
  };

  return (
    <>
      <SettingsHero />
      <div className="settings-grid">
        <SettingsTabs>
          <form className="settings-form" onSubmit={onSubmit}>
          <label className="settings-label" htmlFor="name">Nombre completo</label>
          <input id="name" className="settings-input" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />

          <label className="settings-label" htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" className="settings-input" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />

          {saved && <p className="settings-note" role="status">{saved}</p>}

          <div className="settings-actions">
            <button className="btn-primary" type="submit">Guardar</button>
            <button className="btn-secondary" type="button" onClick={() => { setName(""); setEmail(""); setSaved(null); }}>Cancelar</button>
          </div>
          </form>
          <p style={{ marginTop: 4, color: "var(--settings-muted)" }}>
            También puedes gestionar <Link href="/ajustes/apariencia">Apariencia</Link> y <Link href="/ajustes/accesibilidad">Accesibilidad</Link>.
          </p>
        </SettingsTabs>
      </div>
    </>
  );
}
