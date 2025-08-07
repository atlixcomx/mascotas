'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { usePerrito } from '../../../hooks/usePerritos'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import ErrorMessage from '../../../components/ui/ErrorMessage'
import { 
  CloseIcon, HomeIcon, FormIcon, DogIcon, CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon
} from '../../../components/icons/Icons'

interface PageProps {
  params: { slug: string }
}

const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

export default function SolicitudAdopcionPage({ params }: PageProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Información personal
    nombre: '',
    apellidos: '',
    edad: '',
    telefono: '',
    email: '',
    direccion: '',
    
    // Información del hogar
    tipoVivienda: '',
    espacioExterior: '',
    tiempoSolo: '',
    experienciaPerros: '',
    otrosMascotas: '',
    
    // Motivación
    motivacion: '',
    comprometimiento: false,
    visitasVeterinario: false,
    tiempoDisponible: ''
  })

  const {
    perrito,
    loading,
    error,
    notFound: perritoNotFound
  } = usePerrito(params.slug)

  const steps = [
    {
      title: "Información Personal",
      icon: FormIcon,
      fields: ['nombre', 'apellidos', 'edad', 'telefono', 'email', 'direccion']
    },
    {
      title: "Tu Hogar",
      icon: HomeIcon, 
      fields: ['tipoVivienda', 'espacioExterior', 'tiempoSolo', 'experienciaPerros', 'otrosMascotas']
    },
    {
      title: "Motivación y Compromiso",
      icon: DogIcon,
      fields: ['motivacion', 'comprometimiento', 'visitasVeterinario', 'tiempoDisponible']
    }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = () => {
    // Aquí se enviaría la solicitud
    console.log('Solicitud enviada:', formData)
    alert('¡Solicitud enviada exitosamente! Te contactaremos pronto.')
    router.push(`/perritos/${params.slug}`)
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

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <ErrorMessage error={error} />
      </div>
    )
  }

  if (perritoNotFound || !perrito) {
    notFound()
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header con información del perrito */}
      <div style={{
        background: 'linear-gradient(135deg, #6b3838 0%, #8b4848 100%)',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <Link
            href={`/perritos/${params.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeftIcon size={24} color="white" />
          </Link>

          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.3)',
            flexShrink: 0
          }}>
            <Image 
              src={perrito.fotoPrincipal || defaultDogImage}
              alt={perrito.nombre}
              width={60}
              height={60}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: '700',
              margin: 0,
              marginBottom: '4px'
            }}>
              Solicitud de Adopción
            </h1>
            <p style={{
              fontSize: '16px',
              opacity: 0.9,
              margin: 0
            }}>
              Quiero adoptar a {perrito.nombre}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: '88px',
        zIndex: 9
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative'
          }}>
            {/* Progress bar background */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              height: '3px',
              background: '#e5e7eb',
              borderRadius: '2px',
              zIndex: 1
            }} />
            
            {/* Progress bar fill */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 20px + ${20 * currentStep / (steps.length - 1)}px)`,
              height: '3px',
              background: '#6b3838',
              borderRadius: '2px',
              zIndex: 2,
              transition: 'width 0.3s ease'
            }} />

            {steps.map((step, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 3
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: index <= currentStep ? '#6b3838' : 'white',
                  border: `3px solid ${index <= currentStep ? '#6b3838' : '#e5e7eb'}`,
                  color: index <= currentStep ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  transition: 'all 0.3s',
                  marginBottom: '8px'
                }}>
                  {index < currentStep ? (
                    <CheckCircleIcon size={18} color="white" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span style={{
                  fontSize: 'clamp(10px, 2vw, 12px)',
                  fontWeight: '600',
                  color: index <= currentStep ? '#6b3838' : '#9ca3af',
                  textAlign: 'center',
                  maxWidth: '80px',
                  lineHeight: '1.2'
                }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          marginBottom: '24px'
        }}>
          {/* Step 1: Información Personal */}
          {currentStep === 0 && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <FormIcon size={28} color="#6b3838" />
                Información Personal
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                marginBottom: '24px'
              }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange('apellidos', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Tus apellidos"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Edad *
                  </label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) => handleInputChange('edad', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Tu edad"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Tu teléfono"
                  />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Dirección *
                </label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Tu dirección completa"
                />
              </div>
            </div>
          )}

          {/* Step 2: Tu Hogar */}
          {currentStep === 1 && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <HomeIcon size={28} color="#6b3838" />
                Tu Hogar
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  Tipo de vivienda *
                </label>
                <select
                  value={formData.tipoVivienda}
                  onChange={(e) => handleInputChange('tipoVivienda', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecciona...</option>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="condominio">Condominio</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  ¿Tienes patio o jardín? *
                </label>
                <select
                  value={formData.espacioExterior}
                  onChange={(e) => handleInputChange('espacioExterior', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecciona...</option>
                  <option value="patio-grande">Patio grande</option>
                  <option value="patio-pequeno">Patio pequeño</option>
                  <option value="balcon">Balcón</option>
                  <option value="no">No tengo espacio exterior</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  ¿Cuánto tiempo estaría solo el perro al día? *
                </label>
                <select
                  value={formData.tiempoSolo}
                  onChange={(e) => handleInputChange('tiempoSolo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecciona...</option>
                  <option value="nunca">Nunca, siempre hay alguien</option>
                  <option value="1-4-horas">1-4 horas</option>
                  <option value="4-8-horas">4-8 horas</option>
                  <option value="mas-8-horas">Más de 8 horas</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  ¿Has tenido perros antes? *
                </label>
                <textarea
                  value={formData.experienciaPerros}
                  onChange={(e) => handleInputChange('experienciaPerros', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Cuéntanos sobre tu experiencia con perros..."
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  ¿Tienes otras mascotas?
                </label>
                <textarea
                  value={formData.otrosMascotas}
                  onChange={(e) => handleInputChange('otrosMascotas', e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe tus otras mascotas (si las tienes)..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Motivación y Compromiso */}
          {currentStep === 2 && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <DogIcon size={28} color="#6b3838" />
                Motivación y Compromiso
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  ¿Por qué quieres adoptar a {perrito.nombre}? *
                </label>
                <textarea
                  value={formData.motivacion}
                  onChange={(e) => handleInputChange('motivacion', e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Cuéntanos tu motivación para adoptar..."
                />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  ¿Cuánto tiempo puedes dedicarle diariamente?
                </label>
                <select
                  value={formData.tiempoDisponible}
                  onChange={(e) => handleInputChange('tiempoDisponible', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Selecciona...</option>
                  <option value="1-2-horas">1-2 horas</option>
                  <option value="2-4-horas">2-4 horas</option>
                  <option value="4-6-horas">4-6 horas</option>
                  <option value="todo-el-dia">Todo el día</option>
                </select>
              </div>
              
              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px',
                border: '2px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '20px'
                }}>
                  Compromisos de Adopción
                </h3>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#374151',
                    lineHeight: '1.5'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.comprometimiento}
                      onChange={(e) => handleInputChange('comprometimiento', e.target.checked)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#6b3838',
                        marginTop: '2px',
                        flexShrink: 0
                      }}
                    />
                    <span style={{ flex: 1 }}>
                      Me comprometo a cuidar a <strong>{perrito.nombre}</strong> de por vida, proporcionándole amor, cuidados y un hogar estable. *
                    </span>
                  </label>
                </div>
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#374151',
                    lineHeight: '1.5'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.visitasVeterinario}
                      onChange={(e) => handleInputChange('visitasVeterinario', e.target.checked)}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#6b3838',
                        marginTop: '2px',
                        flexShrink: 0
                      }}
                    />
                    <span style={{ flex: 1 }}>
                      Me comprometo a llevarlo al veterinario cuando sea necesario y mantener su salud al día. *
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons - Always visible at bottom */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          position: 'sticky',
          bottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  background: 'white',
                  border: '2px solid #6b3838',
                  color: '#6b3838',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ArrowLeftIcon size={18} />
                Anterior
              </button>
            )}
          </div>
          
          <div>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  background: '#6b3838',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Siguiente
                <ArrowRightIcon size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 24px',
                  background: '#22c55e',
                  border: 'none',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <CheckCircleIcon size={18} color="white" />
                Enviar Solicitud
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #6b3838 !important;
          box-shadow: 0 0 0 3px rgba(107, 56, 56, 0.1);
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        @media (max-width: 768px) {
          .navigation-buttons {
            flex-direction: column-reverse !important;
            gap: 12px !important;
          }
          
          .navigation-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  )
}