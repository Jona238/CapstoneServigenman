import type { Metadata } from "next";

import LoginPageClient from "./LoginPageClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SERVIGENMAN - Portal Interno",
  description:
    "Portal interno de SERVIGENMAN para el personal autorizado de la compania. No incluye integracion HTTP real. Emite evento/handler para que la integracion lo conecte.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageClient />
    </Suspense>
  );
}

