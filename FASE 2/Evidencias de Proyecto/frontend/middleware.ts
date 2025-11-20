import { NextResponse, type NextRequest } from "next/server";

/**
 * Prefijos permitidos que se deben excluir del chequeo global.
 * Mantener esta lista ayuda a evitar redirecciones infinitas en assets o APIs.
 */
const PUBLIC_PREFIXES = ["/_next", "/api", "/favicon", "/logo", "/messages"];

/**
 * Todas las rutas donde debe existir una sesión válida.
 * Usamos los mismos slugs que se manejan en la navegación principal.
 */
const AUTH_REQUIRED = ["/", "/inicio", "/inventario", "/categorias", "/presupuesto", "/ajustes", "/administracion"];

/**
 * Reglas específicas de rol. Si `requiredRole` es `developer`, sólo usuarios del grupo
 * avanzado (o staff) podrán continuar.
 */
const ROLE_POLICIES = [
  { pattern: /^\/(?:(?:es|en)\/)?inventario\/papelera/i, requiredRole: "developer" },
  { pattern: /^\/(?:(?:es|en)\/)?administracion/i, requiredRole: "developer" },
  { pattern: /^\/(?:(?:es|en)\/)?ajustes/i, requiredRole: "viewer" },
  { pattern: /^\/(?:(?:es|en)\/)?inventario/i, requiredRole: "viewer" },
] as const;

type RoleGuard = (typeof ROLE_POLICIES)[number]["requiredRole"];

function shouldBypass(pathname: string): boolean {
  if (pathname === "/") {
    return false; // La home principal también requiere sesión
  }
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/recuperacion") ||
    pathname.startsWith("/idioma")
  ) {
    return true;
  }
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/^\/(es|en)(?=\/|$)/i, "");
  return trimmed || "/";
}

function needsAuthentication(pathname: string): boolean {
  return AUTH_REQUIRED.some(
    (base) => pathname === base || pathname.startsWith(`${base.endsWith("/") ? base : `${base}/`}`)
  );
}

function resolveRequiredRole(pathname: string): RoleGuard | null {
  for (const policy of ROLE_POLICIES) {
    if (policy.pattern.test(pathname)) {
      return policy.requiredRole;
    }
  }
  return null;
}

function getBackendBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }
  return "http://localhost:8000";
}

async function fetchSession(request: NextRequest) {
  const backend = getBackendBase();
  const cookieHeader = request.headers.get("cookie") || "";
  try {
    const response = await fetch(`${backend}/api/me/`, {
      headers: { cookie: cookieHeader },
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.user
      ? {
          isDeveloper: Boolean(payload.user.is_developer),
          groups: Array.isArray(payload.user.groups) ? payload.user.groups : [],
        }
      : null;
  } catch {
    return null;
  }
}

function buildLoginRedirect(request: NextRequest, pathname: string, reason: "expired" | "denied" | "missing") {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  if (reason === "expired") loginUrl.searchParams.set("expired", "1");
  if (reason === "denied") loginUrl.searchParams.set("denied", "1");
  return loginUrl;
}

function clearClientCookies(response: NextResponse) {
  response.cookies.set("auth_ok", "", { maxAge: 0, path: "/" });
  response.cookies.set("session_exp", "", { maxAge: 0, path: "/" });
}

function userSatisfies(required: RoleGuard, details: { isDeveloper: boolean; groups: string[] }) {
  if (required === "viewer") {
    return details.isDeveloper || details.groups.length > 0;
  }
  if (required === "developer") {
    return details.isDeveloper;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const normalized = normalizePathname(pathname);
  if (!needsAuthentication(normalized)) {
    return NextResponse.next();
  }

  const authFlag = request.cookies.get("auth_ok");
  if (!authFlag || authFlag.value !== "1") {
    return NextResponse.redirect(buildLoginRedirect(request, pathname, "missing"));
  }

  const epochNow = Math.floor(Date.now() / 1000);
  const expiresRaw = request.cookies.get("session_exp")?.value;
  if (expiresRaw) {
    const exp = parseInt(expiresRaw, 10);
    if (Number.isFinite(exp) && exp <= epochNow) {
      const redirectResponse = NextResponse.redirect(buildLoginRedirect(request, pathname, "expired"));
      clearClientCookies(redirectResponse);
      return redirectResponse;
    }
  }

  const session = await fetchSession(request);
  if (!session) {
    const redirectResponse = NextResponse.redirect(buildLoginRedirect(request, pathname, "missing"));
    clearClientCookies(redirectResponse);
    return redirectResponse;
  }

  const requiredRole = resolveRequiredRole(normalized);
  if (requiredRole && !userSatisfies(requiredRole, session)) {
    const redirectResponse = NextResponse.redirect(buildLoginRedirect(request, pathname, "denied"));
    clearClientCookies(redirectResponse);
    return redirectResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo).*)"],
};
