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
  try {
    if (process.env.NODE_ENV !== "production") {
      // In dev, avoid Edge/runtime glitches on Windows by bypassing middleware
      return NextResponse.next();
    }
    const { pathname } = request.nextUrl;

  // Skip login, recovery, test pages, assets and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/recuperacion") ||
    pathname.startsWith("/idioma") || // Allow language page
    pathname.startsWith("/ajustes/control-sistema") // Bypass strict auth for stability while testing this page
  ) {
    return NextResponse.next();
  }

    if (!isProtected(pathname)) {
      return NextResponse.next();
    }
    // Lightweight auth: rely on a frontend cookie set after login
    const hasFrontendAuth = request.cookies.get("auth_ok");
    const sessionExp = request.cookies.get("session_exp");
    const now = Math.floor(Date.now() / 1000);

    if (hasFrontendAuth?.value === "1") {
      // If we have an auth cookie but also an expired session, force logout
      if (sessionExp?.value) {
        const exp = parseInt(sessionExp.value, 10);
        if (Number.isFinite(exp) && now >= exp) {
          const loginUrl = new URL("/login", request.url);
          loginUrl.searchParams.set("expired", "1");
          const res = NextResponse.redirect(loginUrl);
          // Clear cookies
          res.cookies.set("auth_ok", "", { maxAge: 0, path: "/" });
          res.cookies.set("session_exp", "", { maxAge: 0, path: "/" });
          return res;
        }
      }
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  } catch (err) {
    // Fallback: never break the site from middleware
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon|logo).*)",
  ],
};
