"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InactivityModal from "@/components/InactivityModal";
import MiniIdleTimer from "@/components/MiniIdleTimer";
import { deleteCookie, getCookie, setCookie } from "./cookies";

const EXP_COOKIE = "session_exp"; // epoch seconds
const AUTH_COOKIE = "auth_ok"; // "1"

function nowEpoch(): number { return Math.floor(Date.now() / 1000); }

function readCloseHours(): number {
  const raw = typeof window !== "undefined" ? window.localStorage.getItem("system.closeHours") : null;
  const v = raw ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(v)) return 2; // default 2h
  return Math.min(24, Math.max(1, v));
}

function readIdleMinutes(): number {
  const raw = typeof window !== "undefined" ? window.localStorage.getItem("system.idleMinutes") : null;
  const v = raw ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(v)) return 30; // default 30m
  return Math.min(60, Math.max(5, v));
}

function writeSessionExpiry(hours: number) {
  const exp = nowEpoch() + hours * 3600;
  setCookie(EXP_COOKIE, String(exp), { maxAgeSeconds: hours * 3600, path: "/" });
}

function getSessionExpiry(): number | null {
  const raw = getCookie(EXP_COOKIE);
  if (!raw) return null;
  const v = parseInt(raw, 10);
  return Number.isFinite(v) ? v : null;
}

function clearSessionCookies() {
  deleteCookie(AUTH_COOKIE);
  deleteCookie(EXP_COOKIE);
}

export default function SessionManager() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [pausedByProcess, setPausedByProcess] = useState(false);
  const [miniVisible, setMiniVisible] = useState(false);
  const [miniElapsed, setMiniElapsed] = useState(0);

  const idleMsRef = useRef<number>(readIdleMinutes() * 60_000);
  const idleTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const processCountRef = useRef<number>(0);

  const lastActivityRef = useRef<number>(nowEpoch());

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      // Inactivity reached -> open modal and start 60s countdown
      setShowModal(true);
      setCountdown(60);
    }, idleMsRef.current);
  }, []);

  const closeHours = useMemo(readCloseHours, []);

  // Ensure there is a session expiry cookie aligned with configured hours
  useEffect(() => {
    const exp = getSessionExpiry();
    if (!exp) {
      writeSessionExpiry(closeHours);
    }
  }, [closeHours]);

  // Set up user-activity tracking for inactivity
  useEffect(() => {
    const activityEvents = ["click", "mousemove", "keydown", "scroll", "touchstart"] as const;
    const onActivity = () => {
      setShowModal(false);
      setMiniVisible(false);
      setMiniElapsed(0);
      lastActivityRef.current = nowEpoch();
      resetIdleTimer();
    };
    activityEvents.forEach((e) => window.addEventListener(e, onActivity));
    resetIdleTimer();
    return () => {
      activityEvents.forEach((e) => window.removeEventListener(e, onActivity));
      if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Listen for process start/stop events to avoid interrupting active processes
  useEffect(() => {
    const onStart = () => { processCountRef.current += 1; setPausedByProcess(true); };
    const onEnd = () => {
      processCountRef.current = Math.max(0, processCountRef.current - 1);
      setPausedByProcess(processCountRef.current > 0);
    };
    window.addEventListener("servigenman:process:start", onStart);
    window.addEventListener("servigenman:process:end", onEnd);
    // Patch fetch to mark in-flight requests as active processes
    const originalFetch = (window as any).fetch.bind(window);
    (window as any).fetch = async (...args: Parameters<typeof fetch>) => {
      onStart();
      try {
        const resp = await originalFetch(...args);
        return resp;
      } finally {
        onEnd();
      }
    };
    return () => {
      window.removeEventListener("servigenman:process:start", onStart);
      window.removeEventListener("servigenman:process:end", onEnd);
      // best effort: restore original fetch if needed (not strictly necessary in SPA lifetime)
    };
  }, []);

  // Modal countdown management
  useEffect(() => {
    if (!showModal) {
      if (countdownTimerRef.current !== null) window.clearInterval(countdownTimerRef.current);
      return;
    }
    if (countdownTimerRef.current !== null) window.clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = window.setInterval(() => {
      // If there are active processes, keep the modal visible but pause countdown
      if (processCountRef.current > 0) return;
      setCountdown((v) => {
        if (v <= 1) {
          // time to logout
          if (countdownTimerRef.current !== null) window.clearInterval(countdownTimerRef.current);
          doLogout("timeout");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => {
      if (countdownTimerRef.current !== null) window.clearInterval(countdownTimerRef.current);
    };
  }, [showModal]);

  // Small bottom-right timer after 10 minutes of inactivity
  useEffect(() => {
    const iv = window.setInterval(() => {
      const idleSec = nowEpoch() - lastActivityRef.current;
      if (idleSec >= 600) {
        setMiniVisible(true);
        setMiniElapsed(idleSec - 600);
      } else {
        setMiniVisible(false);
        setMiniElapsed(0);
      }
    }, 1000);
    return () => { window.clearInterval(iv); };
  }, []);

  // Background checker for session token/expiry cookie
  useEffect(() => {
    const iv = window.setInterval(() => {
      const exp = getSessionExpiry();
      if (!exp) return; // no cookie -> let middleware enforce on route change
      if (nowEpoch() >= exp) {
        doLogout("expired");
      }
    }, 30_000); // check every 30s
    return () => { window.clearInterval(iv); };
  }, []);

  const doLogout = (reason: "timeout" | "expired") => {
    try {
      clearSessionCookies();
    } catch {}
    const q = reason === "timeout" ? "timeout=1" : "expired=1";
    router.push(`/login?${q}`);
  };

  const handleStay = () => {
    setShowModal(false);
    // reset idle config (read latest selected minutes)
    idleMsRef.current = readIdleMinutes() * 60_000;
    resetIdleTimer();
    // also extend session based on configured hours to avoid immediate expiry if near
    writeSessionExpiry(readCloseHours());
  };

  const handleLogoutNow = () => doLogout("timeout");

  return (
    <>
      {showModal && (
        <InactivityModal secondsLeft={countdown} onStay={handleStay} onLogoutNow={handleLogoutNow} paused={pausedByProcess} />
      )}
      {miniVisible && !showModal && <MiniIdleTimer seconds={miniElapsed} />}
    </>
  );
}
