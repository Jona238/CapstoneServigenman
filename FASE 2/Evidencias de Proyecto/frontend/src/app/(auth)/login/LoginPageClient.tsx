"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    dispatchIntegrationEvent({
      status: "pending",
      payload: { username: sanitizedUsername },
    });

    if (simulationTimerRef.current !== null) {
      window.clearTimeout(simulationTimerRef.current);
    }

    simulationTimerRef.current = window.setTimeout(() => {
      const isSuccessful = sanitizedPassword.length >= 6;

      if (isSuccessful) {
        const mockSuccess: LoginSuccess = {
          message: "Inicio de sesion simulado correctamente.",
          user: {
            username: sanitizedUsername,
            first_name: "",
            last_name: "",
            email: "",
          },
        };
        setSuccess(mockSuccess);
        dispatchIntegrationEvent({
          status: "success",
          payload: mockSuccess,
        });
      } else {
        const mockError = "Validacion local: la contrasena debe tener al menos 6 caracteres.";
        setErrorMessage(mockError);
        dispatchIntegrationEvent({
          status: "error",
          payload: { message: mockError },
        });
      }

      setLoading(false);
      simulationTimerRef.current = null;
    }, 400);
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
