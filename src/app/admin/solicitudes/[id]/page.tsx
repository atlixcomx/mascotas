'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToastContext } from '../../../../providers/ToastProvider'
import { AttachmentsList } from '../../../../components/admin/AttachmentsList'
import { Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Users,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  FileText,
  Save,
  Dog,
  Heart,
  Shield,
  Edit,
  Activity,
  ChevronRight,
  Download,
  Printer,
  Share2,
  UserCheck,
  FileCheck,
  CalendarCheck,
  ClipboardCheck,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Info,
  Star,
  Award,
  Target,
  Zap,
  ExternalLink,
  MoreVertical,
  CheckSquare,
  XSquare,
  HelpCircle,
  Loader2,
  Paperclip,
  RefreshCw
} from 'lucide-react'

interface Perrito {
  id: string
  nombre: string
  fotoPrincipal: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  slug: string
}

interface Solicitud {
  id: string
  codigo: string
  nombre: string
  edad: number
  email: string
  telefono: string
  direccion: string
  ciudad: string
  codigoPostal: string
  tipoVivienda: string
  tienePatio: boolean
  experiencia: string
  otrasMascotas?: string
  motivoAdopcion: string
  ineUrl?: string
  comprobanteUrl?: string
  estado: string
  perritoId: string
  perrito: Perrito
  createdAt: string
  updatedAt: string
  fechaRevision?: string
  fechaEntrevista?: string
  fechaPrueba?: string
  inicioPrueba?: string
  finPrueba?: string
  fechaAdopcion?: string
  motivoRechazo?: string
  origenQR?: string
  copiaIneRecibida?: boolean
  copiaComprobanteRecibida?: boolean
  notas?: Array<{
    id: string
    contenido: string
    autor: string
    tipo: string
    createdAt: string
  }>
}

const estadoColores = {
  nueva: { 
    bg: '#3b82f6', 
    bgLight: '#dbeafe', 
    text: '#1e40af', 
    label: 'Nueva',
    icon: FileText,
    description: 'Solicitud recibida y pendiente de revisión'
  },
  revision: { 
    bg: '#f59e0b', 
    bgLight: '#fef3c7', 
    text: '#92400e', 
    label: 'En Revisión',
    icon: Eye,
    description: 'Evaluando información y requisitos'
  },
  entrevista: { 
    bg: '#8b5cf6', 
    bgLight: '#e9d5ff', 
    text: '#5b21b6', 
    label: 'Entrevista',
    icon: MessageSquare,
    description: 'Programada entrevista con el adoptante'
  },
  prueba: { 
    bg: '#f97316', 
    bgLight: '#fed7aa', 
    text: '#9a3412', 
    label: 'Prueba',
    icon: Clock,
    description: 'Período de prueba en progreso'
  },
  aprobada: { 
    bg: '#10b981', 
    bgLight: '#d1fae5', 
    text: '#065f46', 
    label: 'Aprobada',
    icon: CheckCircle,
    description: 'Adopción completada exitosamente'
  },
  rechazada: { 
    bg: '#ef4444', 
    bgLight: '#fee2e2', 
    text: '#991b1b', 
    label: 'Rechazada',
    icon: XCircle,
    description: 'Solicitud no cumple con los requisitos'
  },
  cancelada: { 
    bg: '#6b7280', 
    bgLight: '#f3f4f6', 
    text: '#374151', 
    label: 'Cancelada',
    icon: AlertCircle,
    description: 'Proceso cancelado por el solicitante'
  }
}

export default function SolicitudDetallePage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToastContext()
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [notas, setNotas] = useState('')
  const [nuevoEstado, setNuevoEstado] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState<'aprobar' | 'rechazar' | null>(null)
  const [showActions, setShowActions] = useState(false)
  const [actividades, setActividades] = useState<any[]>([])
  const [comentarios, setComentarios] = useState<any[]>([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [loadingActividades, setLoadingActividades] = useState(true)
  const [enviandoComentario, setEnviandoComentario] = useState(false)
  const [fechaEntrevista, setFechaEntrevista] = useState('')
  const [fechaInicioPrueba, setFechaInicioPrueba] = useState('')
  const [fechaFinPrueba, setFechaFinPrueba] = useState('')
  const [copiaIneRecibida, setCopiaIneRecibida] = useState(false)
  const [copiaComprobanteRecibida, setCopiaComprobanteRecibida] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean
    type: 'state' | 'approval' | 'rejection'
    title: string
    message: string
    newState: string
    confirmText: string
    onConfirm: () => void
  } | null>(null)

  useEffect(() => {
    fetchSolicitud()
    fetchActividades()
  }, [params.id])

  const showConfirmDialog = (type: 'state' | 'approval' | 'rejection', newState: string) => {
    const stateLabels: { [key: string]: string } = {
      'revision': 'En Revisión',
      'entrevista': 'Entrevista',
      'prueba': 'Período de Prueba',
      'aprobada': 'Aprobada',
      'rechazada': 'Rechazada'
    }

    const configs = {
      state: {
        title: `Cambiar estado a ${stateLabels[newState]}`,
        message: `¿Estás seguro de cambiar el estado de esta solicitud a "${stateLabels[newState]}"? Se enviará una notificación automática al solicitante.`,
        confirmText: 'Cambiar Estado'
      },
      approval: {
        title: 'Confirmar Adopción',
        message: '¿Estás seguro de aprobar esta adopción? El perrito será marcado como adoptado y se completará el proceso. Esta acción no se puede deshacer.',
        confirmText: 'Aprobar Adopción'
      },
      rejection: {
        title: 'Rechazar Solicitud',
        message: '¿Estás seguro de rechazar esta solicitud? El solicitante será notificado y esta acción no se puede deshacer.',
        confirmText: 'Rechazar Solicitud'
      }
    }

    const config = configs[type]
    
    setConfirmDialog({
      show: true,
      type,
      title: config.title,
      message: config.message,
      newState,
      confirmText: config.confirmText,
      onConfirm: () => actualizarEstado(newState)
    })
  }

  async function fetchSolicitud() {
    try {
      const response = await fetch(`/api/admin/solicitudes/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setSolicitud(data)
        setNotas(data.notas || '')
        setNuevoEstado(data.estado)
        setCopiaIneRecibida(data.copiaIneRecibida || false)
        setCopiaComprobanteRecibida(data.copiaComprobanteRecibida || false)
      }
    } catch (error) {
      console.error('Error fetching solicitud:', error)
    } finally {
      setLoading(false)
    }
  }

  // Función para refrescar todos los datos con indicador visual
  async function refreshAllData() {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchSolicitud(),
        fetchActividades()
      ])
    } finally {
      setRefreshing(false)
    }
  }

  const handleStateChange = (newState: string, fechasAdicionales?: any) => {
    actualizarEstado(newState, fechasAdicionales)
  }

  async function actualizarEstado(estado: string, fechasAdicionales?: any) {
    setUpdating(true)
    try {
      const updateData: any = {
        estado,
        notas,
        fechaRevision: estado === 'revision' ? new Date().toISOString() : solicitud?.fechaRevision,
        fechaEntrevista: fechasAdicionales?.fechaEntrevista || solicitud?.fechaEntrevista,
        fechaPrueba: estado === 'prueba' ? new Date().toISOString() : solicitud?.fechaPrueba,
        inicioPrueba: fechasAdicionales?.inicioPrueba || solicitud?.inicioPrueba,
        finPrueba: fechasAdicionales?.finPrueba || solicitud?.finPrueba,
        fechaAdopcion: estado === 'aprobada' ? new Date().toISOString() : solicitud?.fechaAdopcion
      }

      const response = await fetch(`/api/admin/solicitudes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        // Refrescar todos los datos
        await refreshAllData()
        setShowModal(false)
        setModalAction(null)
        setConfirmDialog(null)
        
        // Mostrar notificación de éxito
        const stateLabels: { [key: string]: string } = {
          'revision': 'En Revisión',
          'entrevista': 'Entrevista',
          'prueba': 'Período de Prueba',
          'aprobada': 'Aprobada',
          'rechazada': 'Rechazada'
        }
        
        toast.success(
          'Estado actualizado',
          `La solicitud ha sido cambiada a "${stateLabels[estado]}" exitosamente`
        )
        
        // Si se aprueba, actualizar el estado del perrito
        if (estado === 'aprobada') {
          await fetch(`/api/admin/perritos/${solicitud?.perritoId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              estado: 'adoptado'
            })
          })
        }
      } else {
        toast.error('Error al actualizar', 'No se pudo actualizar el estado de la solicitud')
      }
    } catch (error) {
      console.error('Error updating solicitud:', error)
      toast.error('Error de conexión', 'No se pudo conectar con el servidor')
    } finally {
      setUpdating(false)
    }
  }

  async function fetchActividades() {
    try {
      const response = await fetch(`/api/admin/solicitudes/${params.id}/actividad`)
      if (response.ok) {
        const data = await response.json()
        setActividades(data)
      }
    } catch (error) {
      console.error('Error fetching actividades:', error)
    } finally {
      setLoadingActividades(false)
    }
  }

  async function actualizarChecklist(campo: 'copiaIneRecibida' | 'copiaComprobanteRecibida', valor: boolean) {
    try {
      const updateData: any = {
        estado: solicitud?.estado,
        [campo]: valor
      }

      const response = await fetch(`/api/admin/solicitudes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        // Refrescar todos los datos para mantener sincronización
        await refreshAllData()
        toast.success('Actualizado', 'El estado del documento se ha actualizado')
      } else {
        toast.error('Error', 'No se pudo actualizar el estado del documento')
      }
    } catch (error) {
      console.error('Error updating checklist:', error)
      toast.error('Error de conexión', 'No se pudo actualizar el estado')
    }
  }

  async function enviarComentario() {
    if (!nuevoComentario.trim()) return

    setEnviandoComentario(true)
    try {
      const response = await fetch(`/api/admin/solicitudes/${params.id}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contenido: nuevoComentario
        })
      })

      if (response.ok) {
        setNuevoComentario('')
        await refreshAllData()
        toast.success('Comentario agregado', 'El comentario se ha guardado correctamente')
      } else {
        toast.error('Error al comentar', 'No se pudo agregar el comentario')
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error)
      toast.error('Error de conexión', 'No se pudo enviar el comentario')
    } finally {
      setEnviandoComentario(false)
    }
  }

  // Función para generar mensaje de WhatsApp según el estado
  const getWhatsAppMessage = () => {
    if (!solicitud) return ''

    const nombre = solicitud.nombre.split(' ')[0] // Primer nombre
    const perrito = solicitud.perrito.nombre

    const mensajes: { [key: string]: string } = {
      nueva: `Hola ${nombre}, recibimos tu solicitud para adoptar a ${perrito}. Somos del Centro de Bienestar Animal de Atlixco. ¿Podemos agendar una llamada para conocerte mejor?`,
      revision: `Hola ${nombre}, estamos revisando tu solicitud para adoptar a ${perrito}. ¿Podrías enviarnos una foto de tu INE y un comprobante de domicilio reciente?`,
      entrevista: `Hola ${nombre}, queremos agendar tu entrevista para la adopción de ${perrito}. ¿Qué día y hora te funcionan esta semana?`,
      prueba: `Hola ${nombre}, ¿cómo va la adaptación con ${perrito}? ¿Tienes alguna duda o necesitas orientación?`,
      aprobada: `Hola ${nombre}, ¡felicidades por tu adopción de ${perrito}! ¿Cómo van estos primeros días juntos?`,
      rechazada: `Hola ${nombre}, gracias por tu interés en adoptar. Lamentamos informarte que en esta ocasión no pudimos continuar con el proceso.`,
      cancelada: `Hola ${nombre}, vimos que cancelaste tu solicitud de adopción de ${perrito}. ¿Hay algo en lo que podamos ayudarte?`
    }

    return mensajes[solicitud.estado] || mensajes.nueva
  }

  // Función para iniciar conversación de WhatsApp y registrar
  const iniciarWhatsApp = async () => {
    if (!solicitud) return

    // Limpiar teléfono (quitar espacios, guiones, etc)
    const telefonoLimpio = solicitud.telefono.replace(/\D/g, '')

    // Agregar código de país 52 si no lo tiene
    const telefonoCompleto = telefonoLimpio.startsWith('52')
      ? telefonoLimpio
      : `52${telefonoLimpio}`

    const mensaje = encodeURIComponent(getWhatsAppMessage())
    const urlWhatsApp = `https://wa.me/${telefonoCompleto}?text=${mensaje}`

    // Registrar en historial
    try {
      await fetch(`/api/admin/solicitudes/${params.id}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contenido: `Se inició conversación por WhatsApp (Estado: ${solicitud.estado})`,
          tipo: 'whatsapp'
        })
      })

      // Refrescar actividades
      await fetchActividades()

      toast.success('Conversación iniciada', 'Se registró el contacto por WhatsApp')
    } catch (error) {
      console.error('Error registrando WhatsApp:', error)
    }

    // Abrir WhatsApp en nueva pestaña
    window.open(urlWhatsApp, '_blank')
  }

  if (loading) {
    return (
      <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '200px',
            height: '32px',
            backgroundColor: '#e2e8f0',
            borderRadius: '8px',
            marginBottom: '32px',
            animation: 'pulse 2s infinite'
          }} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    height: '150px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '8px',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[1, 2].map(i => (
                <div key={i} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    height: '200px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '8px',
                    animation: 'pulse 2s infinite'
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    )
  }

  if (!solicitud) {
    return (
      <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{
          maxWidth: '600px',
          margin: '100px auto',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '48px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <AlertCircle style={{
            width: '64px',
            height: '64px',
            color: '#ef4444',
            margin: '0 auto 24px'
          }} />
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '16px'
          }}>Solicitud no encontrada</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            La solicitud que buscas no existe o ha sido eliminada
          </p>
          <Link
            href="/admin/solicitudes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#af1731',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8b1227'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#af1731'}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Volver a solicitudes
          </Link>
        </div>
      </div>
    )
  }

  const estado = estadoColores[solicitud.estado as keyof typeof estadoColores] || estadoColores.nueva
  const EstadoIcon = estado.icon

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffInMs = now.getTime() - then.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Hoy'
    if (diffInDays === 1) return 'Ayer'
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
    return `Hace ${Math.floor(diffInDays / 30)} meses`
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header mejorado */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px 32px',
        marginBottom: '32px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}>
            <div>
              <Link
                href="/admin/solicitudes"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                Volver a solicitudes
              </Link>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 8px 0',
                fontFamily: 'Poppins, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                Solicitud {solicitud.codigo}
                {refreshing && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #e2e8f0',
                    borderTop: '2px solid #af1731',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
              </h1>
              <p style={{ color: '#64748b', margin: 0 }}>
                {solicitud.nombre} • {new Date(solicitud.createdAt).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => refreshAllData()}
                disabled={refreshing}
                style={{
                  padding: '10px',
                  backgroundColor: refreshing ? '#f8fafc' : 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: refreshing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!refreshing) {
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                    e.currentTarget.style.borderColor = '#cbd5e1'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!refreshing) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                  }
                }}
                title="Actualizar datos"
              >
                {refreshing ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #e2e8f0',
                    borderTop: '2px solid #af1731',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : (
                  <RefreshCw style={{ width: '20px', height: '20px', color: '#64748b' }} />
                )}
              </button>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#cbd5e1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }}
              >
                <Printer style={{ width: '20px', height: '20px', color: '#64748b' }} />
              </button>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#cbd5e1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }}
              >
                <Download style={{ width: '20px', height: '20px', color: '#64748b' }} />
              </button>
              <button
                style={{
                  padding: '10px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#cbd5e1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }}
              >
                <Share2 style={{ width: '20px', height: '20px', color: '#64748b' }} />
              </button>
            </div>
          </div>
          
          {/* Estado y progreso */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              backgroundColor: estado.bgLight,
              borderRadius: '12px',
              border: `2px solid ${estado.bg}`
            }}>
              <EstadoIcon style={{ width: '24px', height: '24px', color: estado.bg }} />
              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: estado.text,
                  margin: 0
                }}>
                  {estado.label}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: estado.text,
                  margin: 0,
                  opacity: 0.8
                }}>
                  {estado.description}
                </p>
              </div>
            </div>
            
            {/* Timeline de progreso */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {['nueva', 'revision', 'entrevista', 'prueba', 'aprobada'].map((step, index) => {
                const stepConfig = estadoColores[step as keyof typeof estadoColores]
                const isActive = ['nueva', 'revision', 'entrevista', 'prueba', 'aprobada'].indexOf(solicitud.estado) >= index
                const StepIcon = stepConfig.icon
                
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? stepConfig.bg : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}>
                      <StepIcon style={{
                        width: '20px',
                        height: '20px',
                        color: isActive ? 'white' : '#94a3b8'
                      }} />
                    </div>
                    {index < 4 && (
                      <div style={{
                        height: '2px',
                        width: '60px',
                        backgroundColor: isActive && ['nueva', 'revision', 'entrevista', 'prueba', 'aprobada'].indexOf(solicitud.estado) > index ? stepConfig.bg : '#e2e8f0',
                        transition: 'all 0.3s'
                      }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 32px 32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '24px'
        }}>
          {/* Columna izquierda - Información detallada */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Panel de Gestión del Proceso */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Shield style={{ width: '20px', height: '20px', color: '#af1731' }} />
                Gestión del Proceso
              </h2>

              {/* Campos de fecha según el estado */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* Mostrar fecha de revisión si está en estado de revisión o superior */}
                {['revision', 'entrevista', 'prueba', 'aprobada', 'rechazada'].includes(solicitud.estado) && (
                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '4px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block'
                    }}>Fecha de Revisión</label>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#0f172a'
                    }}>
                      {solicitud.fechaRevision ? new Date(solicitud.fechaRevision).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'No establecida'}
                    </p>
                  </div>
                )}

                {/* Campo de fecha de entrevista - Mostrar input cuando está en revisión */}
                {solicitud.estado === 'revision' && (
                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '4px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block'
                    }}>Fecha y Hora de Entrevista</label>
                    <input
                      type="datetime-local"
                      value={fechaEntrevista}
                      onChange={(e) => setFechaEntrevista(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '0.875rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#0f172a'
                      }}
                      placeholder="Selecciona fecha y hora"
                    />
                  </div>
                )}

                {/* Mostrar fecha de entrevista cuando ya fue programada */}
                {['entrevista', 'prueba', 'aprobada', 'rechazada'].includes(solicitud.estado) && (
                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '4px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block'
                    }}>Fecha de Entrevista</label>
                    {solicitud.estado === 'entrevista' && !solicitud.fechaEntrevista ? (
                      <input
                        type="datetime-local"
                        value={fechaEntrevista}
                        onChange={(e) => setFechaEntrevista(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '0.875rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: '#0f172a'
                        }}
                      />
                    ) : (
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#0f172a'
                      }}>
                        {solicitud.fechaEntrevista ? new Date(solicitud.fechaEntrevista).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No establecida'}
                      </p>
                    )}
                  </div>
                )}

                {/* Campos de fecha de período de prueba - Mostrar inputs cuando está en entrevista */}
                {solicitud.estado === 'entrevista' && (
                  <>
                    <div>
                      <label style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '4px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block'
                      }}>Fecha de Inicio del Período de Prueba</label>
                      <input
                        type="date"
                        value={fechaInicioPrueba}
                        onChange={(e) => setFechaInicioPrueba(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '0.875rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: '#0f172a'
                        }}
                        placeholder="Selecciona fecha de inicio"
                      />
                    </div>
                    <div>
                      <label style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '4px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block'
                      }}>Fecha de Fin del Período de Prueba</label>
                      <input
                        type="date"
                        value={fechaFinPrueba}
                        onChange={(e) => setFechaFinPrueba(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '0.875rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: '#0f172a'
                        }}
                        placeholder="Selecciona fecha de fin"
                      />
                    </div>
                  </>
                )}

                {/* Campo de fecha de prueba */}
                {['prueba', 'aprobada', 'rechazada'].includes(solicitud.estado) && (
                  <>
                    <div>
                      <label style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '4px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block'
                      }}>Inicio de Prueba</label>
                      {solicitud.estado === 'prueba' && !solicitud.inicioPrueba ? (
                        <input
                          type="date"
                          value={fechaInicioPrueba}
                          onChange={(e) => setFechaInicioPrueba(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '0.875rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#0f172a'
                          }}
                        />
                      ) : (
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#0f172a'
                        }}>
                          {solicitud.inicioPrueba ? new Date(solicitud.inicioPrueba).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }) : 'No establecida'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '4px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block'
                      }}>Fin de Prueba</label>
                      {solicitud.estado === 'prueba' && !solicitud.finPrueba ? (
                        <input
                          type="date"
                          value={fechaFinPrueba}
                          onChange={(e) => setFechaFinPrueba(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '0.875rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#0f172a'
                          }}
                        />
                      ) : (
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#0f172a'
                        }}>
                          {solicitud.finPrueba ? new Date(solicitud.finPrueba).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }) : 'No establecida'}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Fecha de adopción */}
                {solicitud.estado === 'aprobada' && solicitud.fechaAdopcion && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '4px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block'
                    }}>Fecha de Adopción</label>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#0f172a'
                    }}>
                      {new Date(solicitud.fechaAdopcion).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Campo de notas */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  marginBottom: '4px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block'
                }}>Notas del proceso</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Agregar notas sobre el proceso..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '12px',
                    fontSize: '0.875rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#0f172a',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Acciones según el estado */}
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                {solicitud.estado === 'nueva' && (
                  <>
                    <button
                      onClick={() => handleStateChange('revision')}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      disabled={updating}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                    >
                      <Eye style={{ width: '16px', height: '16px' }} />
                      Iniciar Revisión
                    </button>
                    <button
                      onClick={() => handleStateChange('rechazada')}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      disabled={updating}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <XCircle style={{ width: '16px', height: '16px' }} />
                      Rechazar Solicitud
                    </button>
                  </>
                )}

                {solicitud.estado === 'revision' && (
                  <>
                    <button
                      onClick={() => {
                        if (!fechaEntrevista) {
                          toast.error('Por favor selecciona fecha y hora para la entrevista')
                          return
                        }
                        handleStateChange('entrevista', { fechaEntrevista })
                      }}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      disabled={updating}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
                    >
                      <MessageSquare style={{ width: '16px', height: '16px' }} />
                      Programar Entrevista
                    </button>
                    <button
                      onClick={() => handleStateChange('rechazada')}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      disabled={updating}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <XCircle style={{ width: '16px', height: '16px' }} />
                      Rechazar Solicitud
                    </button>
                  </>
                )}

                {solicitud.estado === 'entrevista' && (
                  <>
                    <button
                      onClick={() => {
                        if (!fechaInicioPrueba || !fechaFinPrueba) {
                          toast.error('Por favor selecciona las fechas de inicio y fin del período de prueba')
                          return
                        }
                        handleStateChange('prueba', { inicioPrueba: fechaInicioPrueba, finPrueba: fechaFinPrueba })
                      }}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#f97316',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      disabled={updating}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
                    >
                      <Clock style={{ width: '16px', height: '16px' }} />
                      Iniciar Período de Prueba
                    </button>
                    <button
                      onClick={() => handleStateChange('rechazada')}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      disabled={updating}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <XCircle style={{ width: '16px', height: '16px' }} />
                      Rechazar Solicitud
                    </button>
                  </>
                )}

                {solicitud.estado === 'prueba' && (
                  <>
                    <button
                      onClick={() => handleStateChange('aprobada')}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      disabled={updating}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                      <CheckCircle style={{ width: '16px', height: '16px' }} />
                      Aprobar Adopción
                    </button>
                    <button
                      onClick={() => handleStateChange('rechazada')}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      disabled={updating}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <XCircle style={{ width: '16px', height: '16px' }} />
                      Rechazar Solicitud
                    </button>
                  </>
                )}

                {(solicitud.estado === 'aprobada' || solicitud.estado === 'rechazada' || solicitud.estado === 'cancelada') && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    <Info style={{
                      width: '24px',
                      height: '24px',
                      color: '#64748b',
                      margin: '0 auto 8px'
                    }} />
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      Esta solicitud ha sido finalizada y no permite más acciones.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Datos personales */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <User style={{ width: '20px', height: '20px', color: '#af1731' }} />
                Datos del Solicitante
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Nombre completo</p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#0f172a'
                  }}>{solicitud.nombre}</p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Edad</p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#0f172a'
                  }}>{solicitud.edad} años</p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Email</p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Mail style={{ width: '16px', height: '16px', color: '#64748b' }} />
                    {solicitud.email}
                  </p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Teléfono</p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: 0
                    }}>
                      <Phone style={{ width: '16px', height: '16px', color: '#64748b' }} />
                      {solicitud.telefono}
                    </p>
                    <button
                      onClick={iniciarWhatsApp}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        backgroundColor: '#25D366',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(37, 211, 102, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1da851'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#25D366'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                      title={`Enviar: "${getWhatsAppMessage().substring(0, 50)}..."`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Iniciar Chat
                    </button>
                  </div>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Tipo de vivienda</p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Home style={{ width: '16px', height: '16px', color: '#64748b' }} />
                    {solicitud.tipoVivienda}
                  </p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>¿Tiene patio?</p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#0f172a'
                  }}>{solicitud.tienePatio ? 'Sí' : 'No'}</p>
                </div>
                
                <div style={{ gridColumn: 'span 2' }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Dirección</p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#64748b', marginTop: '2px' }} />
                    {solicitud.direccion}
                  </p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Ciudad</p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#0f172a'
                  }}>{solicitud.ciudad}</p>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>Código Postal</p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#0f172a'
                  }}>{solicitud.codigoPostal}</p>
                </div>
              </div>
            </div>

            {/* Checklist de Documentos */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ClipboardCheck style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
                Documentos Recibidos
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  backgroundColor: copiaIneRecibida ? '#f0fdf4' : '#f8fafc',
                  borderRadius: '8px',
                  border: `1px solid ${copiaIneRecibida ? '#86efac' : '#e2e8f0'}`,
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="checkbox"
                    checked={copiaIneRecibida}
                    onChange={(e) => actualizarChecklist('copiaIneRecibida', e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '2px'
                    }}>Copia de Identificación Oficial (INE)</p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>Verificar que la INE esté vigente y sea legible</p>
                  </div>
                  {copiaIneRecibida && <Check style={{ width: '20px', height: '20px', color: '#10b981' }} />}
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  backgroundColor: copiaComprobanteRecibida ? '#f0fdf4' : '#f8fafc',
                  borderRadius: '8px',
                  border: `1px solid ${copiaComprobanteRecibida ? '#86efac' : '#e2e8f0'}`,
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="checkbox"
                    checked={copiaComprobanteRecibida}
                    onChange={(e) => actualizarChecklist('copiaComprobanteRecibida', e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#0f172a',
                      marginBottom: '2px'
                    }}>Copia de Comprobante de Domicilio</p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>No mayor a 3 meses de antigüedad</p>
                  </div>
                  {copiaComprobanteRecibida && <Check style={{ width: '20px', height: '20px', color: '#10b981' }} />}
                </label>
                
                {solicitud.ineUrl && (
                  <a
                    href={solicitud.ineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      textDecoration: 'none',
                      color: '#af1731',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2'
                      e.currentTarget.style.borderColor = '#af1731'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}
                  >
                    <FileText style={{ width: '16px', height: '16px' }} />
                    Ver INE subida
                    <ExternalLink style={{ width: '14px', height: '14px', marginLeft: 'auto' }} />
                  </a>
                )}
                
                {solicitud.comprobanteUrl && (
                  <a
                    href={solicitud.comprobanteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      textDecoration: 'none',
                      color: '#af1731',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2'
                      e.currentTarget.style.borderColor = '#af1731'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc'
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}
                  >
                    <FileText style={{ width: '16px', height: '16px' }} />
                    Ver Comprobante subido
                    <ExternalLink style={{ width: '14px', height: '14px', marginLeft: 'auto' }} />
                  </a>
                )}
              </div>
            </div>

            {/* Experiencia y motivación */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Heart style={{ width: '20px', height: '20px', color: '#af1731' }} />
                Experiencia y Motivación
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>Experiencia con mascotas</p>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      lineHeight: '1.6'
                    }}>{solicitud.experiencia}</p>
                  </div>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>Otras mascotas en casa</p>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      lineHeight: '1.6'
                    }}>{solicitud.otrasMascotas || 'No tiene otras mascotas'}</p>
                  </div>
                </div>
                
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>Motivo de adopción</p>
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      lineHeight: '1.6'
                    }}>{solicitud.motivoAdopcion}</p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Documentos adjuntos */}
            {(solicitud.ineUrl || solicitud.comprobanteUrl) && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Paperclip style={{ width: '20px', height: '20px', color: '#af1731' }} />
                  Documentos Adjuntos
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {solicitud.ineUrl && (
                    <a
                      href={solicitud.ineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        color: '#0f172a',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e2e8f0'
                        e.currentTarget.style.borderColor = '#cbd5e1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                      }}
                    >
                      <FileText style={{ width: '24px', height: '24px', color: '#64748b' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>INE</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Ver documento</p>
                      </div>
                      <ExternalLink style={{ width: '16px', height: '16px', color: '#64748b', marginLeft: 'auto' }} />
                    </a>
                  )}
                  
                  {solicitud.comprobanteUrl && (
                    <a
                      href={solicitud.comprobanteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        color: '#0f172a',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e2e8f0'
                        e.currentTarget.style.borderColor = '#cbd5e1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8fafc'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                      }}
                    >
                      <FileText style={{ width: '24px', height: '24px', color: '#64748b' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>Comprobante de Domicilio</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Ver documento</p>
                      </div>
                      <ExternalLink style={{ width: '16px', height: '16px', color: '#64748b', marginLeft: 'auto' }} />
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Columna derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Mascota solicitada */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Dog style={{ width: '20px', height: '20px', color: '#af1731' }} />
                Mascota Solicitada
              </h2>
              
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={solicitud.perrito.fotoPrincipal || '/placeholder-dog.jpg'}
                  alt={solicitud.perrito.nombre}
                  width={160}
                  height={160}
                  style={{
                    borderRadius: '12px',
                    objectFit: 'cover',
                    marginBottom: '16px'
                  }}
                />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '4px'
                }}>{solicitud.perrito.nombre}</h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '16px'
                }}>{solicitud.perrito.raza}</p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>Edad</p>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}>{solicitud.perrito.edad}</p>
                  </div>
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>Sexo</p>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}>{solicitud.perrito.sexo}</p>
                  </div>
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>Tamaño</p>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}>{solicitud.perrito.tamano}</p>
                  </div>
                </div>
                
                <Link
                  href={`/admin/perritos/${solicitud.perritoId}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: '#af1731',
                    border: '1px solid #af1731',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#af1731'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#af1731'
                  }}
                >
                  Ver ficha completa
                  <ExternalLink style={{ width: '16px', height: '16px' }} />
                </Link>
              </div>
            </div>

            {/* Timeline de actividad */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Zap style={{ width: '20px', height: '20px', color: '#af1731' }} />
                Actividad Reciente
              </h2>
              
              {loadingActividades ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #f3f4f6',
                    borderTop: '3px solid #af1731',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
              ) : actividades.length === 0 ? (
                <p style={{
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  padding: '20px'
                }}>
                  No hay actividad registrada
                </p>
              ) : (
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '8px'
                }}>
                  {actividades.map((actividad, index) => {
                    const IconoActividad = actividad.tipo === 'estado' ? Activity :
                                         actividad.tipo === 'email' ? Mail :
                                         actividad.tipo === 'nota' ? Edit :
                                         actividad.tipo === 'comentario' ? MessageSquare :
                                         FileText
                    
                    return (
                      <div key={actividad.id} style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: index < actividades.length - 1 ? '20px' : 0,
                        paddingBottom: index < actividades.length - 1 ? '20px' : 0,
                        borderBottom: index < actividades.length - 1 ? '1px solid #e2e8f0' : 'none'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <IconoActividad style={{
                            width: '16px',
                            height: '16px',
                            color: '#64748b'
                          }} />
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#0f172a',
                            marginBottom: '4px'
                          }}>
                            {actividad.descripcion}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#64748b'
                          }}>
                            {actividad.usuario} • {new Date(actividad.fecha).toLocaleString('es-MX')}
                          </p>
                          {actividad.detalles?.contenido && (
                            <p style={{
                              fontSize: '0.8125rem',
                              color: '#475569',
                              marginTop: '8px',
                              padding: '8px 12px',
                              backgroundColor: '#f8fafc',
                              borderRadius: '6px',
                              borderLeft: '3px solid #cbd5e1'
                            }}>
                              {actividad.detalles.contenido}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Agregar comentario */}
              <div style={{
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <input
                    type="text"
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Agregar un comentario..."
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#af1731'
                      e.target.style.boxShadow = '0 0 0 3px rgba(175, 23, 49, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.boxShadow = 'none'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !enviandoComentario) {
                        enviarComentario()
                      }
                    }}
                  />
                  <button
                    onClick={enviarComentario}
                    disabled={enviandoComentario || !nuevoComentario.trim()}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: enviandoComentario || !nuevoComentario.trim() ? '#cbd5e1' : '#af1731',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: enviandoComentario || !nuevoComentario.trim() ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!enviandoComentario && nuevoComentario.trim()) {
                        e.currentTarget.style.backgroundColor = '#8b1227'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!enviandoComentario && nuevoComentario.trim()) {
                        e.currentTarget.style.backgroundColor = '#af1731'
                      }
                    }}
                  >
                    {enviandoComentario ? (
                      <>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid white',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <MessageSquare style={{ width: '16px', height: '16px' }} />
                        Comentar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
