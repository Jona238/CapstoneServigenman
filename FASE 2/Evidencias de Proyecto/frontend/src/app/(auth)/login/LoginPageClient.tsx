"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatedBackground } from "./components/AnimatedBackground";
import { LoginCard } from "./components/LoginCard";
import { SplashOverlay } from "./components/SplashOverlay";
import { useAnimatedRays } from "./hooks/useAnimatedRays";
import { useBodyClass } from "./hooks/useBodyClass";
import { useSplashSequence } from "./hooks/useSplashSequence";
import { useWaterRippleCleanup } from "./hooks/useWaterRippleCleanup";
import type { LoginSuccess } from "./types";
import "./styles.css";

const INTEGRATION_EVENT = "servigenman:loginAttempt";

export default function LoginPageClient() {
  useBodyClass();
  useAnimatedRays();
  useSplashSequence();
  useWaterRippleCleanup();

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<LoginSuccess | null>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const simulationTimerRef = useRef<number | null>(null);
  const redirectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    usernameInputRef.current?.focus();
    return () => {
      if (simulationTimerRef.current !== null) {
        window.clearTimeout(simulationTimerRef.current);
      }
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const dispatchIntegrationEvent = (detail: Record<string, unknown>) => {
    window.dispatchEvent(
      new CustomEvent(INTEGRATION_EVENT, {
        detail,
      })
    );
  };

  const apiBaseUrl = useMemo(() => {
    const sanitizeBaseUrl = (url: string) => url.replace(/\/+$/, "");
    const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (envUrl) return sanitizeBaseUrl(envUrl);
    if (typeof window !== "undefined") {
      // En local, el backend por defecto suele estar en 8000
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return sanitizeBaseUrl("http://localhost:8000");
      }
      return sanitizeBaseUrl(window.location.origin);
    }
    return "";
  }, []);

  const loginUrl = apiBaseUrl ? `${apiBaseUrl}/api/login/` : "/api/login/";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sanitizedUsername = username.trim();
    const sanitizedPassword = password.trim();

    setSuccess(null);
    setErrorMessage(null);

    if (!sanitizedUsername || !sanitizedPassword) {
      setErrorMessage("Por favor ingresa tu usuario y contrasena.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccess(null);

    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: sanitizedUsername, password: sanitizedPassword }),
      });

      let payload: any = null;
      try { payload = await res.json(); } catch { payload = null; }

      if (!res.ok) {
        const message = (payload && payload.error) || "No pudimos validar tus credenciales.";
        setErrorMessage(message);
        dispatchIntegrationEvent({ status: "error", payload: { message } });
        return;
      }

      const successPayload: LoginSuccess = payload?.message
        ? payload
        : {
            message: "Login successful.",
            user: {
              username: sanitizedUsername,
              first_name: "",
              last_name: "",
              email: "",
            },
          };

      setSuccess(successPayload);
      dispatchIntegrationEvent({ status: "success", payload: successPayload });
      try {
        // Set a frontend cookie so middleware can allow navigation
        document.cookie = "auth_ok=1; path=/; max-age=604800"; // 7 days
      } catch {}
      router.push("/inicio");
    } catch {
      const message = "Error de red o servidor. Intenta nuevamente.";
      setErrorMessage(message);
      dispatchIntegrationEvent({ status: "error", payload: { message } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage || success) {
      feedbackRef.current?.focus();
    }
  }, [errorMessage, success]);

  useEffect(() => {
    if (success) {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = window.setTimeout(() => {
        try { document.cookie = "auth_ok=1; path=/; max-age=604800"; } catch {}
        router.push("/inicio");
        redirectTimerRef.current = null;
      }, 600);
    }
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, [router, success]);

  return (
    <>
      <AnimatedBackground />
      <LoginCard
        username={username}
        password={password}
        loading={loading}
        errorMessage={errorMessage}
        success={success}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        usernameInputRef={usernameInputRef}
        feedbackRef={feedbackRef}
      />
      <SplashOverlay />
    </>
  );
}
