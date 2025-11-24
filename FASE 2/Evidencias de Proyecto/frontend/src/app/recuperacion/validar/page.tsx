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
  const [pending, setPending] = useState(false); // Bloquea UI durante verificacion + cambio
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
      const message = "La nueva contrasena debe tener al menos 8 caracteres.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }
    if (newPassword !== confirmPassword) {
      const message = "Las contrasenas no coinciden.";
      setError(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
      return;
    }

    setPending(true);
    dispatchIntegrationEvent({ status: "pending", payload: { username } });
    const base = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

    try {
      // Paso 1: validar codigo sin consumirlo (backend retorna error si expiro)
      const verifyRes = await fetch(`${base}/api/password/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username.trim(), code: code.trim() }),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok || verifyData?.error) {
        const message = verifyData?.error || 'Codigo invalido o expirado.';
        setError(message);
        setPending(false);
        dispatchIntegrationEvent({ status: 'error', payload: { message } });
        return;
      }

      // Paso 2: aplicar cambio de contrasena (consume el codigo)
      const res = await fetch(`${base}/api/password/reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username.trim(), code: code.trim(), new_password: newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        const message = data?.error || 'No fue posible cambiar la contrasena.';
        setError(message);
        setPending(false);
        dispatchIntegrationEvent({ status: 'error', payload: { message } });
        return;
      }
      setSuccess('Contrasena cambiada correctamente. Ya puedes iniciar sesion.');
      setPending(false);
      dispatchIntegrationEvent({ status: 'success', payload: { changed: true, auth0_synced: data?.auth0_synced } });
    } catch {
      const message = 'Error de red o servidor.';
      setError(message);
      setPending(false);
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
            <linearGradient id="recovery-wave-b" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6d78ff" />
              <stop offset="100%" stopColor="#2ad1ff" />
            </linearGradient>
          </defs>
          {/* Ondas múltiples para cubrir todo el alto visible como en el mock */}
          <path className="wave slow" stroke="url(#recovery-wave-a)" d="M0,110 C200,90 360,80 560,90 C760,100 960,130 1180,120 C1340,115 1420,95 1440,110" />
          <path className="wave mid" stroke="url(#recovery-wave-b)" d="M0,260 C180,240 340,230 560,240 C820,250 980,290 1200,280 C1340,270 1400,250 1440,260" />
          <path className="wave" stroke="url(#recovery-wave-a)" d="M0,470 C220,450 380,430 600,440 C860,450 1020,490 1220,480 C1360,470 1420,450 1440,460" />
          <path className="wave slow" stroke="url(#recovery-wave-b)" d="M0,700 C200,680 360,680 580,690 C820,700 1040,730 1240,720 C1360,710 1420,690 1440,700" />
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

        <h1 id="change-title" className="recovery-title">Cambiar contrasena</h1>
        <p className="recovery-description">
          Revisa tu correo: ingresa el codigo y tu nueva contrasena (minimo 8 caracteres).
        </p>

        <form className="recovery-form" onSubmit={handleSubmit} noValidate>
          <label className="recovery-label" htmlFor="username">Usuario</label>
          <input className="recovery-field" type="text" id="username" ref={emailRef} value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="tu_usuario" autoComplete="username" required />

          <label className="recovery-label" htmlFor="code">Codigo</label>
          <input className="recovery-field" type="text" id="code" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="123456" inputMode="numeric" required />

          <label className="recovery-label" htmlFor="newPassword">Nueva contrasena</label>
          <input className="recovery-field" type="password" id="newPassword" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="********" autoComplete="new-password" required />

          <label className="recovery-label" htmlFor="confirmPassword">Confirmar contrasena</label>
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

          <button className="recovery-btn" type="submit" disabled={pending}>
            {pending ? "Validando codigo..." : "Cambiar contrasena"}
          </button>
        </form>

        <div className="recovery-links">
          <Link href="/recuperacion">Volver a solicitar codigo</Link>
          <Link href="/login">Volver al inicio de sesion</Link>
        </div>
      </main>
    </div>
  );
}
