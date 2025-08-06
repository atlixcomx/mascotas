import "./globals.css";

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <title>Centro de Adopción Atlixco</title>
        <meta name="description" content="Encuentra tu compañero perfecto en el Centro de Adopción de Atlixco, Puebla." />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}