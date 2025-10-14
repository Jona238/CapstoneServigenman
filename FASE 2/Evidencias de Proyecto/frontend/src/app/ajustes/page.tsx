"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

type TabId = "perfil" | "apariencia" | "accesibilidad";

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 22;
const FONT_SCALE_BASE = 16;
const DEFAULT_FONT_SIZE = 16;

type PerfilData = {
  nombre: string;
  correo: string;
};

type MensajeState =
  | {
      tipo: "success" | "error";
      texto: string;
    }
  | null;

const EMAIL_REGEX =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

const THEME_STORAGE_KEY = "theme";

export default function AjustesCuentaPage() {
  useBodyClass();

  const [activeTab, setActiveTab] = useState<TabId>("perfil");
  const [perfil, setPerfil] = useState<PerfilData>({
    nombre: "",
    correo: "",
  });
  const [perfilInicial, setPerfilInicial] = useState<PerfilData>({
    nombre: "",
    correo: "",
  });
  const [mensajePerfil, setMensajePerfil] = useState<MensajeState>(null);
  const [mensajeApariencia, setMensajeApariencia] = useState<string | null>(
    null,
  );
  const [mensajeAccesibilidad, setMensajeAccesibilidad] = useState<
    string | null
  >(null);
  const [temaPreferido, setTemaPreferido] = useState("oscuro");
  const [idioma, setIdioma] = useState("es");
  const [estiloInterfaz, setEstiloInterfaz] = useState("compacto");
  const [tamanoFuente, setTamanoFuente] = useState<number>(DEFAULT_FONT_SIZE);
  const [altoContraste, setAltoContraste] = useState(false);
  const [lecturaEnVozAlta, setLecturaEnVozAlta] = useState(false);
  const [animacionesReducidas, setAnimacionesReducidas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const layoutClass = "inventory-layout";
    document.body.classList.add(layoutClass);
    return () => {
      document.body.classList.remove(layoutClass);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setIsDarkTheme(window.localStorage.getItem(THEME_STORAGE_KEY) === "dark");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }
    if (isDarkTheme) {
      document.body.setAttribute("data-theme", "dark");
      window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } else {
      document.body.removeAttribute("data-theme");
      window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    }
  }, [isDarkTheme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncTheme = () => {
      setIsDarkTheme(window.localStorage.getItem(THEME_STORAGE_KEY) === "dark");
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener("focus", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("focus", syncTheme);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const datosPerfil = {
        nombre: "Admin Servigenman",
        correo: "admin@servigenman.com",
      };

      setPerfil(datosPerfil);
      setPerfilInicial(datosPerfil);
      setTemaPreferido("oscuro");
      setIdioma("es");
      setEstiloInterfaz("amplio");
      setTamanoFuente(DEFAULT_FONT_SIZE);
      setAltoContraste(false);
      setLecturaEnVozAlta(false);
      setAnimacionesReducidas(true);
      setIsDarkTheme(true);
      setLoading(false);
      setIsEmpty(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const root = document.documentElement;
    const body = document.body;
    const clampedSize = Math.min(
      FONT_SIZE_MAX,
      Math.max(FONT_SIZE_MIN, tamanoFuente),
    );
    const scale = (clampedSize / FONT_SCALE_BASE).toFixed(2);
    root.style.setProperty("--settings-font-scale", scale);
    root.style.setProperty("--settings-font-size-value", `${clampedSize}px`);
    if (body) {
      body.setAttribute("data-font-scale", clampedSize.toString());
    }
  }, [tamanoFuente]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    return () => {
      const root = document.documentElement;
      const body = document.body;
      root.style.setProperty(
        "--settings-font-scale",
        (DEFAULT_FONT_SIZE / FONT_SCALE_BASE).toFixed(2),
      );
      root.style.setProperty(
        "--settings-font-size-value",
        `${DEFAULT_FONT_SIZE}px`,
      );
      if (body) {
        body.removeAttribute("data-font-scale");
      }
    };
  }, []);

  const handlePerfilSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMensajePerfil(null);

    if (!perfil.nombre.trim() || !perfil.correo.trim()) {
      setMensajePerfil({
        tipo: "error",
        texto: "Completa todos los campos antes de guardar.",
      });
      return;
    }

    if (!EMAIL_REGEX.test(perfil.correo)) {
      setMensajePerfil({
        tipo: "error",
        texto: "Ingresa un correo electronico valido.",
      });
      return;
    }

    setPerfilInicial(perfil);
    setMensajePerfil({
      tipo: "success",
      texto: "Cambios guardados correctamente.",
    });
  };

  const handlePerfilCancel = () => {
    setPerfil(perfilInicial);
    setMensajePerfil(null);
  };

  const handleAparienciaSubmit = () => {
    setMensajeApariencia("Preferencias de apariencia actualizadas.");
    window.setTimeout(() => setMensajeApariencia(null), 3500);
  };

  const handleAccesibilidadSubmit = () => {
    setMensajeAccesibilidad("Preferencias de accesibilidad guardadas.");
    window.setTimeout(() => setMensajeAccesibilidad(null), 3500);
  };

  const handleThemeToggle = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      setTemaPreferido(next ? "oscuro" : "claro");
      return next;
    });
  };

  return (
    <>
      <AnimatedBackground />
      <div className="ajustes-page">
        <header className="inventory-header">
          <div className="inventory-header__inner">
            <div className="header-bar">
              <h1>Gestion de Inventario - Recursos Internos</h1>
              <div className="header-actions">
                <input
                  type="checkbox"
                  id="themeSwitch"
                  hidden
                  checked={isDarkTheme}
                  onChange={handleThemeToggle}
                />
                <label
                  htmlFor="themeSwitch"
                  className="switch"
                  aria-label="Cambiar tema claro/oscuro"
                />
                <span className="theme-label">
                  {isDarkTheme ? "Oscuro" : "Claro"}
                </span>
              </div>
            </div>
            <nav>
              <ul>
                <li>
                  <Link href="/inicio">Inicio</Link>
                </li>
                <li>
                  <Link href="/inventario">Inventario</Link>
                </li>
                <li>
                  <Link href="/categorias">Categorias</Link>
                </li>
                <li>
                  <Link href="/presupuesto">Presupuesto</Link>
                </li>
                <li>
                  <Link href="/ajustes" aria-current="page">
                    Ajustes
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="inventory-shell ajustes-shell">
          <main className="ajustes-main">
            <section className="ajustes-hero">
              <nav
                className="ajustes-breadcrumbs"
                aria-label="Ruta de navegacion"
              >
                <Link href="/inicio">Inicio</Link>
                <span className="separator" aria-hidden>
                  &gt;
                </span>
                <span>Cuenta</span>
                <span className="separator" aria-hidden>
                  &gt;
                </span>
                <strong>Ajustes</strong>
              </nav>

              <header className="ajustes-header">
                <h2>Centro de ajustes</h2>
                <p>
                  Administra tu perfil como responsable de Servigenman y ajusta
                  la apariencia y accesibilidad de la plataforma.
                </p>
              </header>
            </section>

            <section className="ajustes-surface">
              <div className="ajustes-tabs" role="tablist">
                {(["perfil", "apariencia", "accesibilidad"] as TabId[]).map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === tab}
                      className={`tab ${activeTab === tab ? "active" : ""}`}
                      onClick={() => {
                        setActiveTab(tab);
                        setMensajePerfil(null);
                        setMensajeApariencia(null);
                        setMensajeAccesibilidad(null);
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ),
                )}
              </div>

              <div className="ajustes-content">
                {loading ? (
                  <div className="loader" role="status">
                    Cargando ajustes...
                  </div>
                ) : isEmpty ? (
                  <div className="empty-state" role="status">
                    <Image
                      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                      alt="Sin datos"
                      width={128}
                      height={128}
                      priority
                    />
                    <p>No hay configuraciones disponibles en esta seccion.</p>
                  </div>
                ) : (
                  <>
                    {activeTab === "perfil" && (
                      <form
                        className="ajustes-form"
                        onSubmit={handlePerfilSubmit}
                        aria-label="Formulario de perfil"
                      >
                        <div className="form-row">
                          <label htmlFor="nombre">Nombre completo</label>
                          <input
                            id="nombre"
                            type="text"
                            autoComplete="name"
                            placeholder="Tu nombre"
                            value={perfil.nombre}
                            onChange={(event) =>
                              setPerfil((prev) => ({
                                ...prev,
                                nombre: event.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="form-row">
                          <label htmlFor="correo">Correo electronico</label>
                          <input
                            id="correo"
                            type="email"
                            autoComplete="email"
                            placeholder="ejemplo@correo.com"
                            value={perfil.correo}
                            onChange={(event) =>
                              setPerfil((prev) => ({
                                ...prev,
                                correo: event.target.value,
                              }))
                            }
                          />
                        </div>

                        {mensajePerfil && (
                          <div
                            className={`ajustes-feedback ${mensajePerfil.tipo}`}
                          >
                            {mensajePerfil.texto}
                          </div>
                        )}

                        <div className="ajustes-actions">
                          <button type="submit" className="btn-guardar">
                            Guardar cambios
                          </button>
                          <button
                            type="button"
                            className="btn-cancelar"
                            onClick={handlePerfilCancel}
                          >
                            Deshacer
                          </button>
                        </div>
                      </form>
                    )}

                    {activeTab === "apariencia" && (
                      <section
                        className="ajustes-card"
                        aria-label="Preferencias de apariencia"
                      >
                        <h3>Apariencia del panel</h3>
                        <p>
                          Personaliza el tema y la densidad con la que trabajas
                          en la consola administrativa de Servigenman.
                        </p>

                        <div className="form-grid">
                          <div className="form-row">
                            <label htmlFor="tema">Tema de la interfaz</label>
                            <select
                              id="tema"
                              value={temaPreferido}
                              onChange={(event) => {
                                const value = event.target.value;
                                setTemaPreferido(value);
                                if (value === "oscuro") {
                                  setIsDarkTheme(true);
                                } else if (value === "claro") {
                                  setIsDarkTheme(false);
                                }
                              }}
                            >
                              <option value="oscuro">Oscuro</option>
                              <option value="claro">Claro</option>
                              <option value="sistema">Segun el sistema</option>
                            </select>
                          </div>

                          <div className="form-row">
                            <label htmlFor="idioma">Idioma base</label>
                            <select
                              id="idioma"
                              value={idioma}
                              onChange={(event) =>
                                setIdioma(event.target.value)
                              }
                            >
                              <option value="es">Espanol (ES)</option>
                              <option value="en">Ingles (EN)</option>
                            </select>
                          </div>

                          <div className="form-row">
                            <label htmlFor="estiloInterfaz">
                              Estilo de la interfaz
                            </label>
                            <select
                              id="estiloInterfaz"
                              value={estiloInterfaz}
                              onChange={(event) =>
                                setEstiloInterfaz(event.target.value)
                              }
                            >
                              <option value="compacto">Compacto</option>
                              <option value="amplio">Amplio</option>
                              <option value="fluido">Fluido</option>
                            </select>
                          </div>

                          <div className="form-row range-control">
                            <label htmlFor="tamanoFuente">
                              Tamano de letra
                              <span className="range-value">
                                {tamanoFuente} px
                              </span>
                            </label>
                            <input
                              id="tamanoFuente"
                              type="range"
                              min={FONT_SIZE_MIN}
                              max={FONT_SIZE_MAX}
                              value={tamanoFuente}
                              onChange={(event) =>
                                setTamanoFuente(Number(event.target.value))
                              }
                            />
                            <div className="range-scale" aria-hidden>
                              <span>{FONT_SIZE_MIN}px</span>
                              <span>{FONT_SIZE_MAX}px</span>
                            </div>
                          </div>
                        </div>

                        {mensajeApariencia && (
                          <div className="ajustes-feedback success">
                            {mensajeApariencia}
                          </div>
                        )}

                        <div className="ajustes-actions">
                          <button
                            type="button"
                            className="btn-guardar"
                            onClick={handleAparienciaSubmit}
                          >
                            Guardar apariencia
                          </button>
                        </div>
                      </section>
                    )}

                    {activeTab === "accesibilidad" && (
                      <section
                        className="ajustes-card"
                        aria-label="Preferencias de accesibilidad"
                      >
                        <h3>Accesibilidad</h3>
                        <p>
                          Mejora la legibilidad y activa ayudas para facilitar
                          el uso diario.
                        </p>

                        <div className="preferencias-alertas">
                          <label className="toggle compact">
                            <input
                              type="checkbox"
                              checked={altoContraste}
                              onChange={(event) =>
                                setAltoContraste(event.target.checked)
                              }
                            />
                            <span className="toggle-slider" aria-hidden />
                            <span className="toggle-label">
                              Activar contraste alto
                            </span>
                          </label>

                          <label className="toggle compact">
                            <input
                              type="checkbox"
                              checked={lecturaEnVozAlta}
                              onChange={(event) =>
                                setLecturaEnVozAlta(event.target.checked)
                              }
                            />
                            <span className="toggle-slider" aria-hidden />
                            <span className="toggle-label">
                              Habilitar lectura en voz
                            </span>
                          </label>

                          <label className="toggle compact">
                            <input
                              type="checkbox"
                              checked={animacionesReducidas}
                              onChange={(event) =>
                                setAnimacionesReducidas(event.target.checked)
                              }
                            />
                            <span className="toggle-slider" aria-hidden />
                            <span className="toggle-label">
                              Reducir animaciones
                            </span>
                          </label>
                        </div>

                        {mensajeAccesibilidad && (
                          <div className="ajustes-feedback success">
                            {mensajeAccesibilidad}
                          </div>
                        )}

                        <div className="ajustes-actions">
                          <button
                            type="button"
                            className="btn-guardar"
                            onClick={handleAccesibilidadSubmit}
                          >
                            Guardar accesibilidad
                          </button>
                        </div>
                      </section>
                    )}
                  </>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
