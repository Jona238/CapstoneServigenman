'use client';
import { useState } from 'react';

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
    <section className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col">
          <span>Usuario</span>
          <input className="border p-2 rounded"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span>Contraseña</span>
          <input type="password" className="border p-2 rounded"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
      </form>
    </section>
  );
}
