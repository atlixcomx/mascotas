'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { 
  Shield, Lock, User, ArrowRight, 
  Eye, EyeOff, AlertCircle, CheckCircle,
  Sparkles, Activity, Building2, Dog
} from 'lucide-react'
import styles from './modern-login.module.css'

export default function ModernAdminLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [mounted, setMounted] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'

  useEffect(() => {
    setMounted(true)
    // Precargar la imagen del fondo
    const img = new window.Image()
    img.src = '/centroB.png'
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setError('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Panel Izquierdo - Formulario */}
      <div className={styles.leftPanel}>
        <div className={styles.formContainer}>
          {/* Logo y Título */}
          <div className={styles.header}>
            <div className={styles.logoContainer}>
              <div className={styles.logoGradient}>
                <Shield className={styles.logoIcon} />
              </div>
            </div>
            <h1 className={styles.title}>Panel Administrativo</h1>
            <p className={styles.subtitle}>Centro de Bienestar Animal de Atlixco</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Correo Electrónico
              </label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="admin@atlixco.gob.mx"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Contraseña
              </label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Recordar sesión</span>
              </label>
              <a href="#" className={styles.forgotLink}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={styles.footer}>
            <p>© 2025 H. Ayuntamiento de Atlixco</p>
            <p className={styles.securityNote}>
              <Lock size={14} />
              Conexión segura y encriptada
            </p>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Visual */}
      <div className={styles.rightPanel}>
        <div className={styles.overlay}>
          <div className={styles.rightContent}>
            <div className={styles.statsCard}>
              <Dog size={32} />
              <div>
                <h3>+500</h3>
                <p>Mascotas Rescatadas</p>
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <CheckCircle size={32} />
              <div>
                <h3>+350</h3>
                <p>Adopciones Exitosas</p>
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <Building2 size={32} />
              <div>
                <h3>+50</h3>
                <p>Comercios Pet Friendly</p>
              </div>
            </div>
            
            <div className={styles.statsCard}>
              <Activity size={32} />
              <div>
                <h3>24/7</h3>
                <p>Atención Continua</p>
              </div>
            </div>
          </div>
          
          <div className={styles.rightFooter}>
            <h2>Sistema de Gestión Integral</h2>
            <p>Transformando vidas, una mascota a la vez</p>
          </div>
        </div>
      </div>
    </div>
  )
}