'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Clock, ChevronRight, Tag, Users } from 'lucide-react'

interface Noticia {
  id: string
  titulo: string
  resumen: string
  contenido: string
  imagen: string
  fecha: string
  categoria: 'evento' | 'adopcion' | 'salud' | 'general'
  ubicacion?: string
  hora?: string
  aforo?: number
}

// Datos de ejemplo - en producción vendrían de la API
const noticiasEjemplo: Noticia[] = [
  {
    id: '1',
    titulo: 'Gran Feria de Adopción de Verano 2025',
    resumen: 'Ven este sábado a conocer a más de 50 perritos que buscan hogar. Habrá actividades para toda la familia.',
    contenido: 'El Centro Municipal de Adopción y Bienestar Animal invita a toda la comunidad de Atlixco a participar en nuestra Gran Feria de Adopción de Verano...',
    imagen: '/images/centro/foto0.jpeg',
    fecha: '2025-01-25',
    categoria: 'evento',
    ubicacion: 'Plaza Principal de Atlixco',
    hora: '10:00 - 17:00',
    aforo: 500
  },
  {
    id: '2',
    titulo: 'Campaña de Esterilización Gratuita',
    resumen: 'Durante todo el mes de febrero, ofrecemos esterilizaciones gratuitas para perros y gatos.',
    contenido: 'Como parte de nuestro compromiso con el bienestar animal, el Centro Municipal ofrece esterilizaciones gratuitas...',
    imagen: '/images/centro/Foto2.jpeg',
    fecha: '2025-02-01',
    categoria: 'salud',
    ubicacion: 'Centro Municipal de Adopción',
    hora: '09:00 - 14:00'
  },
  {
    id: '3',
    titulo: 'Historia de Éxito: Max encuentra su hogar',
    resumen: 'Después de 6 meses en el centro, Max finalmente encontró una familia amorosa.',
    contenido: 'Max llegó a nuestro centro en condiciones difíciles, pero gracias al trabajo de nuestro equipo...',
    imagen: '/images/centro/foto1.jpeg',
    fecha: '2025-01-15',
    categoria: 'adopcion'
  }
]

const categoriasColores = {
  evento: { bg: '#dc2626', text: 'Evento' },
  adopcion: { bg: '#16a34a', text: 'Adopción' },
  salud: { bg: '#0891b2', text: 'Salud' },
  general: { bg: '#6b7280', text: 'General' }
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas')

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setNoticias(noticiasEjemplo)
      setLoading(false)
    }, 500)
  }, [])

  const noticiasFiltradas = categoriaFiltro === 'todas' 
    ? noticias 
    : noticias.filter(n => n.categoria === categoriaFiltro)

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header de la página */}
      <section style={{
        background: 'linear-gradient(135deg, #0e312d 0%, #1a4a45 100%)',
        padding: '80px 20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            marginBottom: '16px'
          }}>
            Noticias y Eventos
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: '1.6'
          }}>
            Mantente informado sobre las actividades, eventos y campañas del Centro Municipal
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section style={{ padding: '40px 20px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            <button
              onClick={() => setCategoriaFiltro('todas')}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: categoriaFiltro === 'todas' ? '#0e312d' : 'white',
                color: categoriaFiltro === 'todas' ? 'white' : '#0e312d',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Todas las noticias
            </button>
            {Object.entries(categoriasColores).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setCategoriaFiltro(key)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '24px',
                  border: 'none',
                  backgroundColor: categoriaFiltro === key ? value.bg : 'white',
                  color: categoriaFiltro === key ? 'white' : '#0e312d',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {value.text}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de noticias */}
      <section style={{ padding: '20px 20px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: '#666' }}>Cargando noticias...</p>
            </div>
          ) : noticiasFiltradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: '#666' }}>No hay noticias en esta categoría</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '32px'
            }}>
              {noticiasFiltradas.map((noticia) => (
                <article
                  key={noticia.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                >
                  {/* Imagen */}
                  <div style={{
                    height: '240px',
                    backgroundColor: '#e5e7eb',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: categoriasColores[noticia.categoria].bg,
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {categoriasColores[noticia.categoria].text}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div style={{
                    padding: '24px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#0e312d',
                      marginBottom: '12px',
                      lineHeight: '1.3'
                    }}>
                      {noticia.titulo}
                    </h3>

                    <p style={{
                      color: '#666',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      flex: 1
                    }}>
                      {noticia.resumen}
                    </p>

                    {/* Metadatos */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} />
                        {formatearFecha(noticia.fecha)}
                      </div>
                      {noticia.ubicacion && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={16} />
                          {noticia.ubicacion}
                        </div>
                      )}
                      {noticia.hora && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={16} />
                          {noticia.hora}
                        </div>
                      )}
                      {noticia.aforo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={16} />
                          {noticia.aforo} personas
                        </div>
                      )}
                    </div>

                    {/* Link para leer más */}
                    <div style={{
                      color: '#0e312d',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '15px'
                    }}>
                      Leer más <ChevronRight size={18} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA para eventos */}
      <section style={{
        backgroundColor: '#0e312d',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            ¿Quieres participar en nuestros eventos?
          </h2>
          <p style={{
            fontSize: '18px',
            marginBottom: '24px',
            color: 'rgba(255,255,255,0.9)'
          }}>
            Únete como voluntario o asiste a nuestras ferias de adopción
          </p>
          <Link href="/contacto" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#bfb591',
            color: '#0e312d',
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}>
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  )
}