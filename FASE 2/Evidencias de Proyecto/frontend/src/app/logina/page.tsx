"use client";

import { useState } from "react";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuario:", usuario, "Password:", password);
    // Aquí iría la lógica de autenticación
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 fixed"
        style={{ backgroundImage: "url('/fondo.jpg')" }}
      />

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/100% z-10" />

      {/* Contenedor principal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                z-20 flex flex-col items-center justify-center 
                px-4 sm:px-6 lg:px-8 w-full max-w-md">
        {/* Nombre de la empresa */}
        <h1 className="text-3xl sm:text-4xl font-bold text-blue mb-8 text-center drop-shadow-lg ">
          ServiGenman
        </h1>

        {/* Caja de login */}
        <div className="w-full bg-[#1b263b]/90 rounded-2xl shadow-xl p-6 sm:p-8 ">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-blue-900 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-blue-900 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-semibold transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
