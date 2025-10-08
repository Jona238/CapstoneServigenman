"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

import "./styles.css";

const INTEGRATION_EVENT = "servigenman:passwordRecoveryRequest";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
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
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    setMessage(null);
    setFeedbackType(null);

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      const errorMessage = "Validacion local: por favor ingresa un correo electronico valido.";
      setMessage(errorMessage);
      setFeedbackType("error");
      dispatchIntegrationEvent({
        status: "error",
        payload: { message: errorMessage },
      });
      return;
    }

    dispatchIntegrationEvent({
      status: "pending",
      payload: { email: trimmedEmail },
    });

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      const mockMessage =
        "Solicitud registrada. Si el correo existe enviaremos un enlace de recuperacion en los proximos minutos.";
      setMessage(mockMessage);
      setFeedbackType("success");
      dispatchIntegrationEvent({
        status: "success",
        payload: { email: trimmedEmail, message: mockMessage },
      });
      timerRef.current = null;
    }, 400);
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
            Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena.
          </p>
          {/* 
            Nota: No incluye integración HTTP real.
            Emite evento/handler para que la integración lo conecte.
          */}
        </div>

        <form className="recovery-form" onSubmit={handleSubmit} noValidate>
          <label className="recovery-label" htmlFor="email">
            Correo electronico
          </label>
          <input
            className="recovery-field"
            type="email"
            id="email"
            name="email"
            ref={emailInputRef}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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

          <button className="recovery-btn" type="submit">
            Enviar enlace
          </button>
        </form>

        <div className="recovery-links">
          <Link href="/login">Volver al inicio de sesion</Link>
          <Link href="/recuperacion/validar">Ya tienes un codigo? Validar contrasena</Link>
        </div>

        <div className="recovery-footer">
          Necesitas ayuda? <a href="mailto:soporte@servigenman.cl">soporte@servigenman.cl</a>
        </div>
      </main>
    </div>
  );
}
