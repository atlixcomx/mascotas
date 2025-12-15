'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Phone, Calendar, Heart, ArrowRight, Sparkles } from 'lucide-react'

const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

function GraciasContent() {
  const searchParams = useSearchParams()
  const dogName = searchParams.get('dog') || 'tu nuevo compañero'
  const dogImage = searchParams.get('image') || defaultDogImage
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const steps = [
    {
      icon: CheckCircle,
      title: 'Solicitud recibida',
      description: 'Tu información ha sido registrada',
      done: true
    },
    {
      icon: Phone,
      title: 'Te contactaremos',
      description: 'Por WhatsApp en las próximas 24-48 hrs',
      done: false
    },
    {
      icon: Calendar,
      title: 'Agendar visita',
      description: 'Coordinaremos una cita para conocer a ' + dogName,
      done: false
    },
    {
      icon: Heart,
      title: '¡Adopción!',
      description: 'Si todo sale bien, tendrás un nuevo miembro en la familia',
      done: false
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Elementos decorativos de fondo */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(191,181,145,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />

      {/* Partículas flotantes */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: i % 2 === 0 ? '#bfb591' : '#22c55e',
            borderRadius: '50%',
            opacity: 0.3,
            top: `${15 + i * 15}%`,
            left: `${10 + i * 15}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}

      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        {/* Badge de celebración */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '20px',
          padding: '8px 16px',
          marginBottom: '24px'
        }}>
          <Sparkles size={16} color="#22c55e" />
          <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: '600' }}>
            ¡Felicidades!
          </span>
        </div>

        {/* Foto del perrito con anillo animado */}
        <div style={{
          position: 'relative',
          width: '160px',
          height: '160px',
          margin: '0 auto 28px'
        }}>
          {/* Anillo exterior animado */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            right: '-8px',
            bottom: '-8px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#bfb591',
            borderRightColor: '#bfb591',
            animation: 'spin 3s linear infinite',
            opacity: 0.5
          }} />

          {/* Glow effect */}
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(191,181,145,0.2) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite'
          }} />

          <div style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid rgba(255,255,255,0.2)',
            position: 'relative',
            zIndex: 1
          }}>
            <Image
              src={dogImage}
              alt={dogName}
              width={160}
              height={160}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Check badge */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #0e312d',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
            zIndex: 2
          }}>
            <CheckCircle size={26} color="white" />
          </div>
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '12px',
          letterSpacing: '-0.5px'
        }}>
          ¡Solicitud Enviada!
        </h1>

        <p style={{
          fontSize: '17px',
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '36px',
          lineHeight: '1.6'
        }}>
          Gracias por tu interés en adoptar a{' '}
          <strong style={{
            color: '#bfb591',
            borderBottom: '2px solid rgba(191,181,145,0.3)',
            paddingBottom: '2px'
          }}>
            {dogName}
          </strong>
        </p>

        {/* Timeline de pasos */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '28px',
          textAlign: 'left',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#bfb591',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '2px',
              background: '#bfb591',
              borderRadius: '1px'
            }} />
            Siguientes pasos
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  opacity: step.done ? 1 : 0.7
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: step.done
                    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                    : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: step.done ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none'
                }}>
                  <step.icon
                    size={20}
                    color={step.done ? 'white' : 'rgba(255,255,255,0.4)'}
                  />
                </div>
                <div style={{ flex: 1, paddingTop: '4px' }}>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: step.done ? 'white' : 'rgba(255,255,255,0.7)',
                    margin: '0 0 4px 0'
                  }}>
                    {step.title}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.45)',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '47px',
                    marginTop: '44px',
                    width: '2px',
                    height: '20px',
                    background: step.done
                      ? 'linear-gradient(to bottom, #22c55e, rgba(255,255,255,0.1))'
                      : 'rgba(255,255,255,0.1)'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas del impacto */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {[
            { value: '286', label: 'Adopciones', icon: Heart },
            { value: '14,774', label: 'Esterilizaciones', icon: CheckCircle },
            { value: '2,207', label: 'Consultas', icon: Sparkles }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '16px 12px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <stat.icon
                size={18}
                color="#bfb591"
                style={{ marginBottom: '8px' }}
              />
              <p style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                margin: '0 0 4px 0'
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mensaje motivacional */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          Al adoptar, te unes a cientos de familias que han cambiado la vida de un animal.
        </p>

        {/* Botón de inicio */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          Volver al inicio
        </Link>

        {/* Footer sutil */}
        <p style={{
          marginTop: '32px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)'
        }}>
          Centro Municipal de Adopción y Bienestar Animal
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.2)',
          borderTopColor: '#bfb591',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  )
}
