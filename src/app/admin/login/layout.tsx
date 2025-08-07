export const dynamic = 'force-dynamic'

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <title>Login Admin - Centro de Adopción Atlixco</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              background-color: #f3f4f6 !important;
              color: #374151 !important;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              height: 100% !important;
              overflow-x: hidden;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
            #__next {
              height: 100% !important;
            }
            @media (prefers-color-scheme: dark) {
              html, body {
                background-color: #f3f4f6 !important;
                color: #374151 !important;
              }
            }
          `
        }} />
      </head>
      <body>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#f3f4f6',
          zIndex: 10000
        }}>
          {children}
        </div>
      </body>
    </html>
  )
}