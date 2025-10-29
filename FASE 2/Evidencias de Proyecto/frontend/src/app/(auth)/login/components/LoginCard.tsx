import Link from "next/link";
import { FormEvent, RefObject, useState } from "react";

import type { LoginSuccess } from "../types";

type LoginCardProps = {
  username: string;
  password: string;
  loading: boolean;
  errorMessage: string | null;
  success: LoginSuccess | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  usernameInputRef?: RefObject<HTMLInputElement | null>;
  feedbackRef?: RefObject<HTMLDivElement | null>;
};

export function LoginCard({
  username,
  password,
  loading,
  errorMessage,
  success,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  usernameInputRef,
  feedbackRef,
}: LoginCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main className="card" role="main" aria-label="Formulario de inicio de sesion">
      <div className="brand">
        <div className="brand-logo" aria-hidden="true" title="Servigenman">
          <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
            <circle cx="23" cy="40" r="8" fill="rgba(255,255,255,.15)" />
            <circle cx="23" cy="40" r="3" fill="#fff" />
            <rect x="31" y="35" width="10" height="10" rx="2" fill="rgba(255,255,255,.2)" />
            <path d="M40 10 L26 30 h9 l-3 14 16-20 h-9 l3-14z" fill="#fff" />
          </svg>
        </div>
        <span>SERVIGENMAN</span>
      </div>

      <h1 className="title">Login</h1>

      <form className="form" id="loginForm" onSubmit={onSubmit} noValidate>
        <div>
          <label className="label" htmlFor="username">
            Usuario
          </label>
          <input
            className="field"
            type="text"
            id="username"
            name="username"
            ref={usernameInputRef}
            placeholder="Nombre de usuario"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Contrasena
          </label>
          <div>
            <input
              className="field"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="********"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
            <div className="row" style={{ marginTop: 6 }}>
              <label htmlFor="togglePassword" style={{ cursor: "pointer" }}>
                <input
                  id="togglePassword"
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword((v) => !v)}
                  style={{ accentColor: "#4b8ef7", marginRight: 6 }}
                />
                {showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <label htmlFor="remember">
            <input type="checkbox" id="remember" style={{ accentColor: "#4b8ef7" }} /> Recordarme
          </label>
          <Link href="/recuperacion">Olvidaste tu contrasena?</Link>
        </div>

        {errorMessage && (
          <div
            ref={feedbackRef}
            className="feedback error"
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
          >
            {errorMessage}
          </div>
        )}

        {success && (
          <div
            ref={feedbackRef}
            className="feedback success"
            role="status"
            aria-live="polite"
            tabIndex={-1}
          >
            <p>{success.message}</p>
            <p>Bienvenido, {success.user.first_name || success.user.username}.</p>
          </div>
        )}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "INGRESANDO..." : "INICIAR SESION"}
        </button>
      </form>

      <p className="integration-note" role="note">
        No incluye integracion HTTP real. Emite evento/handler para que la integracion lo conecte.
      </p>

      <div className="footnote">
        2025 Servigenman - Uso exclusivo del personal autorizado -
        <a href="mailto:soporte@servigenman.cl"> soporte@servigenman.cl</a>
      </div>
    </main>
  );
}
