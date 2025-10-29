import createMiddleware from 'next-intl/middleware'
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

const locales = ['es', 'en']
const defaultLocale = 'es'

// Crear el middleware de i18n
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

function isProtected(pathname: string): boolean {
  // Remove locale prefix before checking
  const withoutLocale = pathname.replace(/^\/(es|en)/, '') || '/'

  // Exact matches or startsWith for subpaths
  return PROTECTED.some((base) =>
    withoutLocale === base || withoutLocale.startsWith(`${base}/`)
  );
}

function getBackendBase(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (env) return env.replace(/\/+$/, "");
  return "http://localhost:8000";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login and recovery pages, assets and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.includes("/login") ||
    pathname.includes("/recuperacion") ||
    pathname.includes("/test") ||  // Allow test page
    pathname.includes("/simple") ||  // Allow simple test page
    pathname.includes("/ajustes/idioma")  // Allow language settings temporarily
  ) {
    return NextResponse.next();  // Skip all middleware temporarily for debugging
  }

  // Remove locale from pathname for protected check
  const withoutLocale = pathname.replace(/^\/(es|en)/, '') || '/'

  if (!isProtected(withoutLocale)) {
    // Apply i18n middleware for non-protected routes
    return intlMiddleware(request);
  }

  // If we already have a Django session cookie, allow (fast path in dev)
  const hasSession = request.cookies.get("sessionid");
  if (hasSession) {
    // Apply i18n middleware after auth check
    return intlMiddleware(request);
  }

  // Verify session against backend /api/me/ by forwarding cookies
  const backend = getBackendBase();
  const cookieHeader = request.headers.get("cookie") || "";

  try {
    const res = await fetch(`${backend}/api/me/`, {
      method: "GET",
      headers: { cookie: cookieHeader },
      // Edge runtime ignores credentials, forward cookies manually as above
      cache: "no-store",
    });

    if (res.ok) {
      // Apply i18n middleware after successful auth
      return intlMiddleware(request);
    }
  } catch {
    // Network error -> treat as unauthenticated
  }

  // Get current locale from pathname
  const locale = pathname.match(/^\/(es|en)/)?.[1] || defaultLocale
  const loginUrl = new URL(`/${locale}/login`, request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon|logo|.*\\..*|_vercel).*)",
  ],
};
