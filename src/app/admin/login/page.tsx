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
            
            <h1 className="admin-title">
              GOBIERNO DE LA CIUDAD
            </h1>
            <div className="admin-subtitle-container">
              <div className="admin-wings-left"></div>
              <p className="admin-subtitle">LA CAPITAL IMPARABLE</p>
              <div className="admin-wings-right"></div>
            </div>
            <p className="admin-department">
              Portal Administrativo • Centro de Adopción Atlixco
            </p>
          </div>

          {/* Formulario de login */}
          <form onSubmit={handleSubmit} className="admin-form" style={{
            marginTop: '48px'
          }}>
            <div className="admin-form-group">
              <label className="admin-label">
                Correo Institucional
              </label>
              <div className="admin-input-wrapper" style={{
                position: 'relative',
                marginTop: '8px'
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input"
                  placeholder="administrador@atlixco.gob.mx"
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
                    transition: 'all 0.3s ease'
                  }}
                />
                <div className="admin-input-border"></div>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                Contraseña de Acceso
              </label>
              <div className="admin-input-wrapper" style={{
                position: 'relative',
                marginTop: '8px'
              }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input admin-input-password"
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
                    transition: 'all 0.3s ease'
                  }}
                />
                <button
                  type="button"
                  className="admin-password-toggle"
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
                    padding: '8px'
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="password-icon" />
                  ) : (
                    <Eye className="password-icon" />
                  )}
                </button>
                <div className="admin-input-border"></div>
              </div>
            </div>

            {error && (
              <div className="admin-error-message">
                <div className="admin-error-icon">⚠</div>
                <p className="admin-error-text">{error}</p>
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
              <div className="admin-button-content">
                {loading ? (
                  <>
                    <div className="admin-spinner"></div>
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <Shield className="button-icon" />
                    <span>ACCEDER AL SISTEMA</span>
                  </>
                )}
              </div>
              <div className="admin-button-glow"></div>
            </button>
          </form>

          {/* Footer institucional */}
          <div className="admin-footer">
            <div className="admin-footer-decoration"></div>
            <p className="admin-footer-text">
              Sistema de Administración Gubernamental
            </p>
            <p className="admin-footer-support">
              ¿Necesita asistencia técnica?{' '}
              <a href="mailto:soporte.ti@atlixco.gob.mx" className="admin-support-link">
                Contacte al Departamento de TI
              </a>
            </p>
          </div>
        </div>

        {/* Información de acceso de desarrollo */}
        <div className="admin-dev-info">
          <div className="dev-info-header">
            <div className="dev-info-badge">ENTORNO DE DESARROLLO</div>
          </div>
          <div className="dev-credentials">
            <p className="dev-title">Credenciales de Prueba:</p>
            <div className="dev-credential-row">
              <span className="dev-label">Usuario:</span>
              <code className="dev-value">admin@atlixco.gob.mx</code>
            </div>
            <div className="dev-credential-row">
              <span className="dev-label">Contraseña:</span>
              <code className="dev-value">Atlixco2024!</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}