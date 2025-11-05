"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLowStockThreshold } from "@/hooks/useLowStockThreshold";
import "./styles.css";

export default function AjustesCuentaPanel() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const { threshold: storedLowStockThreshold, setThreshold: persistLowStockThreshold } =
    useLowStockThreshold();
  const [lowStockThreshold, setLowStockThreshold] = useState(storedLowStockThreshold);
  const [mensajePreferencias, setMensajePreferencias] = useState<string | null>(null);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setLoading(false);
      setIsEmpty(false); // Cambia a true para probar estado vacío
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLowStockThreshold(storedLowStockThreshold);
  }, [storedLowStockThreshold]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("Cambios guardados correctamente.");
  };

  const handleLowStockChange = (value: number) => {
    const sanitized = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    setLowStockThreshold(sanitized);
    setMensajePreferencias(null);
  };

  const handleLowStockInput = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number.parseInt(event.target.value, 10);
    handleLowStockChange(Number.isNaN(parsed) ? 0 : parsed);
  };

  const handlePreferenciasSave = () => {
    const sanitized = persistLowStockThreshold(lowStockThreshold);
    setLowStockThreshold(sanitized);
    setMensajePreferencias("Stock mínimo actualizado.");
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
              setMensajePreferencias(null);
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

                <label htmlFor="stockMinimo">Stock mínimo para alertas</label>
                <div className="ajustes-slider-group">
                  <input
                    id="stockMinimo"
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={Math.min(lowStockThreshold, 50)}
                    onChange={handleLowStockInput}
                  />
                  <input
                    type="number"
                    min={0}
                    max={999999}
                    step={1}
                    value={lowStockThreshold}
                    onChange={handleLowStockInput}
                    className="ajustes-slider-value"
                    aria-label="Stock mínimo numérico"
                  />
                </div>
                <p className="ajustes-hint">
                  Ajusta el umbral para resaltar en rojo los recursos con existencias bajas en el
                  inventario y en los resúmenes.
                </p>

                {mensajePreferencias && <div className="mensaje-exito">{mensajePreferencias}</div>}

                <div className="ajustes-actions">
                  <button type="button" className="btn-guardar" onClick={handlePreferenciasSave}>
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
