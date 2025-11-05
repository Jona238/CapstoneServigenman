import { NextResponse, type NextRequest } from "next/server";

// Protected routes: add here the paths that require authentication
const PROTECTED = [
  "/",
  "/inicio",
  "/inventario",
  "/inventario/",
  "/categorias",
  "/presupuesto",
  "/ajustes",
];

function isProtected(pathname: string): boolean {
  // Exact matches or startsWith for subpaths
  return PROTECTED.some((base) =>
    pathname === base || pathname.startsWith(`${base}/`)
  );
}

function getBackendBase(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (env) return env.replace(/\/+$/, "");
  return "http://localhost:8000";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login, recovery, test pages, assets and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/recuperacion") ||
    pathname.startsWith("/idioma")  // Allow language page
  ) {
    return NextResponse.next();
  }

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }
  // Lightweight auth: rely on a frontend cookie set after login
  const hasFrontendAuth = request.cookies.get("auth_ok");
  if (hasFrontendAuth?.value === "1") {
    return NextResponse.next();
  }
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon|logo).*)",
  ],
};
