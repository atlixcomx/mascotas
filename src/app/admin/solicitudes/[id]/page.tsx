'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
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
  Edit
} from 'lucide-react'
import styles from '../../dashboard.module.css'

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
  email: string
  telefono: string
  direccion: string
  tipoVivienda: string
  experiencia: string
  otrosMascotas: string
  motivoAdopcion: string
  compromisos: string
  estado: string
  perritoId: string
  perrito: Perrito
  createdAt: string
  fechaRevision?: string
  fechaEntrevista?: string
  fechaPrueba?: string
  fechaAdopcion?: string
  notas?: string
}

const estadoColores = {
  nueva: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Nueva' },
  revision: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En Revisión' },
  entrevista: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Entrevista' },
  prueba: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Prueba' },
  aprobada: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aprobada' },
  rechazada: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazada' },
  cancelada: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelada' }
}

export default function SolicitudDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notas, setNotas] = useState('')
  const [nuevoEstado, setNuevoEstado] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState<'aprobar' | 'rechazar' | null>(null)

  useEffect(() => {
    fetchSolicitud()
  }, [params.id])

  async function fetchSolicitud() {
    try {
      const response = await fetch(`/api/admin/solicitudes/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setSolicitud(data)
        setNotas(data.notas || '')
        setNuevoEstado(data.estado)
      }
    } catch (error) {
      console.error('Error fetching solicitud:', error)
    } finally {
      setLoading(false)
    }
  }

  async function actualizarEstado(estado: string) {
    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/solicitudes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado,
          notas,
          fechaRevision: estado === 'revision' ? new Date().toISOString() : solicitud?.fechaRevision,
          fechaEntrevista: estado === 'entrevista' ? new Date().toISOString() : solicitud?.fechaEntrevista,
          fechaPrueba: estado === 'prueba' ? new Date().toISOString() : solicitud?.fechaPrueba,
          fechaAdopcion: estado === 'aprobada' ? new Date().toISOString() : solicitud?.fechaAdopcion
        })
      })

      if (response.ok) {
        await fetchSolicitud()
        setShowModal(false)
        setModalAction(null)
        
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
      }
    } catch (error) {
      console.error('Error updating solicitud:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="space-y-4">
              <div className="h-24 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!solicitud) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Solicitud no encontrada</h3>
        </div>
      </div>
    )
  }

  const estado = estadoColores[solicitud.estado as keyof typeof estadoColores] || estadoColores.nueva

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/solicitudes"
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Solicitud {solicitud.codigo}</h1>
            <p className="text-slate-600 mt-1">
              Solicitud de adopción de {solicitud.nombre}
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${estado.bg} ${estado.text}`}>
            {estado.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del solicitante */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos personales */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Datos del Solicitante
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Nombre completo</p>
                <p className="font-medium text-slate-900">{solicitud.nombre}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-slate-900">{solicitud.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Teléfono</p>
                <p className="font-medium text-slate-900">{solicitud.telefono}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Dirección</p>
                <p className="font-medium text-slate-900">{solicitud.direccion}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Tipo de vivienda</p>
                <p className="font-medium text-slate-900">{solicitud.tipoVivienda}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Fecha de solicitud</p>
                <p className="font-medium text-slate-900">
                  {new Date(solicitud.createdAt).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Experiencia y motivación */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Experiencia y Motivación
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Experiencia con mascotas</p>
                <p className="text-slate-900">{solicitud.experiencia}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600 mb-1">Otras mascotas en casa</p>
                <p className="text-slate-900">{solicitud.otrosMascotas}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600 mb-1">Motivo de adopción</p>
                <p className="text-slate-900">{solicitud.motivoAdopcion}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600 mb-1">Compromisos asumidos</p>
                <p className="text-slate-900">{solicitud.compromisos}</p>
              </div>
            </div>
          </div>

          {/* Historial de estados */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Historial del Proceso
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-slate-600 mr-3" />
                  <div>
                    <p className="font-medium text-slate-900">Solicitud recibida</p>
                    <p className="text-sm text-slate-600">
                      {new Date(solicitud.createdAt).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              {solicitud.fechaRevision && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-slate-600 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900">Revisión iniciada</p>
                      <p className="text-sm text-slate-600">
                        {new Date(solicitud.fechaRevision).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
              
              {solicitud.fechaEntrevista && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 text-slate-600 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900">Entrevista realizada</p>
                      <p className="text-sm text-slate-600">
                        {new Date(solicitud.fechaEntrevista).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
              
              {solicitud.fechaPrueba && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-slate-600 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900">Período de prueba iniciado</p>
                      <p className="text-sm text-slate-600">
                        {new Date(solicitud.fechaPrueba).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
              
              {solicitud.fechaAdopcion && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-slate-600 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900">Adopción completada</p>
                      <p className="text-sm text-slate-600">
                        {new Date(solicitud.fechaAdopcion).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          {/* Mascota solicitada */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Dog className="w-5 h-5 mr-2" />
              Mascota Solicitada
            </h2>
            
            <div className="text-center">
              <img
                src={solicitud.perrito.fotoPrincipal || '/placeholder-dog.jpg'}
                alt={solicitud.perrito.nombre}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-slate-900">{solicitud.perrito.nombre}</h3>
              <p className="text-slate-600">{solicitud.perrito.raza}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p>{solicitud.perrito.edad} • {solicitud.perrito.sexo}</p>
                <p>Tamaño {solicitud.perrito.tamano}</p>
              </div>
              <Link
                href={`/admin/perritos/${solicitud.perritoId}`}
                className="inline-flex items-center mt-4 text-atlixco-600 hover:text-atlixco-700 font-medium text-sm"
              >
                Ver ficha completa
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Acciones
            </h2>
            
            <div className="space-y-3">
              {solicitud.estado === 'nueva' && (
                <>
                  <button
                    onClick={() => actualizarEstado('revision')}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                    disabled={updating}
                  >
                    Iniciar Revisión
                  </button>
                  <button
                    onClick={() => {
                      setModalAction('rechazar')
                      setShowModal(true)
                    }}
                    className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    disabled={updating}
                  >
                    Rechazar Solicitud
                  </button>
                </>
              )}
              
              {solicitud.estado === 'revision' && (
                <>
                  <button
                    onClick={() => actualizarEstado('entrevista')}
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                    disabled={updating}
                  >
                    Programar Entrevista
                  </button>
                  <button
                    onClick={() => {
                      setModalAction('rechazar')
                      setShowModal(true)
                    }}
                    className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    disabled={updating}
                  >
                    Rechazar Solicitud
                  </button>
                </>
              )}
              
              {solicitud.estado === 'entrevista' && (
                <>
                  <button
                    onClick={() => actualizarEstado('prueba')}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    disabled={updating}
                  >
                    Iniciar Período de Prueba
                  </button>
                  <button
                    onClick={() => {
                      setModalAction('rechazar')
                      setShowModal(true)
                    }}
                    className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    disabled={updating}
                  >
                    Rechazar Solicitud
                  </button>
                </>
              )}
              
              {solicitud.estado === 'prueba' && (
                <>
                  <button
                    onClick={() => {
                      setModalAction('aprobar')
                      setShowModal(true)
                    }}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    disabled={updating}
                  >
                    Aprobar Adopción
                  </button>
                  <button
                    onClick={() => {
                      setModalAction('rechazar')
                      setShowModal(true)
                    }}
                    className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    disabled={updating}
                  >
                    Rechazar Solicitud
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notas internas */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Edit className="w-5 h-5 mr-2" />
              Notas Internas
            </h2>
            
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-atlixco-500 focus:border-transparent"
              placeholder="Agregar notas sobre esta solicitud..."
            />
            
            <button
              onClick={() => actualizarEstado(solicitud.estado)}
              className="mt-3 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
              disabled={updating || notas === solicitud.notas}
            >
              <Save className="w-4 h-4 inline mr-1" />
              Guardar Notas
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {modalAction === 'aprobar' ? 'Confirmar Adopción' : 'Rechazar Solicitud'}
            </h3>
            
            <p className="text-slate-600 mb-6">
              {modalAction === 'aprobar' 
                ? '¿Estás seguro de aprobar esta adopción? El perrito será marcado como adoptado.'
                : '¿Estás seguro de rechazar esta solicitud? Esta acción no se puede deshacer.'}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setModalAction(null)
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => actualizarEstado(modalAction === 'aprobar' ? 'aprobada' : 'rechazada')}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  modalAction === 'aprobar' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                disabled={updating}
              >
                {updating ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}