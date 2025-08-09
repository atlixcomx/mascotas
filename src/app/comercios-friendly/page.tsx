'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Store,
  Coffee,
  Trees,
  Utensils,
  ShoppingBag,
  Hotel,
  Stethoscope,
  Building2,
  MapPin,
  Phone,
  Filter,
  Search,
  Shield,
  ChevronRight,
  Award
} from 'lucide-react'

interface Comercio {
  id: string
  nombre: string
  slug: string
  categoria: string
  logo: string | null
  descripcion: string
  direccion: string
  telefono: string
  servicios: string | string[]
  certificado: boolean
  fechaCert: string | null
}

const categoriaConfig = {
  veterinaria: { 
    icon: Stethoscope, 
    color: '#dc2626', 
    bg: '#fee2e2', 
    label: 'Veterinaria'
  },
  petshop: { 
    icon: ShoppingBag, 
    color: '#9333ea', 
    bg: '#faf5ff', 
    label: 'Pet Shop'
  },
  hotel: { 
    icon: Hotel, 
    color: '#0891b2', 
    bg: '#e0f2fe', 
    label: 'Hotel Pet Friendly'
  },
  restaurante: { 
    icon: Utensils, 
    color: '#ea580c', 
    bg: '#fed7aa', 
    label: 'Restaurante'
  },
  cafe: { 
    icon: Coffee, 
    color: '#84cc16', 
    bg: '#ecfccb', 
    label: 'Cafetería'
  },
  parque: { 
    icon: Trees, 
    color: '#16a34a', 
    bg: '#dcfce7', 
    label: 'Parque'
  },
  otro: { 
    icon: Store, 
    color: '#6b7280', 
    bg: '#f3f4f6', 
    label: 'Otro'
  }
}

export default function ComerciosFriendlyPage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [filteredComercios, setFilteredComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('todos')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchComercios()
  }, [])

  useEffect(() => {
    filterComercios()
  }, [searchTerm, selectedCategoria, comercios])

  const fetchComercios = async () => {
    try {
      const response = await fetch('/api/comercios?certificado=true&limit=100')
      if (response.ok) {
        const data = await response.json()
        setComercios(data.comercios || [])
        setFilteredComercios(data.comercios || [])
      }
    } catch (error) {
      console.error('Error fetching comercios:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterComercios = () => {
    let filtered = comercios

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(comercio => {
        const serviciosText = Array.isArray(comercio.servicios) 
          ? comercio.servicios.join(' ') 
          : comercio.servicios
        return (
          comercio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comercio.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          serviciosText.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    // Filtrar por categoría
    if (selectedCategoria !== 'todos') {
      filtered = filtered.filter(comercio => comercio.categoria === selectedCategoria)
    }

    setFilteredComercios(filtered)
  }

  const categoriaStats = comercios.reduce((acc, comercio) => {
    acc[comercio.categoria] = (acc[comercio.categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 50%, #246257 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`
        }} />
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '80px 20px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <Store size={40} color="white" />
            </div>
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: '800',
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}>
              Comercios Pet Friendly Certificados
            </h1>
            <p style={{
              fontSize: 'clamp(18px, 2vw, 22px)',
              opacity: 0.9,
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Descubre los mejores lugares que dan la bienvenida a tu mascota con servicios especializados y atención de calidad
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '32px',
              justifyContent: 'center',
              marginTop: '48px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px 32px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '800' }}>{comercios.length}</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Comercios Certificados</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px 32px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '800' }}>{Object.keys(categoriaStats).length}</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Categorías</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: '88px',
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Search Bar */}
            <div style={{
              flex: 1,
              minWidth: '300px',
              position: 'relative'
            }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} />
              <input
                type="text"
                placeholder="Buscar por nombre, dirección o servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: showFilters ? '#3b82f6' : 'white',
                color: showFilters ? 'white' : '#374151',
                border: `2px solid ${showFilters ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Filter size={20} />
              Filtros
              {selectedCategoria !== 'todos' && (
                <span style={{
                  backgroundColor: showFilters ? 'rgba(255,255,255,0.2)' : '#3b82f6',
                  color: showFilters ? 'white' : 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>1</span>
              )}
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setSelectedCategoria('todos')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: selectedCategoria === 'todos' ? '#3b82f6' : '#e5e7eb',
                    backgroundColor: selectedCategoria === 'todos' ? '#eff6ff' : 'white',
                    color: selectedCategoria === 'todos' ? '#3b82f6' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Todos ({comercios.length})
                </button>
                {Object.entries(categoriaConfig).map(([key, config]) => {
                  const count = categoriaStats[key] || 0
                  if (count === 0) return null
                  const Icon = config.icon
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategoria(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: selectedCategoria === key ? config.color : '#e5e7eb',
                        backgroundColor: selectedCategoria === key ? config.bg : 'white',
                        color: selectedCategoria === key ? config.color : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon size={16} />
                      {config.label} ({count})
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px'
          }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '3px solid #f3f4f6',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{
              marginTop: '16px',
              color: '#6b7280',
              fontSize: '16px'
            }}>Cargando comercios...</p>
          </div>
        ) : filteredComercios.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px'
          }}>
            <Store size={64} style={{ color: '#e5e7eb', margin: '0 auto 16px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>No se encontraron comercios</h3>
            <p style={{
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {searchTerm || selectedCategoria !== 'todos'
                ? 'Intenta con otros filtros de búsqueda'
                : 'No hay comercios certificados disponibles'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {filteredComercios.map((comercio) => {
              const categoria = categoriaConfig[comercio.categoria as keyof typeof categoriaConfig] || categoriaConfig.otro
              const Icon = categoria.icon
              
              return (
                <Link
                  key={comercio.id}
                  href={`/comercios/${comercio.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {/* Certification Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                    }}>
                      <Shield size={14} />
                      Certificado
                    </div>

                    {/* Header with logo */}
                    <div style={{
                      padding: '24px',
                      backgroundColor: categoria.bg,
                      borderBottom: `1px solid ${categoria.bg}`
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                      }}>
                        <div style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '12px',
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          {comercio.logo ? (
                            <Image
                              src={comercio.logo}
                              alt={comercio.nombre}
                              width={48}
                              height={48}
                              style={{ objectFit: 'contain' }}
                            />
                          ) : (
                            <Icon size={32} style={{ color: categoria.color }} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#111827',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {comercio.nombre}
                          </h3>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: categoria.color,
                            backgroundColor: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px'
                          }}>
                            <Icon size={14} />
                            {categoria.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{
                      padding: '24px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        lineHeight: '1.6',
                        marginBottom: '8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {comercio.descripcion}
                      </p>

                      {/* Services */}
                      <div style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        padding: '12px',
                        fontSize: '13px',
                        color: '#4b5563',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        <strong style={{ color: '#374151' }}>Servicios:</strong><br />
                        {Array.isArray(comercio.servicios) 
                          ? comercio.servicios.join(', ') 
                          : comercio.servicios}
                      </div>

                      {/* Location and Phone */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginTop: 'auto',
                        paddingTop: '16px',
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          <MapPin size={14} />
                          <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{comercio.direccion}</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          <Phone size={14} />
                          {comercio.telefono}
                        </div>
                      </div>

                      {/* View Details Button */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '16px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          Ver detalles
                          <ChevronRight size={16} />
                        </span>
                        <Award size={20} style={{ color: '#fbbf24' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}