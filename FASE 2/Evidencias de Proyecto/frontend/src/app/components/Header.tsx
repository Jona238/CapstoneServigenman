'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b">
      <nav className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <span className="font-semibold">Servigenman</span>
        <div className="flex gap-4">
          <Link href="/">Inicio</Link>
          <Link href="/login">Login</Link>
          <Link href="/inventario">Inventario</Link>
        </div>
      </nav>
    </header>
  );
}
