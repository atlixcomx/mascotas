export const dynamic = 'force-dynamic'

export default function AdminLoginDirect() {
  return (
    <html lang="es">
      <head>
        <title>Admin Login - Centro de Adopción Atlixco</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              height: 100%;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
              color: #374151;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              padding: 48px;
              max-width: 480px;
              width: 100%;
              border: 1px solid #e5e7eb;
            }
            .logo {
              width: 88px;
              height: 88px;
              background: linear-gradient(135deg, #7d2447 0%, #af1731 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
              margin: 0 auto 24px;
              box-shadow: 0 8px 16px rgba(125, 36, 71, 0.3);
            }
            .title {
              font-size: 32px;
              font-weight: 800;
              color: #7d2447;
              text-align: center;
              margin-bottom: 8px;
              letter-spacing: -1px;
            }
            .subtitle {
              font-size: 16px;
              color: #6b7280;
              text-align: center;
              margin-bottom: 32px;
            }
            .status {
              background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
              border: 2px solid #16a34a;
              border-radius: 12px;
              padding: 20px;
              text-align: center;
              margin-bottom: 32px;
            }
            .status-text {
              color: #15803d;
              font-weight: 700;
              font-size: 18px;
              margin-bottom: 4px;
            }
            .status-detail {
              color: #166534;
              font-size: 14px;
            }
            .form-group {
              margin-bottom: 24px;
            }
            .label {
              display: block;
              font-size: 15px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 8px;
            }
            .input {
              width: 100%;
              padding: 16px 20px;
              border: 2px solid #d1d5db;
              border-radius: 10px;
              font-size: 16px;
              background: #ffffff;
              color: #374151;
              outline: none;
              transition: all 0.2s;
            }
            .input:focus {
              border-color: #7d2447;
              box-shadow: 0 0 0 4px rgba(125, 36, 71, 0.1);
            }
            .button {
              width: 100%;
              padding: 18px;
              background: linear-gradient(135deg, #7d2447 0%, #af1731 100%);
              color: white;
              border: none;
              border-radius: 10px;
              font-size: 18px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.3s;
              text-align: center;
              box-shadow: 0 8px 16px rgba(125, 36, 71, 0.3);
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 24px rgba(125, 36, 71, 0.4);
            }
            .button:active {
              transform: translateY(0);
            }
            .dev-notice {
              margin-top: 32px;
              padding: 20px;
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border: 1px solid #f59e0b;
              border-radius: 12px;
              text-align: center;
            }
            .dev-title {
              font-size: 13px;
              color: #92400e;
              font-weight: 700;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .dev-text {
              font-size: 15px;
              color: #78350f;
              line-height: 1.5;
            }
            .footer {
              margin-top: 32px;
              text-align: center;
              color: #9ca3af;
              font-size: 13px;
              line-height: 1.6;
            }
          `
        }} />
      </head>
      <body>
        <div className="container">
          <div className="logo">🏛️</div>
          
          <h1 className="title">GOBIERNO DE ATLIXCO</h1>
          <p className="subtitle">Portal Administrativo - Centro de Adopción</p>
          
          <div className="status">
            <div className="status-text">✅ SISTEMA OPERATIVO</div>
            <div className="status-detail">Página renderizada correctamente - Layout independiente</div>
          </div>
          
          <form>
            <div className="form-group">
              <label className="label">Correo Electrónico</label>
              <input 
                type="email" 
                className="input"
                placeholder="admin@atlixco.gob.mx"
                defaultValue="admin@atlixco.gob.mx"
              />
            </div>
            
            <div className="form-group">
              <label className="label">Contraseña</label>
              <input 
                type="password" 
                className="input"
                placeholder="••••••••••"
                defaultValue="Atlixco2024!"
              />
            </div>
            
            <button 
              type="button" 
              className="button"
              onClick={() => alert('✅ Interfaz funcionando correctamente!\\n\\nEsta página se carga sin problemas, confirmando que Next.js funciona.\\n\\nEl problema original estaba en conflictos con el layout admin.')}
            >
              🔐 ACCEDER AL SISTEMA GUBERNAMENTAL
            </button>
          </form>
          
          <div className="dev-notice">
            <div className="dev-title">Diagnóstico Técnico</div>
            <div className="dev-text">
              Esta página usa un layout completamente independiente y demuestra que 
              el sistema de renderizado funciona correctamente.
            </div>
          </div>
          
          <div className="footer">
            Sistema de Gestión Municipal<br/>
            Gobierno de Atlixco, Puebla<br/>
            <strong>Soporte:</strong> soporte.ti@atlixco.gob.mx
          </div>
        </div>
      </body>
    </html>
  )
}