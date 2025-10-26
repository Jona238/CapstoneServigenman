"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SettingsHero } from "../components/Hero";
import { SettingsTabs } from "../components/Tabs";

export default function PerfilPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(t.settings.changesSaved);
    setTimeout(() => setSaved(null), 1500);
  };

  return (
    <>
      <SettingsHero />
      <div className="settings-grid">
        <SettingsTabs>
          <form className="settings-form" onSubmit={onSubmit}>
          <label className="settings-label" htmlFor="name">{t.settings.fullName}</label>
          <input id="name" className="settings-input" placeholder={t.settings.yourName} value={name} onChange={(e) => setName(e.target.value)} />

          <label className="settings-label" htmlFor="email">{t.settings.emailAddress}</label>
          <input id="email" type="email" className="settings-input" placeholder={t.settings.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />

          {saved && <p className="settings-note" role="status">{saved}</p>}

          <div className="settings-actions">
            <button className="btn-primary" type="submit">{t.common.save}</button>
            <button className="btn-secondary" type="button" onClick={() => { setName(""); setEmail(""); setSaved(null); }}>{t.common.cancel}</button>
          </div>
          </form>
          <p style={{ marginTop: 4, color: "var(--settings-muted)" }}>
            {t.settings.alsoManage} <Link href="/ajustes/apariencia">{t.settings.appearance}</Link> {t.settings.and} <Link href="/ajustes/accesibilidad">{t.settings.accessibility}</Link>.
          </p>
        </SettingsTabs>
      </div>
    </>
  );
}
