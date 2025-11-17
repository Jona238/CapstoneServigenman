"use client";

import React from "react";

type Props = {
  secondsLeft: number;
  onStay: () => void;
  onLogoutNow: () => void;
  paused?: boolean;
};

export default function InactivityModal({ secondsLeft, onStay, onLogoutNow, paused }: Props) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="idle-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[92%] max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 id="idle-title" className="mb-2 text-lg font-semibold text-gray-900">
          ¿Sigues en la página?
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          {paused
            ? "Hay procesos activos en curso. Pausamos el cierre automático."
            : "Por seguridad, cerraremos tu sesión por inactividad."}
        </p>
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-sm text-gray-500">Cierre en</span>
          <span className="text-2xl font-bold text-gray-900" aria-live="polite">{secondsLeft}s</span>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onStay} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50">
            Seguir aquí
          </button>
          <button onClick={onLogoutNow} className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Cerrar sesión ahora
          </button>
        </div>
      </div>
    </div>
  );
}

