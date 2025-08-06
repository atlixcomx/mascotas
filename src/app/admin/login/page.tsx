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
    <div className="admin-login-container">
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

      <div className="admin-login-wrapper">
        <div className="admin-login-card">
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
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label className="admin-label">
                Correo Institucional
              </label>
              <div className="admin-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input"
                  placeholder="administrador@atlixco.gob.mx"
                  required
                  autoComplete="email"
                />
                <div className="admin-input-border"></div>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                Contraseña de Acceso
              </label>
              <div className="admin-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input admin-input-password"
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
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