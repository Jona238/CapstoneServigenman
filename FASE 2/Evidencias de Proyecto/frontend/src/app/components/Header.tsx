'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type HeaderSection = 'inicio' | 'inventario' | 'categorias' | 'presupuesto';

type HeaderProps = {
  active?: HeaderSection;
};

const NAV_ITEMS: Array<{ id: HeaderSection; href: string; label: string }> = [
  { id: 'inicio', href: '/inicio', label: 'Inicio' },
  { id: 'inventario', href: '/inventario', label: 'Inventario' },
  { id: 'categorias', href: '/categorias', label: 'Categorías' },
  { id: 'presupuesto', href: '/presupuesto', label: 'Presupuesto' },
];

const MIN_SCROLL_DELTA = 8;
const HIDE_OFFSET = 80;

export default function Header({ active }: HeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY.current;
      const isScrollingDown = delta > MIN_SCROLL_DELTA;
      const isScrollingUp = delta < -MIN_SCROLL_DELTA;
      const isPastOffset = currentScroll > HIDE_OFFSET;

      if (isScrollingDown && isPastOffset) {
        setIsHidden(true);
      } else if (isScrollingUp || !isPastOffset) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    lastScrollY.current = window.scrollY;
  }, []);

  return (
    <header
      className={`inventory-header${isHidden ? ' inventory-header--hidden' : ''}`}
    >
      <div className="inventory-header__inner">
        <div className="header-bar">
          <h1>Gestión de Inventario - Recursos Internos</h1>
          <div className="header-actions">
            <input type="checkbox" id="themeSwitch" hidden />
            <label
              htmlFor="themeSwitch"
              className="switch"
              aria-label="Cambiar tema claro/oscuro"
            />
            <span id="themeLabel" className="theme-label">
              Claro
            </span>
          </div>
        </div>
        <nav>
          <ul>
            {NAV_ITEMS.map(({ id, href, label }) => (
              <li key={id}>
                <Link href={href} aria-current={active === id ? 'page' : undefined}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
