"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

import "./styles.css";

const INTEGRATION_EVENT = "servigenman:passwordRecoveryRequest";

export default function RecuperarContrasena() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
  const [cooldown, setCooldown] = useState(0); // Evita reenvios seguidos del OTP
  const [pending, setPending] = useState(false); // Deshabilita UI mientras se envía
  const emailInputRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("recuperacion-root");
    body.classList.add("recuperacion-body");

    emailInputRef.current?.focus();

    return () => {
      html.classList.remove("recuperacion-root");
      body.classList.remove("recuperacion-body");
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Maneja el contador de cooldown para bloquear el reenvio hasta que expire
    if (cooldown > 0) {
        if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
        }
        timerRef.current = window.setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1 && timerRef.current !== null) {
              window.clearInterval(timerRef.current);
            }
            return Math.max(prev - 1, 0);
          });
        }, 1000);
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [cooldown]);

  useEffect(() => {
    if (message) {
      feedbackRef.current?.focus();
    }
  }, [message]);

  const dispatchIntegrationEvent = (detail: Record<string, unknown>) => {
    window.dispatchEvent(
      new CustomEvent(INTEGRATION_EVENT, {
        detail,
      })
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUser = username.trim();

    setMessage(null);
    setFeedbackType(null);
    setPending(true);

    if (!trimmedUser) {
      const errorMessage = "Por favor ingresa tu usuario.";
      setMessage(errorMessage);
      setFeedbackType("error");
      setPending(false);
      dispatchIntegrationEvent({
        status: "error",
        payload: { message: errorMessage },
      });
      return;
    }

    dispatchIntegrationEvent({ status: "pending", payload: { username: trimmedUser } });

    try {
      const base = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
      const res = await fetch(`${base}/api/password/request/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: trimmedUser }),
      });

      let payload: any = null;
      try { payload = await res.json(); } catch { payload = null; }

      if (!res.ok) {
        const err = (payload && (payload.detail || payload.error)) || 'No se pudo enviar el correo. Verifica la configuracion del servidor.';
        setMessage(err);
        setFeedbackType('error');
        setPending(false);
        dispatchIntegrationEvent({ status: 'error', payload: { username: trimmedUser, message: err } });
        return;
      }

      let text = 'Si el usuario existe y tiene correo asociado, enviaremos un codigo de verificacion.';
      if (payload && payload.code) {
        text += `\n\n(DEV) Tu codigo es: ${payload.code}`;
      }
      // Activa cooldown de reenvio para evitar spam de correos
      setCooldown(payload?.cooldown ?? 60);
      setMessage(text);
      setFeedbackType('success');
      setPending(false);
      dispatchIntegrationEvent({ status: 'success', payload: { username: trimmedUser, message: text } });
    } catch {
      const err = 'No se pudo procesar la solicitud. Intenta nuevamente.';
      setMessage(err);
      setFeedbackType('error');
      setPending(false);
      dispatchIntegrationEvent({ status: 'error', payload: { username: trimmedUser, message: err } });
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
          {/* Ondas múltiples para replicar el patrón punteado del diseño */}
          <path className="wave slow" stroke="url(#recovery-wave-a)" d="M0,110 C200,90 360,80 560,90 C760,100 960,130 1180,120 C1340,115 1420,95 1440,110" />
          <path className="wave mid" stroke="url(#recovery-wave-b)" d="M0,260 C180,240 340,230 560,240 C820,250 980,290 1200,280 C1340,270 1400,250 1440,260" />
          <path className="wave" stroke="url(#recovery-wave-a)" d="M0,470 C220,450 380,430 600,440 C860,450 1020,490 1220,480 C1360,470 1420,450 1440,460" />
          <path className="wave slow" stroke="url(#recovery-wave-b)" d="M0,700 C200,680 360,680 580,690 C820,700 1040,730 1240,720 C1360,710 1420,690 1440,700" />
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

      <main className="recovery-card" aria-labelledby="recovery-title">
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

        <div>
          <h1 id="recovery-title" className="recovery-title">Recuperar Contrasena</h1>
          <p className="recovery-description">
            Ingresa tu correo y te enviaremos un <strong>codigo</strong> para autorizar el cambio de contrasena.
            Luego, introduce ese codigo y tu nueva contrasena en el siguiente paso.
          </p>
          {/* Nota: Integra la llamada HTTP real al backend /api/password/request/ */}
        </div>

        <form className="recovery-form" onSubmit={handleSubmit} noValidate>
          <label className="recovery-label" htmlFor="username">Usuario</label>
          <input
            className="recovery-field"
            type="text"
            id="username"
            name="username"
            ref={emailInputRef}
            placeholder="tu_usuario"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          {message && (
            <div
              ref={feedbackRef}
              className={`recovery-feedback ${feedbackType === "error" ? "error" : "success"}`}
              role={feedbackType === "error" ? "alert" : "status"}
              aria-live={feedbackType === "error" ? "assertive" : "polite"}
              tabIndex={-1}
            >
              {message}
            </div>
          )}

          <button className="recovery-btn" type="submit" disabled={pending || cooldown > 0}>
            {pending ? "Enviando..." : (cooldown > 0 ? `Reenviar en ${cooldown}s` : "Enviar codigo")}
          </button>
        </form>

        <div className="recovery-links">
          <Link href="/login">Volver al inicio de sesion</Link>
          <Link href="/recuperacion/validar">Ya tienes un codigo? Cambiar contrasena</Link>
        </div>

        <div className="recovery-footer">
          Necesitas ayuda? <a href="mailto:soporte@servigenman.cl">soporte@servigenman.cl</a>
        </div>
      </main>
    </div>
  );
}
