import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import AuthProvider from "../components/providers/AuthProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Centro de Adopción Atlixco",
  description: "Encuentra tu compañero perfecto en el Centro de Adopción de Atlixco, Puebla. Conectamos corazones con perritos que buscan un hogar lleno de amor.",
  keywords: "adopción, perros, mascotas, Atlixco, Puebla, rescate animal",
  authors: [{ name: "Centro de Adopción Atlixco" }],
  openGraph: {
    title: "Centro de Adopción Atlixco",
    description: "Encuentra tu compañero perfecto en Atlixco, Puebla",
    locale: "es_MX",
    type: "website",
  },
};

// Forzar que toda la aplicación sea dinámica
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-montserrat antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
