'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import '../admin-global.css'
import styles from './login.module.css'

export default function AdminLoginRefactored() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'
  
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
        // Login exitoso, redirigir
        router.push(callbackUrl)
      }
    } catch (err) {
      setError('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          🏛️
        </div>
        
        <h1 className={styles.title}>
          GOBIERNO DE ATLIXCO
        </h1>
        <p className={styles.subtitle}>
          Portal Administrativo - Centro de Adopción
        </p>
        
        <div className={`${styles.statusBanner} ${loading ? styles.loading : styles.success}`}>
          <div className={`${styles.statusTitle} ${loading ? styles.loading : styles.success}`}>
            {loading ? '🔄 PROCESANDO...' : '✅ SISTEMA OPERATIVO'}
          </div>
          <div className={`${styles.statusText} ${loading ? styles.loading : styles.success}`}>
            {loading ? 'Verificando credenciales administrativas' : 'Sistema protegido con autenticación segura'}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@atlixco.gob.mx"
              className={styles.input}
              disabled={loading}
              aria-label="Correo electrónico institucional"
              autoComplete="email"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <div className={styles.passwordContainer}>
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••"
                className={`${styles.input} ${styles.passwordInput}`}
                disabled={loading}
                aria-label="Contraseña de acceso"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className={styles.passwordToggle}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className={styles.errorContainer} role="alert">
              <div className={styles.errorText}>
                ⚠️ {error}
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : styles.idle}`}
            aria-label={loading ? 'Verificando credenciales' : 'Iniciar sesión en el sistema'}
          >
            {loading ? (
              <>
                <div className={styles.spinner} aria-hidden="true" />
                VERIFICANDO CREDENCIALES...
              </>
            ) : (
              <>
                🔐 ACCEDER AL SISTEMA GUBERNAMENTAL
              </>
            )}
          </button>
        </form>
        
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>
            🔐 Sistema de Autenticación Activo
          </div>
          <div className={styles.infoText}>
            NextAuth integrado y funcional. Use las credenciales institucionales 
            para acceder al panel administrativo completo.
          </div>
        </div>
        
        <div className={styles.footer}>
          Sistema de Gestión Municipal<br/>
          Gobierno de Atlixco, Puebla<br/>
          <strong>Soporte:</strong> soporte.ti@atlixco.gob.mx
        </div>
      </div>
    </div>
  )
}