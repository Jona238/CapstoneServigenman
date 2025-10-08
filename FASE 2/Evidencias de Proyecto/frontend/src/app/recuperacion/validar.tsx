"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import "./styles.css";

const INTEGRATION_EVENT = "servigenman:passwordChangeAttempt";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("recuperacion-root");
    body.classList.add("recuperacion-body");
    currentPasswordRef.current?.focus();

    return () => {
      html.classList.remove("recuperacion-root");
      body.classList.remove("recuperacion-body");
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("recovery-rays");
    if (!container) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let active = 0;
    const MAX_AT_ONCE = 5;
    let run = true;
    let cooldownUntil = 0;
    let cancelled = false;

    const handleVisibility = () => {
      run = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibility);

    function spawnRay() {
      if (!run || cancelled || active >= MAX_AT_ONCE) return;
      active += 1;

      const el = document.createElement("span");
      el.className = "ray";

      const w = 6 + Math.random() * 18;
      const x = 6 + Math.random() * 88;
      const rot = (Math.random() - 0.5) * 3.2;
      const dur = 2000 + Math.random() * 3000;

      el.style.setProperty("--w", `${w}px`);
      el.style.setProperty("--x", `${x}%`);
      el.style.setProperty("--rot", `${rot}deg`);
      el.style.setProperty("--dur", `${dur}ms`);

      el.addEventListener("animationend", (event) => {
        if (event.animationName !== "rayLife") return;
        el.remove();
        active = Math.max(0, active - 1);
        cooldownUntil = Date.now() + 220;
      });

      if (container) {
        container.appendChild(el);
      }
    }

    function loop() {
      if (cancelled) return;
      if (run && Date.now() >= cooldownUntil) {
        spawnRay();
      }
      window.setTimeout(loop, 220 + Math.random() * 460);
    }

    loop();

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      container.querySelectorAll(".ray").forEach((node) => node.remove());
    };
  }, []);

  useEffect(() => {
    if (error || success) {
      feedbackRef.current?.focus();
    }
  }, [error, success]);

  const dispatchIntegrationEvent = (detail: Record<string, unknown>) => {
    window.dispatchEvent(
      new CustomEvent(INTEGRATION_EVENT, {
        detail,
      })
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      const message = "Todos los campos son obligatorios.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }

    if (newPassword.length < 8) {
      const message = "La nueva contrasena debe tener al menos 8 caracteres.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      const message = "La nueva contrasena debe incluir mayusculas y minusculas.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }

    if (newPassword !== confirmPassword) {
      const message = "La confirmacion de la contrasena no coincide.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }

    const payload = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    dispatchIntegrationEvent({ status: "pending", payload });

    setSuccess("Contrasena actualizada correctamente (mock sin integracion).");
    dispatchIntegrationEvent({ status: "success", payload });
  };

  return (
    <div className="recovery-shell">
      <div className="noise" />

      <div className="waves">
        <svg className="waves-svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="recovery-wave-a" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2ad1ff" />
              <stop offset="100%" stopColor="#6d78ff" />
            </linearGradient>
            <linearGradient id="recovery-wave-b" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6d78ff" />
              <stop offset="100%" stopColor="#2ad1ff" />
            </linearGradient>
          </defs>
          <path className="wave slow" stroke="url(#recovery-wave-a)" d="M0,130 C180,110 300,85 520,95 C740,105 900,145 1080,135 C1260,125 1360,100 1440,110" />
          <path className="wave mid" stroke="url(#recovery-wave-b)" d="M0,450 C220,430 360,410 580,420 C800,430 980,470 1140,460 C1300,450 1380,420 1440,430" />
          <path className="wave" stroke="url(#recovery-wave-a)" d="M0,760 C200,740 340,740 560,740 C780,740 960,770 1120,760 C1280,750 1380,730 1440,740" />
        </svg>
      </div>

      <div className="circuit" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path className="trace" d="M80 160 H360 L520 260 H780 L980 200 H1320" />
          <circle className="node" cx="360" cy="160" r="3" />
          <circle className="node" cx="520" cy="260" r="3" />
          <circle className="node" cx="980" cy="200" r="3" />
        </svg>
      </div>

      <div className="rays" id="recovery-rays" />

      <main className="recovery-card" aria-labelledby="change-title">
        <div className="recovery-brand">
          <span className="recovery-logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
              <circle cx="23" cy="40" r="8" fill="rgba(255,255,255,.15)" />
              <circle cx="23" cy="40" r="3" fill="#fff" />
              <rect x="31" y="35" width="10" height="10" rx="2" fill="rgba(255,255,255,.2)" />
              <path d="M40 10 L26 30 h9 l-3 14 16-20 h-9 l3-14z" fill="#fff" />
            </svg>
          </span>
          <span>SERVIGENMAN</span>
        </div>

        <h1 id="change-title" className="recovery-title">Cambio de Contrasena</h1>
        <p className="recovery-description">Minimo 8 caracteres, combina letras en mayusculas y minusculas.</p>
      {process.env.NODE_ENV === "development" && (
        <pre style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
          {`
      Nota: No incluye integración HTTP real.
      Emite evento/handler para que la integración lo conecte.
      `}
        </pre>
      )}


        <form className="recovery-form" onSubmit={handleSubmit} noValidate>
          <label className="recovery-label" htmlFor="currentPassword">
            Contrasena actual
          </label>
          <input
            className="recovery-field"
            type="password"
            id="currentPassword"
            ref={currentPasswordRef}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="********"
            autoComplete="current-password"
            required
          />

          <label className="recovery-label" htmlFor="newPassword">
            Nueva contrasena
          </label>
          <input
            className="recovery-field"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="********"
            autoComplete="new-password"
            required
          />

          <label className="recovery-label" htmlFor="confirmPassword">
            Confirmar contrasena
          </label>
          <input
            className="recovery-field"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="********"
            autoComplete="new-password"
            required
          />

          {error && (
            <div
              ref={feedbackRef}
              className="recovery-feedback error"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              ref={feedbackRef}
              className="recovery-feedback success"
              role="status"
              aria-live="polite"
              tabIndex={-1}
            >
              {success}
            </div>
          )}

          <button className="recovery-btn" type="submit">
            Cambiar contrasena
          </button>
        </form>

        <div className="recovery-links">
          <Link href="/recuperacion">Volver a solicitar enlace</Link>
          <Link href="/login">Volver al inicio de sesion</Link>
        </div>

        <div className="recovery-footer">
          2025 Servigenman - Uso exclusivo del personal autorizado -
          <a href="mailto:soporte@servigenman.cl"> soporte@servigenman.cl</a>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
