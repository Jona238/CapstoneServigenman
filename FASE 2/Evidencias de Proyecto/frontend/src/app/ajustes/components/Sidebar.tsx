"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/ajustes/perfil", label: "Perfil" },
  { href: "/ajustes/apariencia", label: "Apariencia" },
  { href: "/ajustes/accesibilidad", label: "Accesibilidad" },
  { href: "/ajustes/control-sistema", label: "Control del sistema" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="settings-sidebar">
      <h3 className="settings-sidebar__title">Accesos rápidos</h3>
      <nav>
        <ul>
          {items.map((it) => {
            const active = pathname.startsWith(it.href);
            return (
              <li key={it.href}>
                <Link className={active ? "active" : undefined} href={it.href}>
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
