import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "SERVIGENMAN - Portal Interno",
  description:
    "Portal interno de SERVIGENMAN para el personal autorizado de la compañía.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
