"use client";

import { useEffect } from "react";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

export default function AjustesLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const body = document.body;
    const layoutClass = "inventory-layout";
    const baseClass = "servigenman-login";
    body.classList.add(baseClass);
    body.classList.add(layoutClass);
    return () => {
      body.classList.remove(layoutClass);
      body.classList.remove(baseClass);
    };
  }, []);

  return (
    <div className="settings-page">
      <AnimatedBackground />
      <AppHeader />
      <div className="settings-shell">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
