"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  message: string;
  variant?: "info" | "warning";
  autoHideMs?: number;
};

export default function LoginNotice({ message, variant = "info", autoHideMs = 60000 }: Props) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = window.setTimeout(() => setVisible(false), autoHideMs);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [autoHideMs, visible]);

  if (!visible) return null;

  const cls =
    variant === "warning"
      ? "bg-yellow-100 text-yellow-900 border-yellow-300"
      : "bg-blue-100 text-blue-900 border-blue-300";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-3 left-1/2 z-50 -translate-x-1/2 rounded border px-4 py-2 shadow ${cls}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm">{message}</span>
        <button
          aria-label="Cerrar aviso"
          onClick={() => setVisible(false)}
          className="rounded px-2 py-1 text-xs hover:bg-black/5"
        >
          ×
        </button>
      </div>
    </div>
  );
}

