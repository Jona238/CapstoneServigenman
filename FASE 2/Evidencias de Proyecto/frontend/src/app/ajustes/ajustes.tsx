"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLowStockThreshold } from "@/hooks/useLowStockThreshold";
import "./styles.css";

export default function AjustesCuentaPanel() {
  const { t } = useLanguage();
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
    setMensaje(t.settings.changesSaved);
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
    setMensajePreferencias(t.settingsPages.minimumStockUpdated);
  };

  return (
    <div className="ajustes-shell">
      {/* Breadcrumbs */}
      <nav className="ajustes-breadcrumbs">
        <span>{t.common.home}</span>
        <span>›</span>
        <span>{t.settingsPages.accountSettings}</span>
        <span>›</span>
        <strong>{t.common.settings}</strong>
      </nav>

      {/* Encabezado */}
      <header className="ajustes-header">
        <h1>{t.settingsPages.accountSettings}</h1>
        <p>{t.settingsPages.manageProfile}</p>
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
          <div className="loader">{t.settingsPages.loadingSettings}</div>
        ) : isEmpty ? (
          <div className="empty-state">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt={t.settingsPages.noData}
            />
            <p>{t.settingsPages.noConfigurations}</p>
          </div>
        ) : (
          <>
            {activeTab === "perfil" && (
              <form className="ajustes-form" onSubmit={handleSubmit}>
                <label>{t.settings.fullName}</label>
                <input
                  type="text"
                  placeholder={t.settings.yourName}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />

                <label>{t.settings.emailAddress}</label>
                <input
                  type="email"
                  placeholder={t.settings.emailPlaceholder}
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />

                {mensaje && <div className="mensaje-exito">{mensaje}</div>}

                <div className="ajustes-actions">
                  <button type="submit" className="btn-guardar">
                    {t.common.save}
                  </button>
                  <button type="button" className="btn-cancelar">
                    {t.common.cancel}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "seguridad" && (
              <div className="ajustes-card">
                <h2>{t.settingsPages.security}</h2>
                <p>
                  {t.settingsPages.securityDescription}
                </p>
                <button className="btn-guardar">{t.settingsPages.updatePassword}</button>
              </div>
            )}

            {activeTab === "preferencias" && (
              <div className="ajustes-card">
                <h2>{t.settingsPages.preferences}</h2>
                <label>{t.appearance.theme}</label>
                <select>
                  <option>{t.appearance.dark}</option>
                  <option>{t.appearance.light}</option>
                  <option>{t.appearance.system}</option>
                </select>

                <label>{t.common.language}</label>
                <select>
                  <option>{t.common.spanish}</option>
                  <option>{t.common.english}</option>
                </select>

                <label htmlFor="stockMinimo">{t.settingsPages.minimumStockAlerts}</label>
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
                    aria-label={t.settingsPages.minimumStockAlerts}
                  />
                </div>
                <p className="ajustes-hint">
                  {t.settingsPages.adjustThreshold}
                </p>

                {mensajePreferencias && <div className="mensaje-exito">{mensajePreferencias}</div>}

                <div className="ajustes-actions">
                  <button type="button" className="btn-guardar" onClick={handlePreferenciasSave}>
                    {t.common.save}
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
