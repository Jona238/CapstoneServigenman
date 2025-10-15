"use client";

import Link from "next/link";

export function SettingsHero() {
  return (
    <section className="settings-hero-card">
      <div className="settings-breadcrumb">
        <Link href="/inicio">INICIO</Link>
        <span>›</span>
        <span>CUENTA</span>
        <span>›</span>
        <span>AJUSTES</span>
      </div>
      <h1 className="settings-hero-title">Centro de ajustes</h1>
      <p className="settings-hero-desc">
        Administra tu perfil como responsable de Servigenman y ajusta la apariencia y accesibilidad de la plataforma.
      </p>
    </section>
  );
}

