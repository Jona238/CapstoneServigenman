"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedBackground } from "../../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../../(auth)/login/hooks/useBodyClass";
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
  useBodyClass();
  const router = useRouter();
  const { t } = useLanguage();
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
      setError(e?.message || t.errors.loadError);
    } finally {
      setLoading(false);
    }
  }

  // Agrega/quita la clase en <body> para estilos del inventario
  useEffect(() => {
    if (typeof document === "undefined") {
      return () => {};
    }
    const inventoryClass = "inventory-layout";
    document.body.classList.add(inventoryClass);
    return () => {
      document.body.classList.remove(inventoryClass);
    };
  }, []);

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
        alert(t.errors.unauthorizedError);
        return;
      }
      await load();
    } catch {
      alert(t.errors.networkError);
    }
  }

  function renderDetails(c: Pending) {
    const snap = c.item_snapshot || {};
    const payload = c.payload || {};
    const fields = ["recurso", "categoria", "cantidad", "precio", "info"] as const;
    if (c.action === "delete") {
      return <small>{t.papelera.actionTypes.delete.replace("{name}", snap.recurso ?? `#${c.item_id}`)}</small>;
    }
    if (c.action === "create") {
      return (
        <small>
          {t.papelera.actionTypes.create.replace("{name}", payload.recurso)}
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
        {t.papelera.actionTypes.edit.replace("{name}", snap.recurso ?? `#${c.item_id}`)}
        {diffs.length ? diffs.map((d, i) => (<span key={i}> · {d}</span>)) : <span> · {t.papelera.actionTypes.noChanges}</span>}
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
                <h2>{t.papelera.title}</h2>
                <p>{t.papelera.description}</p>
                <p><Link href="/inventario">{t.inventoryMessages.backToInventory}</Link></p>
              </div>
              {loading && <p>{t.common.loading}</p>}
              {error && <p style={{ color: "tomato" }}>{error}</p>}
              {!loading && !error && (
                <div className="tabla-scroll">
                  <table id="tablaRecursos">
                    <thead>
                      <tr>
                        <th>{t.papelera.tableHeaders.changeId}</th>
                        <th>{t.papelera.tableHeaders.action}</th>
                        <th>{t.papelera.tableHeaders.status}</th>
                        <th>{t.papelera.tableHeaders.item}</th>
                        <th>{t.papelera.tableHeaders.requestedBy}</th>
                        <th>{t.papelera.tableHeaders.details}</th>
                        <th>{t.common.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 && (
                        <tr><td colSpan={7}>{t.papelera.noPendingChanges}</td></tr>
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
                              <button type="button" className="boton-guardar" onClick={() => act(c.id, "approve")}>{t.papelera.actions.approve}</button>
                              <button type="button" className="boton-cancelar" onClick={() => act(c.id, "reject")}>{t.papelera.actions.reject}</button>
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
