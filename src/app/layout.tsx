import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}