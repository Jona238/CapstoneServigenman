"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  apiListItems,
  apiCreateItem,
  apiCreateMovement,
  apiListMovements,
  InventoryItem,
  InventoryMovement,
} from "../inventario/movementsApi";
import "../inventario/styles.css";

type TabKey = "IN" | "OUT";

type ItemOption = {
  id: number;
  name: string;
  stock: number;
};

export default function MovementsPage() {
  const [tab, setTab] = useState<TabKey>("IN");

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [info, setInfo] = useState("");
  const [distribuidor, setDistribuidor] = useState("");
  const [ubicacionTexto, setUbicacionTexto] = useState("");
  const [ubicacionFiles, setUbicacionFiles] = useState<File[]>([]);
  const [comment, setComment] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);

  const [salidaRecursoNombre, setSalidaRecursoNombre] = useState("");
  const [salidaCategoria, setSalidaCategoria] = useState("");
  const [salidaDistribuidor, setSalidaDistribuidor] = useState("");
  const [salidaPrecio, setSalidaPrecio] = useState<number | null>(null);
  const [salidaUbicacionTexto, setSalidaUbicacionTexto] = useState("");
  const [salidaUbicacionFotosCount, setSalidaUbicacionFotosCount] = useState(0);
  const [salidaFoto, setSalidaFoto] = useState<string | null>(null);
  const [salidaCantidad, setSalidaCantidad] = useState("");
  const [salidaComentario, setSalidaComentario] = useState("");
  const [isSalidaPhotoModalOpen, setIsSalidaPhotoModalOpen] = useState(false);

  const selectedItem = useMemo(
    () => items.find((it) => it.id === selectedItemId) || null,
    [items, selectedItemId]
  );

  useEffect(() => {
    void loadItems();
    void loadCategorySuggestions();
  }, []);

  useEffect(() => {
    void loadMovements();
  }, [items.length]);

  async function loadItems() {
    const data = await apiListItems();
    if (!data) return;
    setInventoryItems(data);
    const mapped = data.map((it) => ({
      id: it.id,
      name: it.recurso,
      stock: it.cantidad,
    }));
    setItems(mapped);
  }

  async function loadMovements() {
    const data = await apiListMovements();
    if (!data) return;
    setMovements(data.slice(0, 20));
  }

  async function loadCategorySuggestions() {
    try {
      const base =
        (typeof process !== "undefined" &&
          (process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL)) ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const res = await fetch(`${base.replace(/\/$/, "")}/api/inventory/categories/summary/`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data = (await res.json()) as Array<{ name?: string }>;
      if (!Array.isArray(data)) return;
      const names = Array.from(
        new Set(
          data
            .map((c) => (c?.name || "").trim())
            .filter((name) => Boolean(name))
        )
      ).sort((a, b) => a.localeCompare(b, "es"));
      setCategorySuggestions(names);
    } catch {
      /* ignore */
    }
  }

  function resetForm() {
    setName("");
    setCategory("");
    setQuantity("");
    setPrice("");
    setPhotoFile(null);
    setInfo("");
    setDistribuidor("");
    setUbicacionTexto("");
    setUbicacionFiles([]);
    setComment("");
    setError("");
    setSelectedItemId(null);
    setSalidaRecursoNombre("");
    setSalidaCategoria("");
    setSalidaDistribuidor("");
    setSalidaPrecio(null);
    setSalidaUbicacionTexto("");
    setSalidaUbicacionFotosCount(0);
    setSalidaFoto(null);
    setSalidaCantidad("");
    setSalidaComentario("");
    setIsSalidaPhotoModalOpen(false);
  }

  function validateInputs(): boolean {
    if (tab === "IN") {
      if (!name.trim() || !category.trim()) {
        setError("Nombre y categoria son obligatorios.");
        return false;
      }
    } else {
      if (!selectedItemId) {
        setError("Selecciona un recurso.");
        return false;
      }
    }

    const qty =
      tab === "IN"
        ? typeof quantity === "number"
          ? quantity
          : Number(quantity)
        : Number(salidaCantidad);
    if (!qty || qty <= 0) {
      setError("La cantidad debe ser mayor a 0.");
      return false;
    }

    if (tab === "OUT" && selectedItem && qty > selectedItem.stock) {
      setError(`No hay stock suficiente (stock: ${selectedItem.stock}).`);
      return false;
    }

    setError("");
    return true;
  }

  async function handleSubmit() {
    setSuccess("");
    if (!validateInputs()) return;

    setLoading(true);
    const qty =
      tab === "IN"
        ? typeof quantity === "number"
          ? quantity
          : Number(quantity)
        : Number(salidaCantidad);
    let targetItemId = selectedItemId;

    if (tab === "IN") {
      const fotoDataURL = photoFile ? await readFileAsDataURL(photoFile) : "";
      const ubicacionFotosBase64: string[] = [];
      for (const f of ubicacionFiles) {
        const base64 = await readFileAsDataURL(f);
        ubicacionFotosBase64.push(base64);
      }
      const created = await apiCreateItem({
        recurso: name.trim(),
        categoria: category.trim(),
        cantidad: 0,
        precio: typeof price === "number" ? price : Number(price) || 0,
        foto: fotoDataURL,
        info: info.trim(),
        distribuidor: distribuidor.trim() || undefined,
        ubicacion_texto: ubicacionTexto.trim() || undefined,
        ubicacion_fotos: ubicacionFotosBase64,
      });
      targetItemId = created?.id ?? null;
      if (!targetItemId) {
        setLoading(false);
        setError("No se pudo crear el recurso.");
        return;
      }
    }

    const ok = await apiCreateMovement({
      item: targetItemId as number,
      movement_type: tab,
      quantity: qty,
      comment:
        tab === "IN"
          ? comment.trim() || undefined
          : salidaComentario.trim() || undefined,
    });
    setLoading(false);

    if (!ok) {
      setError("No se pudo registrar el movimiento.");
      return;
    }

    const catTrimmed = category.trim();
    if (catTrimmed) {
      setCategorySuggestions((prev) => {
        if (prev.includes(catTrimmed)) return prev;
        return [...prev, catTrimmed].sort((a, b) => a.localeCompare(b, "es"));
      });
    }

    setSuccess(tab === "IN" ? "Entrada registrada." : "Salida registrada.");
    resetForm();
    await loadItems();
    await loadMovements();
  }

  function handleSalidaRecursoChange(value: string) {
    setSalidaRecursoNombre(value);

    if (!value) {
      setSelectedItemId(null);
      setSalidaCategoria("");
      setSalidaDistribuidor("");
      setSalidaPrecio(null);
      setSalidaUbicacionTexto("");
      setSalidaUbicacionFotosCount(0);
      setSalidaFoto(null);
      return;
    }

    const item = inventoryItems.find((it) => it.recurso?.toLowerCase() === value.toLowerCase());

    if (!item) {
      setSelectedItemId(null);
      return;
    }

    setSelectedItemId(item.id);
    setSalidaCategoria(item.categoria || "");
    setSalidaDistribuidor(item.distribuidor || "");
    setSalidaPrecio(typeof item.precio === "number" ? item.precio : null);
    setSalidaUbicacionTexto(item.ubicacion_texto || "");
    setSalidaUbicacionFotosCount(Array.isArray(item.ubicacion_fotos) ? item.ubicacion_fotos.length : 0);
    setSalidaFoto(item.foto || null);
  }

  function handleSalidaCategoriaChange(value: string) {
    setSalidaCategoria(value);
    if (!value) {
      return;
    }

    const currentItem =
      inventoryItems.find((it) => it.id === selectedItemId) ||
      inventoryItems.find((it) => it.recurso?.toLowerCase() === salidaRecursoNombre.toLowerCase());

    if (currentItem && currentItem.categoria !== value) {
      setSelectedItemId(null);
      setSalidaRecursoNombre("");
      setSalidaDistribuidor("");
      setSalidaPrecio(null);
      setSalidaUbicacionTexto("");
      setSalidaUbicacionFotosCount(0);
      setSalidaFoto(null);
    }
  }

  function handleClearSalida() {
    setSalidaRecursoNombre("");
    setSalidaCategoria("");
    setSalidaDistribuidor("");
    setSalidaPrecio(null);
    setSalidaUbicacionTexto("");
    setSalidaUbicacionFotosCount(0);
    setSalidaFoto(null);
    setSalidaCantidad("");
    setSalidaComentario("");
    setSelectedItemId(null);
    setIsSalidaPhotoModalOpen(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
  }

  function handleTabChange(next: TabKey) {
    setTab(next);
    setError("");
    setSuccess("");
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const opts: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString(undefined, opts);
  }

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function commentPreview(text?: string) {
    if (!text) return null;
    if (text.length <= 25) return text;
    return `${text.slice(0, 25)}...`;
  }

  const filteredSalidaResources = inventoryItems.filter(
    (item) => !salidaCategoria || item.categoria === salidaCategoria
  );

  const salidaSelectedItem =
    (selectedItemId ? inventoryItems.find((it) => it.id === selectedItemId) : null) ||
    inventoryItems.find((it) => it.recurso?.toLowerCase() === salidaRecursoNombre.toLowerCase());

  const salidaUbicacionFotos =
    Array.isArray(salidaSelectedItem?.ubicacion_fotos) && salidaSelectedItem?.ubicacion_fotos.length
      ? (salidaSelectedItem?.ubicacion_fotos as string[])
      : [];

  const salidaFotoPortada = salidaSelectedItem?.foto || salidaFoto || null;

  function handleOpenSalidaPhotoModal() {
    if (!salidaFotoPortada) return;
    setIsSalidaPhotoModalOpen(true);
  }

  function handleCloseSalidaPhotoModal() {
    setIsSalidaPhotoModalOpen(false);
  }

  const showSalidaDetails =
    !!salidaSelectedItem ||
    !!salidaDistribuidor ||
    typeof salidaPrecio === "number" ||
    !!salidaUbicacionTexto ||
    (Array.isArray(salidaUbicacionFotos) && salidaUbicacionFotos.length > 0) ||
    !!salidaFotoPortada;

  return (
    <div className="inventory-page">
      <AppHeader />
      <div className="inventory-shell">
        <main className="inventory-main">
          <section className="inventory-card">
            <div className="inventory-card__heading">
              <h2>Movimientos de inventario</h2>
              <p>Registrar entradas y salidas de recursos.</p>
            </div>

            <div className="inventory-section">
              <div className="tabs">
                <button
                  type="button"
                  className={`tab-btn ${tab === "IN" ? "active" : ""}`}
                  onClick={() => handleTabChange("IN")}
                >
                  Entrada de recursos
                </button>
                <button
                  type="button"
                  className={`tab-btn ${tab === "OUT" ? "active" : ""}`}
                  onClick={() => handleTabChange("OUT")}
                >
                  Salida de recursos
                </button>
              </div>

              <div className="inventory-form" style={{ marginTop: 12 }}>
                {tab === "IN" ? (
                  <>
                    <div className="form-grid">
                      <div>
                        <span className="field-label">Nombre del recurso</span>
                        <input
                          type="text"
                          id="nuevoRecurso"
                          placeholder="Escribe el nombre del recurso"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <span className="field-label">Categoria</span>
                        <input
                          type="text"
                          id="nuevaCategoria"
                          list="categoriasMovimientos"
                          placeholder="Escribe o selecciona la categoria"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        />
                        <datalist id="categoriasMovimientos">
                          {categorySuggestions.map((name) => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <span className="field-label">Cantidad a ingresar</span>
                        <input
                          type="number"
                          id="nuevaCantidad"
                          placeholder="Ingresa la cantidad a ingresar"
                          min={1}
                          step={1}
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                          required
                        />
                      </div>

                      <div>
                        <span className="field-label">Precio</span>
                        <input
                          type="number"
                          id="nuevoPrecio"
                          placeholder="Ingresa el precio unitario"
                          min={0}
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                          required
                        />
                      </div>

                      <div>
                        <span className="field-label">Informacion adicional</span>
                        <input
                          type="text"
                          id="nuevaInfo"
                          placeholder="Escribe informacion adicional del recurso"
                          value={info}
                          onChange={(e) => setInfo(e.target.value)}
                        />
                      </div>

                      <div>
                        <span className="field-label">Distribuidor</span>
                        <input
                          type="text"
                          id="nuevoDistribuidor"
                          placeholder="Escribe el distribuidor o proveedor"
                          value={distribuidor}
                          onChange={(e) => setDistribuidor(e.target.value)}
                        />
                      </div>

                      <div>
                        <span className="field-label">Ubicacion en bodega, estanteria, sector, etc.</span>
                        <input
                          type="text"
                          id="nuevaUbicacion"
                          placeholder="Describe donde se ubica el recurso en la bodega"
                          value={ubicacionTexto}
                          onChange={(e) => setUbicacionTexto(e.target.value)}
                        />
                      </div>

                      <div>
                        <span className="field-label">Foto del recurso</span>
                        <input type="file" id="nuevaFoto" accept="image/*" onChange={handleFileChange} />
                      </div>

                      <div style={{ gridColumn: "span 2" }}>
                        <span className="field-label">Fotos de ubicacion (opcional, puede haber varias)</span>
                        <input
                          type="file"
                          id="nuevaUbicacionFoto"
                          accept="image/*"
                          multiple
                          onChange={(e) => setUbicacionFiles(Array.from(e.target.files ?? []))}
                        />
                      </div>
                    </div>
                    <label>
                      Comentario (opcional)
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="filtro-input"
                        placeholder="Motivo o detalle del movimiento"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <div className="form-grid">
                      <div>
                        <span className="field-label">Recurso</span>
                        <input
                          type="text"
                          placeholder="Selecciona un recurso"
                          value={salidaRecursoNombre}
                          onChange={(e) => handleSalidaRecursoChange(e.target.value)}
                          className="filtro-input"
                          list="salidaRecursosList"
                        />
                        <datalist id="salidaRecursosList">
                          {filteredSalidaResources.map((item) => (
                            <option key={item.id} value={item.recurso} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <span className="field-label">Categoria</span>
                        <input
                          type="text"
                          placeholder="Escribe o selecciona la categoria"
                          value={salidaCategoria}
                          onChange={(e) => handleSalidaCategoriaChange(e.target.value)}
                          className="filtro-input"
                          list="salidaCategoriasList"
                        />
                        <datalist id="salidaCategoriasList">
                          {Array.from(
                            new Set(
                              inventoryItems.map((it) => it.categoria).filter((cat): cat is string => Boolean(cat))
                            )
                          ).map((cat) => (
                            <option key={cat} value={cat} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <span className="field-label">Cantidad a retirar</span>
                        <input
                          type="number"
                          min={1}
                          placeholder="Ingresa la cantidad a retirar"
                          value={salidaCantidad}
                          onChange={(e) => setSalidaCantidad(e.target.value)}
                          className="filtro-input"
                        />
                      </div>
                    </div>

                    <p style={{ margin: "6px 0", color: "var(--inventory-muted)" }}>
                      Stock actual: <strong>{selectedItem?.stock ?? 0}</strong>
                    </p>

                    {showSalidaDetails && (
                      <div className="salida-details-card">
                        <div className="salida-details-left">
                          <div className="salida-detail-row">
                            <span className="salida-detail-label">Distribuidor</span>
                            <span className="salida-detail-value">
                              {salidaDistribuidor || "—"}
                            </span>
                          </div>
                          <div className="salida-detail-row">
                            <span className="salida-detail-label">Precio referencial</span>
                            <span className="salida-detail-value">
                              {typeof salidaPrecio === "number" ? `$${salidaPrecio}` : "—"}
                            </span>
                          </div>
                          <div className="salida-detail-row">
                            <span className="salida-detail-label">Ubicacion (texto)</span>
                            <span className="salida-detail-value">
                              {salidaUbicacionTexto || "—"}
                            </span>
                          </div>
                          <div className="salida-detail-row">
                            <span className="salida-detail-label">Fotos de ubicacion</span>
                            <span className="salida-detail-value">
                              {Array.isArray(salidaUbicacionFotos) && salidaUbicacionFotos.length > 0
                                ? `${salidaUbicacionFotos.length} foto(s)`
                                : "—"}
                            </span>
                          </div>
                        </div>
                        <div className="salida-details-right">
                          {salidaFotoPortada ? (
                            <button
                              type="button"
                              className="salida-photo-thumb"
                              onClick={handleOpenSalidaPhotoModal}
                            >
                              <img
                                src={salidaFotoPortada}
                                alt={salidaRecursoNombre || "Foto de recurso"}
                              />
                            </button>
                          ) : (
                            <div className="salida-photo-thumb salida-photo-thumb--empty">
                              Sin foto
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <label>
                      Comentario (opcional)
                      <textarea
                        value={salidaComentario}
                        onChange={(e) => setSalidaComentario(e.target.value)}
                        rows={3}
                        className="filtro-input"
                        placeholder="Motivo o detalle del movimiento"
                      />
                    </label>
                  </>
                )}

                {error && (
                  <p style={{ color: "var(--inventory-danger-text)", fontWeight: 700, marginTop: 8 }}>{error}</p>
                )}
                {success && (
                  <p style={{ color: "var(--inventory-success)", fontWeight: 700, marginTop: 8 }}>{success}</p>
                )}

                {tab === "IN" ? (
                  <button type="button" className="boton-agregar" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Guardando..." : "Registrar entrada"}
                  </button>
                ) : (
                  <div className="salida-actions">
                    <button type="button" className="boton-limpiar" onClick={handleClearSalida} disabled={loading}>
                      Limpiar salida
                    </button>
                    <button type="button" className="boton-agregar" onClick={handleSubmit} disabled={loading}>
                      {loading ? "Guardando..." : "Registrar salida"}
                    </button>
                  </div>
                )}

                {isSalidaPhotoModalOpen && salidaFotoPortada && (
                  <div
                    className="salida-photo-modal-backdrop"
                    onClick={handleCloseSalidaPhotoModal}
                  >
                    <div className="salida-photo-modal" onClick={(e) => e.stopPropagation()}>
                      <img
                        src={salidaFotoPortada}
                        alt={salidaRecursoNombre || "Foto del recurso"}
                        className="salida-photo-modal-img"
                      />
                      <div className="salida-photo-modal-actions">
                        <button
                          type="button"
                          className="boton-limpiar"
                          onClick={handleCloseSalidaPhotoModal}
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="inventory-section" style={{ marginTop: 12 }}>
              <h3>Ultimos movimientos</h3>
              <div className="tabla-scroll">
                <table id="tablaMovimientos" style={{ width: "100%", minWidth: 620 }}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Recurso</th>
                      <th>Tipo</th>
                      <th>Cantidad</th>
                      <th>Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.slice(0, 20).map((m) => (
                      <tr
                        key={m.id}
                        className={m.movement_type === "IN" ? "movement-row movement-in" : "movement-row movement-out"}
                      >
                        <td title={formatDate(m.created_at)}>{formatDate(m.created_at)}</td>
                        <td>{items.find((it) => it.id === m.item)?.name || `#${m.item}`}</td>
                        <td>
                          <span className={`badge ${m.movement_type === "IN" ? "badge-in" : "badge-out"}`}>
                            {m.movement_type === "IN" ? "Entrada" : "Salida"}
                          </span>
                        </td>
                        <td>{m.quantity}</td>
                        <td title={m.comment || "-"}>
                          {m.comment ? (
                            <>
                              {commentPreview(m.comment)}
                              <span className="info-icon" aria-hidden="true">i</span>
                            </>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {movements.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "12px" }}>
                          No hay movimientos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--inventory-muted)",
                  marginTop: "8px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span className="badge badge-in">Entrada</span> aumenta stock -{" "}
                <span className="badge badge-out">Salida</span> disminuye stock
              </div>
            </div>
          </section>
        </main>
        <AppFooter />
      </div>
    </div>
  );
}



