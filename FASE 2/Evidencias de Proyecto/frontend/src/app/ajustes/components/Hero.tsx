"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function SettingsHero() {
  const { t } = useLanguage();

  return (
    <section className="settings-hero-card">
      <div className="settings-breadcrumb">
        <Link href="/inicio">{t.common.home.toUpperCase()}</Link>
        <span>›</span>
        <span>{t.settings.account}</span>
        <span>›</span>
        <span>{t.common.settings.toUpperCase()}</span>
      </div>
      <h1 className="settings-hero-title">{t.settings.settingsCenter}</h1>
      <p className="settings-hero-desc">
        {t.settings.settingsDescription}
      </p>
    </section>
  );
}

