"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { AnimatedBackground } from "../../(auth)/login/components/AnimatedBackground";
import "../../(auth)/login/styles.css";
import "../styles.css";

type Pending = {
  id: number;
  action: string;
  status: string;
  item_id: number | null;
  item_snapshot: any;
  payload?: any;
  created_by: string | null;
  created_at: string;
};

export default function PapeleraPage() {
  const router = useRouter();
  const [items, setItems] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = useMemo(() => {
    const sanitize = (u: string) => u.replace(/\/+$/, "");
    const env = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (env) return sanitize(env);
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return sanitize("http://localhost:8000");
      }
      return sanitize(window.location.origin);
    }
    return "";
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/inventory/pending/`, { credentials: "include" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data.results) ? data.results : []);
    } catch (e: any) {
      setError(e?.message || "No se pudo cargar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Guard: only developers can view this page
    (async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/me/`, { credentials: "include" });
        if (!res.ok) { router.push("/inventario"); return; }
        const data = await res.json();
        if (!data?.user?.is_developer) { router.push("/inventario"); return; }
        await load();
      } catch {
        router.push("/inventario");
      }
    })();
  }, [apiBaseUrl, router]);

  async function act(id: number, action: "approve" | "reject") {
    try {
      const res = await fetch(`${apiBaseUrl}/api/inventory/pending/${id}/${action}/`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        alert("No autorizado o error del servidor");
        return;
      }
      await load();
    } catch {
      alert("Error de red");
    }
  }

  function renderDetails(c: Pending) {
    const snap = c.item_snapshot || {};
    const payload = c.payload || {};
    const fields = ["recurso", "categoria", "cantidad", "precio", "info"] as const;
    if (c.action === "delete") {
      return <small>Eliminar: <strong>{snap.recurso ?? `#${c.item_id}`}</strong></small>;
    }
    if (c.action === "create") {
      return (
        <small>
          Crear: <strong>{payload.recurso}</strong>
          {fields.map((f) => payload[f] !== undefined ? (<span key={f}> · {f}: {String(payload[f])}</span>) : null)}
        </small>
      );
    }
    // update diff
    const diffs: string[] = [];
    fields.forEach((f) => {
      const beforeV = snap[f as any];
      const afterV = payload[f as any];
      if (afterV !== undefined && String(beforeV) !== String(afterV)) {
        diffs.push(`${f}: "${beforeV ?? ""}" → "${afterV}"`);
      }
    });
    return (
      <small>
        Editar: <strong>{snap.recurso ?? `#${c.item_id}`}</strong>
        {diffs.length ? diffs.map((d, i) => (<span key={i}> · {d}</span>)) : <span> · (sin cambios detectables)</span>}
      </small>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="inventory-page">
        <AppHeader />
        <div className="inventory-shell">
          <main className="inventory-main">
            <section className="inventory-card">
              <div className="inventory-card__heading">
                <h2>Cambios pendientes / Papelera</h2>
                <p>Solicitudes de eliminación y cambios a la espera de aprobación.</p>
                <p><Link href="/inventario">← Volver al inventario</Link></p>
              </div>
              {loading && <p>Cargando…</p>}
              {error && <p style={{ color: "tomato" }}>{error}</p>}
              {!loading && !error && (
                <div className="tabla-scroll">
                  <table id="tablaRecursos">
                    <thead>
                      <tr>
                        <th>ID Cambio</th>
                        <th>Acción</th>
                        <th>Estado</th>
                        <th>Item</th>
                        <th>Solicitado por</th>
                        <th>Detalles</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 && (
                        <tr><td colSpan={6}>No hay cambios pendientes.</td></tr>
                      )}
                      {items.map((c) => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.action}</td>
                          <td>{c.status}</td>
                          <td>{c.item_snapshot?.recurso ?? `#${c.item_id}`}</td>
                          <td>{c.created_by ?? "-"}</td>
                          <td>{renderDetails(c)}</td>
                          <td>
                            <div className="tabla-acciones">
                              <button type="button" className="boton-guardar" onClick={() => act(c.id, "approve")}>Aprobar</button>
                              <button type="button" className="boton-cancelar" onClick={() => act(c.id, "reject")}>Rechazar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </div>
        <AppFooter />
      </div>
    </>
  );
}
