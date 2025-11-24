import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SessionManager from "@/lib/session/SessionManager";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SERVIGENMAN - Portal Interno",
  description:
    "Portal interno de SERVIGENMAN para el personal autorizado de la compañía.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider />
        <LanguageProvider>
          {/* Global session + inactivity management (client-side) */}
          <SessionManager />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
