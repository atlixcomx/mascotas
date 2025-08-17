'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Calendar, MapPin, Clock, ChevronLeft, Tag, Users, 
  Share2, Facebook, Copy, Check, Instagram
} from 'lucide-react'

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
  autor?: string
  imagenes?: string[]
}

// Datos de ejemplo - en producción vendrían de la API
const noticiasEjemplo: Noticia[] = [
  {
    id: '1',
    titulo: 'Gran Feria de Adopción de Verano 2025',
    resumen: 'Ven este sábado a conocer a más de 50 perritos que buscan hogar. Habrá actividades para toda la familia.',
    contenido: `El Centro Municipal de Adopción y Bienestar Animal de Atlixco se complace en invitar a toda la comunidad a participar en nuestra Gran Feria de Adopción de Verano 2025, un evento que promete ser una experiencia inolvidable para toda la familia.

Este evento especial reunirá a más de 50 adorables perritos que han sido rescatados, rehabilitados y están listos para encontrar un hogar lleno de amor. Cada uno de estos animales ha pasado por nuestro protocolo veterinario completo de 5 etapas, garantizando que están en óptimas condiciones de salud.

Durante la feria, los visitantes podrán:

• Conocer personalmente a todos los perritos disponibles para adopción
• Recibir asesoría personalizada de nuestro equipo de expertos
• Participar en talleres sobre cuidado responsable de mascotas
• Disfrutar de actividades recreativas para niños y adultos
• Conocer a los comercios pet-friendly de Atlixco

Nuestro equipo de veterinarios estará presente para resolver todas tus dudas sobre el cuidado de las mascotas, y nuestros voluntarios te ayudarán a encontrar el compañero perfecto para tu familia.

Si estás considerando adoptar, te recomendamos traer:
- Identificación oficial
- Comprobante de domicilio
- Una transportadora o correa (si decides adoptar ese mismo día)

La adopción es completamente gratuita e incluye:
- Mascota esterilizada
- Vacunas al día
- Desparasitación completa
- Certificado de salud
- Seguimiento post-adopción

¡No te pierdas esta oportunidad de cambiar una vida y encontrar a tu nuevo mejor amigo!`,
    imagen: '/images/centro/foto0.jpeg',
    fecha: '2025-01-25',
    categoria: 'evento',
    ubicacion: 'Plaza Principal de Atlixco',
    hora: '10:00 - 17:00',
    aforo: 500,
    autor: 'Dirección de Bienestar Animal',
    imagenes: ['/images/centro/foto1.jpeg', '/images/centro/Foto2.jpeg']
  },
  {
    id: '2',
    titulo: 'Campaña de Esterilización Gratuita',
    resumen: 'Durante todo el mes de febrero, ofrecemos esterilizaciones gratuitas para perros y gatos.',
    contenido: `Como parte de nuestro compromiso con el bienestar animal y el control poblacional responsable, el Centro Municipal de Adopción y Bienestar Animal de Atlixco anuncia su Campaña de Esterilización Gratuita durante todo el mes de febrero de 2025.

La sobrepoblación de animales en situación de calle es uno de los principales retos que enfrentamos como sociedad. La esterilización es la forma más efectiva y humanitaria de controlar esta problemática, además de proporcionar importantes beneficios de salud para tu mascota.

Beneficios de la esterilización:

Para hembras:
• Previene tumores mamarios y cáncer de útero
• Elimina el celo y los sangrados
• Evita embarazos no deseados
• Reduce el comportamiento territorial

Para machos:
• Previene el cáncer testicular y prostático
• Reduce la agresividad y el marcaje territorial
• Disminuye el deseo de escapar de casa
• Mejora la convivencia con otros animales

Requisitos para acceder al programa:
• Ser residente de Atlixco (presentar comprobante de domicilio)
• Mascota mayor a 4 meses de edad
• Ayuno de 12 horas antes de la cirugía
• Presentar cartilla de vacunación (si la tiene)

El procedimiento es completamente seguro y es realizado por nuestro equipo de veterinarios certificados. La recuperación es rápida y tu mascota podrá regresar a casa el mismo día con indicaciones claras para su cuidado post-operatorio.

Agenda tu cita llamando al 244-445-8765 o visitando nuestras instalaciones. Los espacios son limitados, así que te recomendamos apartar tu lugar lo antes posible.

¡Juntos podemos hacer de Atlixco una ciudad más responsable con los animales!`,
    imagen: '/images/centro/Foto2.jpeg',
    fecha: '2025-02-01',
    categoria: 'salud',
    ubicacion: 'Centro Municipal de Adopción',
    hora: '09:00 - 14:00',
    autor: 'Departamento Veterinario'
  },
  {
    id: '3',
    titulo: 'Historia de Éxito: Max encuentra su hogar',
    resumen: 'Después de 6 meses en el centro, Max finalmente encontró una familia amorosa.',
    contenido: `Hoy queremos compartir con ustedes una historia que nos llena el corazón de alegría y nos recuerda por qué hacemos lo que hacemos: la historia de Max, un perrito que después de 6 meses de espera, finalmente encontró su hogar para siempre.

Max llegó a nuestro centro en julio de 2024, en condiciones que partían el corazón. Fue rescatado de las calles del centro de Atlixco, desnutrido, con sarna y una herida en su pata trasera. Pero lo que más nos impactó fue ver que, a pesar de todo lo que había sufrido, Max movía su colita cada vez que alguien se acercaba.

Su proceso de recuperación fue largo pero exitoso. Nuestro equipo veterinario trabajó incansablemente para sanar sus heridas físicas, mientras que nuestros voluntarios se encargaron de sanar las emocionales con mucho amor y paciencia.

Durante los meses siguientes, Max se convirtió en el favorito del centro. Su personalidad juguetona y cariñosa conquistaba a todos los que lo conocían. Sin embargo, por alguna razón, las familias que venían a adoptar siempre elegían a otros perritos.

Todo cambió el 15 de enero de 2025, cuando la familia González visitó nuestro centro. Su hijo de 8 años, Diego, había estado pidiendo un perrito durante meses, y sus padres finalmente decidieron que era el momento correcto. 

"Cuando Diego vio a Max, fue amor a primera vista", nos cuenta la Sra. González. "Se sentó en el piso y Max inmediatamente se acurrucó en su regazo. En ese momento supimos que era él".

La adopción se completó ese mismo día, y las fotos que la familia nos ha compartido muestran a un Max completamente transformado: feliz, saludable y rodeado de amor.

Esta historia es un recordatorio de que cada perrito en nuestro centro está esperando su oportunidad. Algunos esperan más que otros, pero cuando encuentran a su familia perfecta, todo vale la pena.

Si estás considerando adoptar, te invitamos a visitar nuestro centro. Tal vez tu "Max" está esperándote.`,
    imagen: '/images/centro/foto1.jpeg',
    fecha: '2025-01-15',
    categoria: 'adopcion',
    autor: 'Equipo de Comunicación'
  }
]

const categoriasColores = {
  evento: { bg: '#dc2626', text: 'Evento' },
  adopcion: { bg: '#16a34a', text: 'Adopción' },
  salud: { bg: '#0891b2', text: 'Salud' },
  general: { bg: '#6b7280', text: 'General' }
}

export default function NoticiaDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchNoticia()
  }, [params.id])

  const fetchNoticia = async () => {
    try {
      const response = await fetch(`/api/noticias/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setNoticia(data.noticia)
      } else {
        // Si no se encuentra, buscar en los ejemplos como fallback
        const noticiaEncontrada = noticiasEjemplo.find(n => n.id === params.id)
        if (noticiaEncontrada) {
          setNoticia(noticiaEncontrada)
        }
      }
    } catch (error) {
      console.error('Error fetching noticia:', error)
      // Usar datos de ejemplo como fallback
      const noticiaEncontrada = noticiasEjemplo.find(n => n.id === params.id)
      if (noticiaEncontrada) {
        setNoticia(noticiaEncontrada)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const compartir = (red: 'facebook' | 'x' | 'instagram' | 'copiar') => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const texto = noticia?.titulo || ''
    
    switch (red) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
        break
      case 'x':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
        break
      case 'instagram':
        // Instagram no tiene API de compartir directo, copiamos el enlace
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        alert('Enlace copiado. Puedes pegarlo en tu historia de Instagram.')
        break
      case 'copiar':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <p style={{ color: '#666' }}>Cargando noticia...</p>
      </div>
    )
  }

  if (!noticia) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px'
      }}>
        <h2 style={{ color: '#0e312d', marginBottom: '16px' }}>Noticia no encontrada</h2>
        <Link href="/noticias" style={{
          color: '#0891b2',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ChevronLeft size={20} />
          Volver a noticias
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

      {/* Contenido principal */}
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Link de regreso */}
        <Link href="/noticias" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#0e312d',
          textDecoration: 'none',
          fontWeight: '600',
          marginBottom: '32px',
          transition: 'all 0.2s ease'
        }}>
          <ChevronLeft size={20} />
          Volver a noticias
        </Link>

        {/* Categoría y fecha */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            backgroundColor: categoriasColores[noticia.categoria].bg,
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {categoriasColores[noticia.categoria].text}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <Calendar size={16} />
            {formatearFecha(noticia.fecha)}
          </div>
          {noticia.autor && (
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              Por {noticia.autor}
            </span>
          )}
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: '800',
          color: '#0e312d',
          lineHeight: '1.2',
          marginBottom: '24px'
        }}>
          {noticia.titulo}
        </h1>

        {/* Resumen */}
        <p style={{
          fontSize: '20px',
          color: '#4b5563',
          lineHeight: '1.6',
          marginBottom: '32px',
          fontWeight: '400'
        }}>
          {noticia.resumen}
        </p>

        {/* Metadatos del evento */}
        {(noticia.ubicacion || noticia.hora || noticia.aforo) && (
          <div style={{
            backgroundColor: '#e0f2fe',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            {noticia.ubicacion && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0e312d' }}>
                <MapPin size={18} color="#0891b2" />
                <span style={{ fontWeight: '600' }}>{noticia.ubicacion}</span>
              </div>
            )}
            {noticia.hora && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0e312d' }}>
                <Clock size={18} color="#0891b2" />
                <span style={{ fontWeight: '600' }}>{noticia.hora}</span>
              </div>
            )}
            {noticia.aforo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0e312d' }}>
                <Users size={18} color="#0891b2" />
                <span style={{ fontWeight: '600' }}>Capacidad: {noticia.aforo} personas</span>
              </div>
            )}
          </div>
        )}

        {/* Imagen principal */}
        <div style={{
          width: '100%',
          height: 'clamp(300px, 50vw, 500px)',
          backgroundColor: '#e5e7eb',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '40px'
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
        </div>

        {/* Contenido */}
        <div style={{
          fontSize: '18px',
          color: '#374151',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap',
          marginBottom: '40px'
        }}>
          {noticia.contenido}
        </div>

        {/* Botones de compartir */}
        <div style={{
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            Comparte esta noticia
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => compartir('facebook')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1877f2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Facebook size={20} />
              Facebook
            </button>
            <button
              onClick={() => compartir('x')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#000000',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>X</span>
            </button>
            <button
              onClick={() => compartir('instagram')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Instagram size={20} />
              Instagram
            </button>
            <button
              onClick={() => compartir('copiar')}
              style={{
                padding: '12px 24px',
                backgroundColor: copied ? '#dcfce7' : '#f3f4f6',
                color: copied ? '#16a34a' : '#374151',
                border: `1px solid ${copied ? '#16a34a' : '#e5e7eb'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copiado' : 'Copiar enlace'}
            </button>
          </div>
        </div>

        {/* Galería adicional */}
        {noticia.imagenes && noticia.imagenes.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0e312d',
              marginBottom: '20px'
            }}>
              Galería
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px'
            }}>
              {noticia.imagenes.map((img, idx) => (
                <div key={idx} style={{
                  height: '200px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={img}
                    alt={`Imagen ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA según categoría */}
        <div style={{
          marginTop: '60px',
          padding: '32px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '2px solid #e5e7eb',
          textAlign: 'center'
        }}>
          {noticia.categoria === 'adopcion' ? (
            <>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '16px'
              }}>
                ¿Te gustaría adoptar?
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                Visita nuestro catálogo y conoce a todos los perritos que buscan un hogar
              </p>
              <Link href="/catalogo" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Ver Catálogo de Adopción
              </Link>
            </>
          ) : noticia.categoria === 'evento' ? (
            <>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '16px'
              }}>
                ¿Quieres participar?
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                Contáctanos para más información sobre este evento
              </p>
              <a href="tel:2444458765" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Llamar al Centro
              </a>
            </>
          ) : (
            <>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0e312d',
                marginBottom: '16px'
              }}>
                Mantente informado
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                Síguenos para recibir más noticias sobre nuestras actividades
              </p>
              <Link href="/noticias" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0891b2',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Ver Más Noticias
              </Link>
            </>
          )}
        </div>
      </article>
    </div>
  )
}