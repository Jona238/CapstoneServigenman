import React, { useState, useEffect } from "react";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setError("La nueva contraseña debe contener mayúsculas y minúsculas.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La confirmación de la contraseña no coincide.");
      return;
    }

    setError("");
    alert(" Contraseña cambiada correctamente.");
    // Aquí iría tu llamada al backend
  };

  // Animación de rayos
  useEffect(() => {
    const container = document.getElementById("rays");
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let active = 0;
    const MAX_AT_ONCE = 5;
    let run = true;
    let cooldownUntil = 0;

    document.addEventListener("visibilitychange", () => {
      run = !document.hidden;
    });

    function spawnRay() {
      if (!run || active >= MAX_AT_ONCE) return;
      active++;
      const el = document.createElement("span");
      el.className = "ray";

      const w = 6 + Math.random() * 18;
      const x = 6 + Math.random() * 88;
      const rot = (Math.random() - 0.5) * 3.2;
      const dur = 2000 + Math.random() * 3000;

      el.style.setProperty("--w", w + "px");
      el.style.setProperty("--x", x + "%");
      el.style.setProperty("--rot", rot + "deg");
      el.style.setProperty("--dur", dur + "ms");

      el.addEventListener("animationend", (e: any) => {
        if (e.animationName !== "rayLife") return;
        el.remove();
        active--;
        cooldownUntil = Date.now() + 220;
      });

      if (container) {
        container.appendChild(el);
      }
    }

    function loop() {
      if (run && Date.now() >= cooldownUntil) spawnRay();
      setTimeout(loop, 220 + Math.random() * 460);
    }

    loop();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#051a2c] flex items-center justify-center overflow-hidden p-6">
      {/* Ruido */}
      <div className="noise fixed inset-0 pointer-events-none opacity-7 mix-blend-soft-light"></div>

      {/* Fondos animados: ondas */}
      <div className="waves fixed inset-0 pointer-events-none overflow-hidden">
        <svg className="waves-svg absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2ad1ff" />
              <stop offset="100%" stopColor="#6d78ff" />
            </linearGradient>
            <linearGradient id="gB" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6d78ff" />
              <stop offset="100%" stopColor="#2ad1ff" />
            </linearGradient>
          </defs>
          <path className="wave slow" stroke="url(#gA)" d="M0,130 C180,110 300,85 520,95 C740,105 900,145 1080,135 C1260,125 1360,100 1440,110" />
          <path className="wave mid" stroke="url(#gB)" d="M0,450 C220,430 360,410 580,420 C800,430 980,470 1140,460 C1300,450 1380,420 1440,430" />
          <path className="wave" stroke="url(#gA)" d="M0,760 C200,740 340,740 560,740 C780,740 960,770 1120,760 C1280,750 1380,730 1440,740" />
        </svg>
      </div>

      {/* Fondos animados: circuitos */}
      <div className="circuit fixed inset-0 pointer-events-none opacity-20">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="w-full h-full">
          <path className="trace" d="M80 160 H360 L520 260 H780 L980 200 H1320" />
          <circle className="node" cx="360" cy="160" r="3" />
          <circle className="node" cx="520" cy="260" r="3" />
          <circle className="node" cx="980" cy="200" r="3" />
        </svg>
      </div>

      {/* Rayos */}
      <div className="rays fixed inset-0 pointer-events-none" id="rays" />

      {/* Tarjeta de cambio de contraseña */}
      <main className="relative z-10 w-full max-w-md bg-[#0e2b49] border border-[#1d456b] rounded-2xl shadow-2xl p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4 text-[#d9e4ff] font-bold">
          <div className="h-10 w-10 rounded-lg grid place-items-center bg-gradient-to-br from-[#7b5cff] to-[#26c4ff] shadow-lg">
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
              <circle cx="23" cy="40" r="8" fill="rgba(255,255,255,.15)" />
              <circle cx="23" cy="40" r="3" fill="#fff" />
              <rect x="31" y="35" width="10" height="10" rx="2" fill="rgba(255,255,255,.2)" />
              <path d="M40 10 L26 30 h9 l-3 14 16-20 h-9 l3-14z" fill="#fff" />
            </svg>
          </div>
          <span>SERVIGENMAN</span>
        </div>

        <h1 className="text-center text-2xl font-extrabold mb-2">Cambio de Contraseña</h1>
        <p className="text-center text-sm text-[#b9c8e6] mb-4">
          Mínimo 8 caracteres, distingue mayúsculas de minúsculas
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-[#b9c8e6]" htmlFor="currentPassword">
              Contraseña Actual
            </label>
            <input
              className="w-full bg-[#0d2742] border border-[#1a3a5a] text-white rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#3d79c7] focus:ring-2 focus:ring-[#3d79c7]/50"
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="text-xs text-[#b9c8e6]" htmlFor="newPassword">
              Nueva Contraseña
            </label>
            <input
              className="w-full bg-[#0d2742] border border-[#1a3a5a] text-white rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#3d79c7] focus:ring-2 focus:ring-[#3d79c7]/50"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="text-xs text-[#b9c8e6]" htmlFor="confirmPassword">
              Confirmar Nueva Contraseña
            </label>
            <input
              className="w-full bg-[#0d2742] border border-[#1a3a5a] text-white rounded-lg px-3 py-2 mt-1 outline-none focus:border-[#3d79c7] focus:ring-2 focus:ring-[#3d79c7]/50"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-[#6d78ff] to-[#2ad1ff] shadow-lg hover:brightness-110 active:translate-y-[1px] transition"
          >
            Cambiar Contraseña
          </button>

          <div className="text-center text-sm text-[#b9c8e6]">
            <a href="/login" className="hover:underline text-[#cfe0ff]">
              Volver al inicio de sesión
            </a>
          </div>
        </form>

        <div className="mt-6 pt-3 text-center text-xs text-[#8ea8c9] border-t border-white/10">
          © 2025 Servigenman — Uso exclusivo del personal autorizado •
          <a href="mailto:soporte@servigenman.cl" className="ml-1 hover:underline text-[#cfe0ff]">
            soporte@servigenman.cl
          </a>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;


