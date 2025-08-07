'use client'

import React, { useState, useEffect } from 'react'
import { CloseIcon, HomeIcon, FormIcon, DogIcon, CheckCircleIcon } from '../icons/Icons'

interface AdoptionModalProps {
  isOpen: boolean
  onClose: () => void
  dogName?: string
  dogImage?: string
}

export default function AdoptionModal({ isOpen, onClose, dogName = "Rocky", dogImage }: AdoptionModalProps) {
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

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Aquí se enviaría la solicitud
    console.log('Solicitud enviada:', formData)
    alert('¡Solicitud enviada exitosamente! Te contactaremos pronto.')
    onClose()
  }

  if (!isOpen) return null

  const defaultDogImage = 'https://somosmaka.com/cdn/shop/articles/perro_mestizo.jpg?v=1697855331'

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="modal-content" style={{
        background: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        position: 'relative',
        animation: 'modalSlideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div className="modal-header" style={{
          background: 'linear-gradient(135deg, #6b3838 0%, #8b4848 100%)',
          color: 'white',
          padding: '24px 32px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <CloseIcon size={20} color="white" />
          </button>

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
              border: '3px solid rgba(255,255,255,0.3)'
            }}>
              <img 
                src={dogImage || defaultDogImage}
                alt={dogName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                margin: 0,
                marginBottom: '8px'
              }}>
                Solicitud de Adopción
              </h2>
              <p style={{
                fontSize: '18px',
                opacity: 0.9,
                margin: 0
              }}>
                Quiero adoptar a {dogName}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-container" style={{
          padding: '24px 32px',
          background: '#f8f9fa',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '500px',
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
                <span className="step-title" style={{
                  fontSize: '12px',
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

        {/* Content */}
        <div className="modal-body" style={{
          padding: '32px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          {/* Step 1: Información Personal */}
          {currentStep === 0 && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
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
              <div style={{ marginBottom: '20px' }}>
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
              <div style={{ marginBottom: '20px' }}>
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
              <div style={{ marginBottom: '20px' }}>
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
              <div style={{ marginBottom: '20px' }}>
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
              <div style={{ marginBottom: '20px' }}>
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
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                  ¿Por qué quieres adoptar a {dogName}? *
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
              <div style={{ marginBottom: '20px' }}>
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
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '16px'
                }}>
                  Compromisos de Adopción
                </h4>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
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
                      Me comprometo a cuidar a <strong>{dogName}</strong> de por vida, proporcionándole amor, cuidados y un hogar estable. *
                    </span>
                  </label>
                </div>
                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
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

        {/* Footer */}
        <div className="modal-footer" style={{
          padding: '24px 32px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  border: '2px solid #6b3838',
                  color: '#6b3838',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Anterior
              </button>
            )}
          </div>
          
          <div>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  background: '#6b3838',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  padding: '12px 24px',
                  background: '#22c55e',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CheckCircleIcon size={18} color="white" />
                Enviar Solicitud
              </button>
            )}
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #6b3838 !important;
            box-shadow: 0 0 0 3px rgba(107, 56, 56, 0.1);
          }
          
          @media (max-width: 768px) {
            .modal-container {
              margin: 10px !important;
              max-height: 95vh !important;
            }
            
            .modal-content {
              border-radius: 16px !important;
              max-width: 95vw !important;
            }
            
            .progress-container {
              padding: 16px 20px !important;
            }
            
            .step-title {
              font-size: 10px !important;
              max-width: 60px !important;
            }
            
            .modal-header {
              padding: 20px 24px !important;
            }
            
            .modal-body {
              padding: 24px 20px !important;
            }
            
            .modal-footer {
              padding: 20px 24px !important;
              flex-direction: column !important;
              gap: 16px !important;
            }
            
            .modal-footer button {
              width: 100% !important;
              justify-content: center !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}