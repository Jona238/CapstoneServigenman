"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export function SettingsTabs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { href: "/ajustes/perfil", label: t.settings.profile },
    { href: "/ajustes/apariencia", label: t.settings.appearance },
    { href: "/ajustes/accesibilidad", label: t.settings.accessibility },
  ];

  return (
    <section className="settings-section-card">
      <div className="settings-tabs">
        {items.map((it) => {
          const active = pathname.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={active ? "tab active" : "tab"}>
              {it.label}
            </Link>
          );
        })}
      </div>
      <div className="settings-panel">{children}</div>
    </section>
  );
}

