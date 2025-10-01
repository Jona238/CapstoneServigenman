'use client';
import { useState } from 'react';
import { AnimatedBackground } from '../components/BackAnimado';
import './style.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!username.trim() || !password.trim()) {
      setMsg('Usuario y contraseña son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL!;
      const res = await fetch(`${api}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setMsg('Credenciales incorrectas.');
      } else {
        const data = await res.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        setMsg('Ingreso exitoso.');
        // Opcional: redirige a inventario
        // window.location.href = '/inventario';
      }
    } catch {
      setMsg('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        .login-page-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(1200px 600px at 75% 90%, rgba(42, 209, 255, .10), transparent 60%),
                      radial-gradient(1100px 520px at 20% 10%, rgba(123, 92, 255, .10), transparent 60%),
                      linear-gradient(160deg, #051a2c 0%, #0a2e4a 60%, #0b3e4a 100%);
          z-index: -1;
          pointer-events: none;
        }
      `}</style>

      <div className="login-page-container relative min-h-screen w-full overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0">
          <AnimatedBackground />
        </div>

        {/* Contenido del login */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <section className="rounded-2xl p-8 max-w-md w-full" style={{ backgroundColor: 'rgba(10, 46, 74, 0.85)', border: '1px solid rgba(29, 69, 107, 0.7)' }}>
            <h1 className="text-2xl font-bold mb-6 text-center text-white">Iniciar sesión</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col">
                <span className="font-medium mb-2 text-white">Usuario</span>
                <input
                  className="p-3 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  style={{ backgroundColor: 'var(--field)', border: '1px solid var(--field-b)', color: 'var(--ink)' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                />
              </label>
              <label className="flex flex-col">
                <span className="font-medium mb-2 text-white">Contraseña</span>
                <input
                  type="password"
                  className="p-3 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  style={{ backgroundColor: 'var(--field)', border: '1px solid var(--field-b)', color: 'var(--ink)' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                />
              </label>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? 'Ingresando…' : 'Ingresar'}
              </button>
              {msg && (
                <p className={`text-sm text-center p-3 rounded-lg ${msg.includes('exitoso')
                  ? 'text-green-300 bg-green-500/20 border border-green-500/30'
                  : 'text-red-300 bg-red-500/20 border border-red-500/30'
                  }`}>
                  {msg}
                </p>
              )}
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
