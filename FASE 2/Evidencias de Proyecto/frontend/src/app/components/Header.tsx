'use client';
import Link from 'next/link';
import { AnimatedBackground } from './BackAnimado';

export default function Header() {
  return (
    <header className="relative w-full overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0">
        <AnimatedBackground />
      </div>

      {/* Contenido del header */}
      <nav className="relative z-10 mx-auto max-w-5xl flex items-center justify-between p-4">
        <img src="/logo_servigenman.png" alt="Servigenman" className="h-16 w-auto" />
        <div className="flex gap-4">
          <Link href="/" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200">Inicio</Link>
          <Link href="/login" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200">Login</Link>
          <Link href="/inventario" className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200">Inventario</Link>
        </div>
      </nav>
    </header>
  );
}
