'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  
  const [email, setEmail] = useState('admin@atlixco.gob.mx')
  const [password, setPassword] = useState('Atlixco2024!')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales inválidas')
      } else {
        // Verificar que la sesión se creó correctamente
        const session = await getSession()
        if (session?.user?.role === 'admin') {
          window.location.href = callbackUrl // Use window.location for full redirect
        } else {
          setError('No tienes permisos de administrador')
        }
      }
    } catch (err) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          height: 100% !important;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%) !important;
          color: #374151 !important;
        }
        body {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 20px !important;
          min-height: 100vh !important;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: #7d2447 !important;
          box-shadow: 0 0 0 4px rgba(125, 36, 71, 0.1) !important;
        }
      `}</style>
      
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '48px',
        maxWidth: '480px',
        width: '100%',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '88px',
          height: '88px',
          background: 'linear-gradient(135deg, #7d2447 0%, #af1731 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          margin: '0 auto 24px',
          boxShadow: '0 8px 16px rgba(125, 36, 71, 0.3)'
        }}>
          🏛️
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#7d2447',
          textAlign: 'center',
          marginBottom: '8px',
          letterSpacing: '-1px'
        }}>
          GOBIERNO DE ATLIXCO
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Portal Administrativo - Centro de Adopción
        </p>
        
        <div style={{
          background: loading ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          border: `2px solid ${loading ? '#f59e0b' : '#16a34a'}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            color: loading ? '#d97706' : '#15803d',
            fontWeight: '700',
            fontSize: '18px',
            marginBottom: '4px'
          }}>
            {loading ? '🔄 PROCESANDO...' : '✅ SISTEMA OPERATIVO'}
          </div>
          <div style={{
            color: loading ? '#92400e' : '#166534',
            fontSize: '14px'
          }}>
            {loading ? 'Verificando credenciales administrativas' : 'Portal oficial reparado y funcional'}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '15px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Correo Electrónico
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@atlixco.gob.mx"
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #d1d5db',
                borderRadius: '10px',
                fontSize: '16px',
                background: '#ffffff',
                color: '#374151',
                outline: 'none',
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '15px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••"
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 20px',
                  border: '2px solid #d1d5db',
                  borderRadius: '10px',
                  fontSize: '16px',
                  background: '#ffffff',
                  color: '#374151',
                  outline: 'none',
                  opacity: loading ? 0.7 : 1
                }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '18px',
                  color: '#6b7280',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '2px solid #dc2626',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#dc2626',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                ⚠️ {error}
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: loading ? 
                'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 
                'linear-gradient(135deg, #7d2447 0%, #af1731 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              boxShadow: loading ? 
                '0 4px 8px rgba(156, 163, 175, 0.3)' :
                '0 8px 16px rgba(125, 36, 71, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                VERIFICANDO CREDENCIALES...
              </>
            ) : (
              <>
                🔐 ACCEDER AL SISTEMA GUBERNAMENTAL
              </>
            )}
          </button>
        </form>
        
        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1px solid #16a34a',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#15803d',
            fontWeight: '600',
            marginBottom: '6px'
          }}>
            CREDENCIALES DE ACCESO
          </div>
          <div style={{
            fontSize: '14px',
            color: '#166534'
          }}>
            <div>Email: admin@atlixco.gob.mx</div>
            <div>Password: Atlixco2024!</div>
          </div>
        </div>
        
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          Sistema de Gestión Municipal<br/>
          Gobierno de Atlixco, Puebla<br/>
          <strong>Soporte:</strong> soporte.ti@atlixco.gob.mx
        </div>
      </div>
    </>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#7d2447',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Cargando sistema de autenticación...
          </p>
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  )
}