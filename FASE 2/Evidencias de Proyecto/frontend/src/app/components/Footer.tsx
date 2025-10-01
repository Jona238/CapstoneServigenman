import { AnimatedBackground } from './BackAnimado';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative w-full border-t mt-10 border-slate-700 overflow-hidden min-h-[80px]">
      {/* Background animado */}
      <div className="absolute inset-0">
        <AnimatedBackground />
      </div>

      {/* Contenido del footer */}
      <div className="relative z-10 mx-auto max-w-5xl p-4 text-sm text-black font-medium">
        Servigenman · {year} · contacto@empresa.cl
      </div>
    </footer>
  );
}
