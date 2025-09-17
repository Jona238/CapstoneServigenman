export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t mt-10">
      <div className="mx-auto max-w-5xl p-4 text-sm text-gray-600">
        Servigenman · {year} · contacto@empresa.cl
      </div>
    </footer>
  );
}
