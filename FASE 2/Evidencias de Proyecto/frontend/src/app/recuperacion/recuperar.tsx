"use client";

import { motion } from "framer-motion";

export default function RecuperarContrasena() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
      {/* Fondo animado con ondas */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          initial={{ y: 50 }}
          animate={{ y: [50, 0, 50] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <path
            fill="#0f172a"
            fillOpacity="0.6"
            d="M0,224L40,229.3C80,235,160,245,240,240C320,235,400,213,480,208C560,203,640,213,720,229.3C800,245,880,267,960,272C1040,277,1120,267,1200,250.7C1280,235,1360,213,1400,202.7L1440,192L1440,320L0,320Z"
          ></path>
        </motion.svg>
        <motion.svg
          className="absolute bottom-0 w-full opacity-70"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          initial={{ y: -30 }}
          animate={{ y: [-30, 0, -30] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        >
          <path
            fill="#1e3a8a"
            fillOpacity="0.5"
            d="M0,160L80,165.3C160,171,320,181,480,202.7C640,224,800,256,960,266.7C1120,277,1280,267,1360,261.3L1440,256L1440,320L0,320Z"
          ></path>
        </motion.svg>
      </div>

      {/* Card */}
      <div className="relative z-10 bg-blue-950 bg-opacity-80 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">SERVIGENMAN</h1>
          <h2 className="text-xl font-semibold text-white mt-2">
            Recuperar Contraseña
          </h2>
          <p className="text-blue-300 text-sm mt-2">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-200"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              className="w-full p-3 mt-1 rounded-lg bg-blue-900 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-semibold rounded-lg transition"
          >
            Enviar enlace
          </button>
        </form>

        <div className="text-center mt-4">
          <a
            href="/inicio"
            className="text-sm text-blue-300 hover:text-blue-200 transition"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}