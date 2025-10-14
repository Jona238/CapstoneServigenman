"use client";

import { useState, useEffect, FormEvent } from "react";
import "./styles.css";

export default function AjustesCuentaPanel() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setLoading(false);
      setIsEmpty(false); // Cambia a true para probar estado vacío
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("Cambios guardados correctamente.");
  };

  return (
    <div className="ajustes-shell">
      {/* Breadcrumbs */}
      <nav className="ajustes-breadcrumbs">
        <span>Inicio</span>
        <span>›</span>
        <span>Cuenta</span>
        <span>›</span>
        <strong>Ajustes</strong>
      </nav>

      {/* Encabezado */}
      <header className="ajustes-header">
        <h1>Ajustes de Cuenta</h1>
        <p>Administra tu perfil, seguridad y preferencias de tu cuenta.</p>
      </header>

      {/* Tabs */}
      <div className="ajustes-tabs">
        {["perfil", "seguridad", "preferencias"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setMensaje(null);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <main className="ajustes-content">
        {loading ? (
          <div className="loader">Cargando ajustes...</div>
        ) : isEmpty ? (
          <div className="empty-state">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="Sin datos"
            />
            <p>No hay configuraciones disponibles en esta sección.</p>
          </div>
        ) : (
          <>
            {activeTab === "perfil" && (
              <form className="ajustes-form" onSubmit={handleSubmit}>
                <label>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />

                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />

                {mensaje && <div className="mensaje-exito">{mensaje}</div>}

                <div className="ajustes-actions">
                  <button type="submit" className="btn-guardar">
                    Guardar
                  </button>
                  <button type="button" className="btn-cancelar">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {activeTab === "seguridad" && (
              <div className="ajustes-card">
                <h2>Seguridad</h2>
                <p>
                  Cambia tu contraseña o activa la autenticación en dos pasos
                  (2FA).
                </p>
                <button className="btn-guardar">Actualizar contraseña</button>
              </div>
            )}

            {activeTab === "preferencias" && (
              <div className="ajustes-card">
                <h2>Preferencias</h2>
                <label>Tema</label>
                <select>
                  <option>Oscuro</option>
                  <option>Claro</option>
                  <option>Sistema</option>
                </select>

                <label>Idioma</label>
                <select>
                  <option>Español</option>
                  <option>Inglés</option>
                </select>

                <div className="ajustes-actions">
                  <button className="btn-guardar">Guardar</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
