'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Shield, Crown, Sparkles } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
          router.push(callbackUrl)
          router.refresh()
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
    <div className="admin-login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Patrones decorativos de fondo */}
      <div className="admin-background-patterns">
        <div className="pattern-diamond pattern-1"></div>
        <div className="pattern-diamond pattern-2"></div>
        <div className="pattern-diamond pattern-3"></div>
        <div className="pattern-cross pattern-4"></div>
        <div className="pattern-cross pattern-5"></div>
        <div className="floral-pattern floral-1"></div>
        <div className="floral-pattern floral-2"></div>
      </div>

      {/* Gradiente de fondo */}
      <div className="admin-gradient-overlay"></div>

      <div className="admin-login-wrapper" style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '480px'
      }}>
        <div className="admin-login-card" style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header gubernamental */}
          <div className="admin-header">
            {/* Logo oficial */}
            <div className="admin-logo-container">
              <div className="admin-logo-shield">
                <Shield className="shield-icon" />
                <Crown className="crown-icon" />
              </div>
              <div className="admin-sparkle admin-sparkle-1">
                <Sparkles className="sparkle-icon" />
              </div>
              <div className="admin-sparkle admin-sparkle-2">
                <Sparkles className="sparkle-icon" />
              </div>
            </div>
            
            <h1 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#7d2447',
              textAlign: 'center',
              margin: '24px 0 8px 0',
              letterSpacing: '1px'
            }}>
              GOBIERNO DE ATLIXCO
            </h1>
            <div style={{
              textAlign: 'center',
              marginBottom: '8px'
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#9b2758',
                margin: 0,
                letterSpacing: '0.5px'
              }}>LA CAPITAL IMPARABLE</p>
            </div>
            <p style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#6b7280',
              margin: 0,
              fontWeight: '500'
            }}>
              Portal Administrativo • Centro de Adopción y Bienestar Animal
            </p>
          </div>

          {/* Formulario de login */}
          <form onSubmit={handleSubmit} style={{
            marginTop: '48px'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Correo Institucional
              </label>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@atlixco.gob.mx"
                  required
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: '#fafafa',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Contraseña de Acceso
              </label>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '16px 50px 16px 20px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: '#fafafa',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '18px', height: '18px' }} />
                  ) : (
                    <Eye style={{ width: '18px', height: '18px' }} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  fontSize: '20px',
                  color: '#dc2626'
                }}>⚠</div>
                <p style={{
                  color: '#dc2626',
                  fontSize: '14px',
                  fontWeight: '500',
                  margin: 0
                }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-submit-button"
              style={{
                width: '100%',
                padding: '18px',
                marginTop: '32px',
                background: 'linear-gradient(135deg, #7d2447 0%, #9b2758 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <Shield style={{ width: '18px', height: '18px' }} />
                  <span>ACCEDER AL SISTEMA</span>
                </>
              )}
            </button>
          </form>

          {/* Footer institucional */}
          <div style={{
            marginTop: '40px',
            textAlign: 'center',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '24px'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '0 0 8px 0',
              fontWeight: '500'
            }}>
              Sistema de Administración Gubernamental
            </p>
            <p style={{
              fontSize: '11px',
              color: '#9ca3af',
              margin: 0
            }}>
              ¿Necesita asistencia técnica?{' '}
              <a href="mailto:soporte.ti@atlixco.gob.mx" style={{
                color: '#7d2447',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Contacte al Departamento de TI
              </a>
            </p>
          </div>
        </div>

        {/* Información de acceso de desarrollo */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#22c55e',
              color: 'white',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>ENTORNO DE DESARROLLO</div>
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 12px 0'
            }}>Credenciales de Prueba:</p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '13px',
                color: '#6b7280',
                fontWeight: '500'
              }}>Usuario:</span>
              <code style={{
                padding: '4px 8px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#374151',
                fontFamily: 'monospace'
              }}>admin@atlixco.gob.mx</code>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '13px',
                color: '#6b7280',
                fontWeight: '500'
              }}>Contraseña:</span>
              <code style={{
                padding: '4px 8px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#374151',
                fontFamily: 'monospace'
              }}>Atlixco2024!</code>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS globales */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .admin-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 24px;
        }

        .admin-logo-shield {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #7d2447 0%, #9b2758 100%);
          border-radius: 50%;
          box-shadow: 0 8px 32px rgba(125, 36, 71, 0.3);
        }

        .shield-icon {
          width: 32px;
          height: 32px;
          color: white;
          position: relative;
          z-index: 2;
        }

        .crown-icon {
          width: 20px;
          height: 20px;
          color: #bfb591;
          position: absolute;
          top: -8px;
          z-index: 3;
        }

        .admin-sparkle {
          position: absolute;
          animation: sparkle 2s ease-in-out infinite;
        }

        .admin-sparkle-1 {
          top: -10px;
          left: -10px;
          animation-delay: 0s;
        }

        .admin-sparkle-2 {
          bottom: -10px;
          right: -10px;
          animation-delay: 1s;
        }

        .sparkle-icon {
          width: 16px;
          height: 16px;
          color: #bfb591;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        /* Patrones decorativos de fondo */
        .admin-background-patterns {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.03;
          pointer-events: none;
        }

        .pattern-diamond {
          position: absolute;
          width: 40px;
          height: 40px;
          background: #7d2447;
          transform: rotate(45deg);
        }

        .pattern-1 {
          top: 10%;
          left: 5%;
        }

        .pattern-2 {
          top: 60%;
          right: 15%;
        }

        .pattern-3 {
          bottom: 20%;
          left: 20%;
        }

        .pattern-cross {
          position: absolute;
          width: 30px;
          height: 30px;
        }

        .pattern-cross::before,
        .pattern-cross::after {
          content: '';
          position: absolute;
          background: #9b2758;
        }

        .pattern-cross::before {
          top: 0;
          left: 50%;
          width: 2px;
          height: 100%;
          transform: translateX(-50%);
        }

        .pattern-cross::after {
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          transform: translateY(-50%);
        }

        .pattern-4 {
          top: 30%;
          right: 8%;
        }

        .pattern-5 {
          bottom: 40%;
          left: 8%;
        }

        .floral-pattern {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 3px solid #bfb591;
          border-radius: 50%;
        }

        .floral-1 {
          top: 15%;
          right: 25%;
        }

        .floral-2 {
          bottom: 25%;
          left: 30%;
        }

        .admin-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 40%, rgba(125, 36, 71, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Inputs focus effects */
        input:focus {
          border-color: #7d2447 !important;
          box-shadow: 0 0 0 3px rgba(125, 36, 71, 0.1) !important;
        }

        /* Button hover effects */
        button[type="submit"]:hover:not(:disabled) {
          background: linear-gradient(135deg, #8b2750 0%, #a52d60 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(125, 36, 71, 0.3) !important;
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .admin-login-card {
            padding: 32px 24px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}