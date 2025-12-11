export type InventoryItem = {
  id: number;
  recurso: string;
  categoria: string;
  cantidad: number;
  precio: number;
  foto: string;
  info: string;
  distribuidor?: string;
  ubicacion_texto?: string;
  ubicacion_foto?: string;
  ubicacion_fotos?: string[];
  ubicacion_fotos_count?: number;
};

export type MovementPayload = {
  item: number;
  movement_type: "IN" | "OUT";
  quantity: number;
  comment?: string;
};

const BACKEND_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL)) ||
  "http://localhost:8000";

async function backendFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = `${BACKEND_URL.replace(/\/$/, "")}${path}`;
  const init: RequestInit = {
    ...options,
    credentials: options?.credentials ?? "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  };
  return fetch(url, init);
}

export async function apiListItems(): Promise<InventoryItem[] | null> {
  try {
    const res = await backendFetch(`/api/inventory/items/`, { method: "GET" });
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: InventoryItem[] };
    return Array.isArray(data?.results) ? data.results : null;
  } catch {
    return null;
  }
}

export async function apiCreateMovement(payload: MovementPayload): Promise<boolean> {
  try {
    const res = await backendFetch(`/api/inventory/movements/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type CreateItemPayload = Omit<InventoryItem, "id">;
export type UpdateItemPayload = Partial<Omit<InventoryItem, "id">>;

export async function apiCreateItem(payload: CreateItemPayload): Promise<InventoryItem | null> {
  try {
    const res = await backendFetch(`/api/inventory/items/`, {
      method: "POST",
      body: JSON.stringify({
        recurso: payload.recurso,
        categoria: payload.categoria,
        cantidad: payload.cantidad,
        precio: payload.precio,
        foto: payload.foto,
        info: payload.info,
        distribuidor: payload.distribuidor,
        ubicacion_texto: payload.ubicacion_texto,
        ubicacion_fotos: payload.ubicacion_fotos,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && (data as any).pending) {
      try { alert("Creación enviada para aprobación del desarrollador."); } catch {}
      return null;
    }
    return data as InventoryItem;
  } catch {
    return null;
  }
}

export async function apiUpdateItem(id: number, payload: UpdateItemPayload): Promise<InventoryItem | null> {
  try {
    const res = await backendFetch(`/api/inventory/items/${id}/`, {
      method: "PUT",
      body: JSON.stringify({
        recurso: payload.recurso,
        categoria: payload.categoria,
        cantidad: payload.cantidad,
        precio: payload.precio,
        foto: payload.foto,
        info: payload.info,
        distribuidor: payload.distribuidor,
        ubicacion_texto: payload.ubicacion_texto,
        ubicacion_fotos: payload.ubicacion_fotos,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && (data as any).pending) {
      try { alert("EdiciИn enviada para aprobaciИn del desarrollador."); } catch {}
      return null;
    }
    return data as InventoryItem;
  } catch {
    return null;
  }
}

export type InventoryMovement = {
  id: number;
  item: number;
  movement_type: "IN" | "OUT";
  quantity: number;
  comment: string;
  created_at: string;
  // Note: viewset returns numeric item id; to display name we map with items list.
};

export async function apiListMovements(): Promise<InventoryMovement[] | null> {
  try {
    const res = await backendFetch(`/api/inventory/movements/`, { method: "GET" });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) return data as InventoryMovement[];
    if (Array.isArray((data as any)?.results)) return (data as any).results as InventoryMovement[];
    return null;
  } catch {
    return null;
  }
}
