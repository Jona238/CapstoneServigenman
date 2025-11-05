"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import "../styles.css";

const INTEGRATION_EVENT = "servigenman:passwordResetWithCode";

export default function CambiarContrasenaConCodigo() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("recuperacion-root");
    body.classList.add("recuperacion-body");
    emailRef.current?.focus();
    return () => {
      html.classList.remove("recuperacion-root");
      body.classList.remove("recuperacion-body");
    };
  }, []);

  useEffect(() => {
    if (error || success) {
      feedbackRef.current?.focus();
    }
  }, [error, success]);

  const dispatchIntegrationEvent = (detail: Record<string, unknown>) => {
    window.dispatchEvent(new CustomEvent(INTEGRATION_EVENT, { detail }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !code || !newPassword || !confirmPassword) {
      const message = "Todos los campos son obligatorios.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }
    if (newPassword.length < 8) {
      const message = "La nueva contraseña debe tener al menos 8 caracteres.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }
    if (newPassword !== confirmPassword) {
      const message = "Las contraseñas no coinciden.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }

    dispatchIntegrationEvent({ status: "pending", payload: { username } });
    try {
      const base = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
      const res = await fetch(`${base}/api/password/reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username.trim(), code: code.trim(), new_password: newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        const message = data?.error || 'No fue posible cambiar la contraseña.';
        setError(message);
        dispatchIntegrationEvent({ status: 'error', payload: { message } });
        return;
      }
      setSuccess('Contraseña cambiada correctamente. Ya puedes iniciar sesión.');
      dispatchIntegrationEvent({ status: 'success', payload: { changed: true } });
    } catch {
      const message = 'Error de red o servidor.';
      setError(message);
      dispatchIntegrationEvent({ status: 'error', payload: { message } });
    }
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
          </defs>
          <path className="wave slow" stroke="url(#recovery-wave-a)" d="M0,130 C180,110 300,85 520,95 C740,105 900,145 1080,135 C1260,125 1360,100 1440,110" />
        </svg>
      </div>

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

        <h1 id="change-title" className="recovery-title">Cambiar contraseña</h1>
        <p className="recovery-description">Revisa tu correo: ingresa el código y tu nueva contraseña (mínimo 8 caracteres).</p>

        <form className="recovery-form" onSubmit={handleSubmit} noValidate>
          <label className="recovery-label" htmlFor="username">Usuario</label>
          <input className="recovery-field" type="text" id="username" ref={emailRef} value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="tu_usuario" autoComplete="username" required />

          <label className="recovery-label" htmlFor="code">Código</label>
          <input className="recovery-field" type="text" id="code" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="123456" inputMode="numeric" required />

          <label className="recovery-label" htmlFor="newPassword">Nueva contraseña</label>
          <input className="recovery-field" type="password" id="newPassword" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="********" autoComplete="new-password" required />

          <label className="recovery-label" htmlFor="confirmPassword">Confirmar contraseña</label>
          <input className="recovery-field" type="password" id="confirmPassword" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="********" autoComplete="new-password" required />

          {error && (
            <div ref={feedbackRef} className="recovery-feedback error" role="alert" aria-live="assertive" tabIndex={-1}>
              {error}
            </div>
          )}
          {success && (
            <div ref={feedbackRef} className="recovery-feedback success" role="status" aria-live="polite" tabIndex={-1}>
              {success}
            </div>
          )}

          <button className="recovery-btn" type="submit">Cambiar contraseña</button>
        </form>

        <div className="recovery-links">
          <Link href="/recuperacion">Volver a solicitar código</Link>
          <Link href="/login">Volver al inicio de sesión</Link>
        </div>
      </main>
    </div>
  );
}




