"use client";

import React from "react";

type Props = {
  seconds: number; // elapsed seconds since 10-minute mark
};

function format(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function MiniIdleTimer({ seconds }: Props) {
  return (
    <div className="fixed bottom-3 right-3 z-50 select-none rounded-full bg-black/75 px-3 py-2 text-[11px] text-white shadow">
      Inactivo +10m: {format(seconds)}
    </div>
  );
}

