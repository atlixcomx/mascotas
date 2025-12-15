'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { usePerrito } from '../../../hooks/usePerritos'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import { ArrowLeftIcon, CheckCircleIcon } from '../../../components/icons/Icons'
import { Phone, Mail, User, Heart, MessageCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

export default function SolicitudAdopcionPage({ params }: PageProps) {
  const { slug } = use(params)
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    whatsapp: '',
    email: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    perrito,
    loading,
    error,
    notFound: perritoNotFound
  } = usePerrito(slug)

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10
  }

  const validateEmail = (email: string) => {
    if (!email) return true // Email es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (field: string, value: string) => {
    // Para WhatsApp, solo permitir números y limitar a 10 dígitos
    if (field === 'whatsapp') {
      const onlyNumbers = value.replace(/\D/g, '')
      if (onlyNumbers.length <= 10) {
        setFormData(prev => ({ ...prev, [field]: onlyNumbers }))
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    setSubmitError('')
  }

  const getDigitCount = () => {
    return formData.whatsapp.replace(/\D/g, '').length
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'El WhatsApp es requerido'
    } else if (!validatePhone(formData.whatsapp)) {
      newErrors.whatsapp = 'Ingresa exactamente 10 dígitos'
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/contacto-adopcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          perritoId: perrito.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Redirigir a página de gracias con URL de WhatsApp
        const thankYouUrl = `/solicitud-adopcion/gracias?dog=${encodeURIComponent(perrito.nombre)}&image=${encodeURIComponent(perrito.fotoPrincipal || defaultDogImage)}&whatsapp=${encodeURIComponent(data.whatsappUrl || '')}`
        router.push(thankYouUrl)
      } else {
        setSubmitError(data.error || 'Error al enviar la solicitud')
      }
    } catch (error) {
      setSubmitError('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <LoadingSpinner size="lg" text="Cargando información..." />
      </div>
    )
  }

  if (error || perritoNotFound || !perrito) {
    notFound()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        color: 'white',
        padding: 'clamp(24px, 5vw, 40px) 20px'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <Link
            href={`/catalogo/${slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              fontSize: '14px',
              marginBottom: '20px'
            }}
          >
            <ArrowLeftIcon size={18} color="rgba(255,255,255,0.8)" />
            Volver al perfil
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '3px solid rgba(255,255,255,0.3)',
              flexShrink: 0
            }}>
              <Image
                src={perrito.fotoPrincipal || defaultDogImage}
                alt={perrito.nombre}
                width={80}
                height={80}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <h1 style={{
                fontSize: 'clamp(24px, 5vw, 32px)',
                fontWeight: '700',
                margin: 0,
                marginBottom: '4px'
              }}>
                Adoptar a {perrito.nombre}
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#bfb591',
                margin: 0
              }}>
                Completa tus datos y te contactaremos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario Simple */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: 'clamp(24px, 5vw, 40px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Heart size={32} color="#22c55e" />
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0e312d',
              margin: 0,
              marginBottom: '8px'
            }}>
              Deja tus datos de contacto
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0
            }}>
              El equipo del centro te contactará por WhatsApp para continuar con el proceso
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <User size={16} />
                Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Tu nombre"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${errors.nombre ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0e312d'}
                onBlur={(e) => e.target.style.borderColor = errors.nombre ? '#ef4444' : '#e5e7eb'}
              />
              {errors.nombre && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', margin: '4px 0 0' }}>
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Apellido */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <User size={16} />
                Apellido *
              </label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                placeholder="Tu apellido"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${errors.apellido ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0e312d'}
                onBlur={(e) => e.target.style.borderColor = errors.apellido ? '#ef4444' : '#e5e7eb'}
              />
              {errors.apellido && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', margin: '4px 0 0' }}>
                  {errors.apellido}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={16} />
                  WhatsApp *
                </span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: getDigitCount() === 10 ? '#22c55e' : '#9ca3af'
                }}>
                  {getDigitCount()}/10 dígitos
                </span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="Ej: 2441234567"
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${errors.whatsapp ? '#ef4444' : getDigitCount() === 10 ? '#22c55e' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  letterSpacing: '1px'
                }}
                onFocus={(e) => e.target.style.borderColor = getDigitCount() === 10 ? '#22c55e' : '#0e312d'}
                onBlur={(e) => e.target.style.borderColor = errors.whatsapp ? '#ef4444' : getDigitCount() === 10 ? '#22c55e' : '#e5e7eb'}
              />
              {errors.whatsapp && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', margin: '4px 0 0' }}>
                  {errors.whatsapp}
                </p>
              )}
            </div>

            {/* Email (opcional) */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <Mail size={16} />
                Correo electrónico <span style={{ fontWeight: '400', color: '#9ca3af' }}>(opcional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="tu@correo.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0e312d'}
                onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb'}
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '4px', margin: '4px 0 0' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Error general */}
            {submitError && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>
                  {submitError}
                </p>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: isSubmitting ? '#94a3b8' : '#0e312d',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircleIcon size={20} color="white" />
                  Enviar solicitud
                </>
              )}
            </button>
          </form>

          {/* Nota informativa */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            border: '1px solid #bbf7d0'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#166534',
              margin: 0,
              lineHeight: '1.5'
            }}>
              <strong>Siguiente paso:</strong> Una vez enviada tu solicitud, el equipo del Centro Municipal de Adopción te contactará por WhatsApp para agendar una visita y conocer a {perrito.nombre}.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
