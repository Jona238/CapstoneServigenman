"use client";

export function setCookie(name: string, value: string, opts?: { maxAgeSeconds?: number; expiresAt?: Date; path?: string }) {
  const path = opts?.path ?? "/";
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`;
  if (opts?.maxAgeSeconds !== undefined) cookie += `; Max-Age=${Math.max(0, Math.floor(opts.maxAgeSeconds))}`;
  if (opts?.expiresAt) cookie += `; Expires=${opts.expiresAt.toUTCString()}`;
  try { document.cookie = cookie; } catch { /* noop */ }
}

export function deleteCookie(name: string, path: string = "/") {
  try { document.cookie = `${encodeURIComponent(name)}=; path=${path}; Max-Age=0`; } catch { /* noop */ }
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const target = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    if (c.startsWith(target)) return decodeURIComponent(c.substring(target.length));
  }
  return null;
}

