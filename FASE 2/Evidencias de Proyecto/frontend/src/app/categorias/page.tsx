"use client";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import { initializeCategoriesPage } from "./interaction";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

export default function CategoriesPage() {
  useBodyClass();
  const { t } = useLanguage();
  const apiBaseUrl = useMemo(() => {
    const sanitize = (u: string) => u.replace(/\/+$/, "");
    const env = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (env) return sanitize(env);
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return sanitize("http://localhost:8000");
      }
      return sanitize(window.location.origin);
    }
    return "";
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/logout/`, { method: "POST", credentials: "include" });
    } catch {
      // ignore
    } finally {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const cleanup = initializeCategoriesPage();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const layoutClass = "inventory-layout";
    document.body.classList.add(layoutClass);
    return () => {
      document.body.classList.remove(layoutClass);
    };
  }, []);

  return (
    <>
      <AnimatedBackground />
      <div className="categories-page">
        <AppHeader />
        

        <div className="categories-shell" data-low-stock-label={t.inventory.lowStock}>
          <main className="categories-main">
            <section className="categories-hero">
              <div>
                <h2>{t.categories.title}</h2>
                <p>
                  {t.categories.description}
                </p>
              </div>
              <p className="categories-hero__hint">
                {t.categories.hint}
              </p>
            </section>

            <section className="categories-section">
              <header className="categories-section__header">
                <h3>{t.categories.exploreTitle}</h3>
                <p>
                  {t.categories.exploreDescription}
                </p>
              </header>

              <div className="category-carousel" data-row="top">
                <button className="cat-nav prev" aria-label={t.categories.previous}>
                  ‹
                </button>
                <div className="category-track" />
                <button className="cat-nav next" aria-label={t.categories.next}>
                  ›
                </button>
              </div>

              <div className="category-carousel" data-row="bottom">
                <button className="cat-nav prev" aria-label={t.categories.previous}>
                  ‹
                </button>
                <div className="category-track" />
                <button className="cat-nav next" aria-label={t.categories.next}>
                  ›
                </button>
              </div>

              <p id="categoriesEmptyState" className="categories-empty" hidden>
                {t.categories.emptyState}
              </p>
            </section>
          </main>

          <footer className="categories-footer">
            <p>{t.categories.footer}</p>
          </footer>
        </div>
      </div>
    </>
  );
}




