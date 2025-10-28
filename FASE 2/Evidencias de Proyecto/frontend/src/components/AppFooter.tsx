"use client";

export default function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="inventory-footer">
      <p>
        © {year} Servigenman — Uso exclusivo del personal autorizado ·
        <a href="mailto:soporte@servigenman.cl"> soporte@servigenman.cl</a>
      </p>
    </footer>
  );
}

