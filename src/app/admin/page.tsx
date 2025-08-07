'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Dog, 
  FileText, 
  TrendingUp,
  Users,
  Calendar,
  Heart,
  AlertCircle,
  Package,
  Activity,
  Phone,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Building2,
  Syringe,
  CalendarDays,
  Megaphone,
  AlertTriangle
} from 'lucide-react'

interface DashboardMetrics {
  perritos: {
    total: number
    disponibles: number
    enProceso: number
    adoptados: number
    nuevosEsteMes: number
    tendencia: number
    // Nuevos campos
    porTipoIngreso: {
      entregaVoluntaria: number
      rescate: number
      decomiso: number
    }
  }
  solicitudes: {
    total: number
    pendientes: number
    aprobadas: number
    rechazadas: number
    tasaAprobacion: number
    tendencia: number
    recientes: any[]
  }
  adopciones: {
    esteMes: number
    mesAnterior: number
    totalAnio: number
    tiempoPromedio: number
    tendencia: number
  }
  seguimientos: {
    pendientes: number
    realizados: number
    proximaSemana: number
    tasaExito: number
    vencidos: number
  }
  eventos: {
    proximos: number
    esteMes: number
    asistentesTotal: number
  }
  insumos: {
    alertasBajoStock: number
    gastosEsteMes: number
    categorias: {
      alimento: number
      medicamento: number
      limpieza: number
    }
  }
  salud: {
    vacunacionesPendientes: number
    esterilizacionesPendientes: number
    consultasEsteMes: number
  }
}

interface ProximoEvento {
  id: string
  nombre: string
  fecha: string
  tipo: string
  lugar: string
}

interface AlertaImportante {
  id: string
  tipo: string
  mensaje: string
  prioridad: string
  link?: string
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  subtitle,
  onClick
}: { 
  title: string
  value: string | number
  change?: number
  icon: any
  color?: string
  subtitle?: string
  onClick?: () => void
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
      style={{ backgroundColor: 'white' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-3">
              {change > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : change < 0 ? (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <span className={`text-sm font-medium ${
                change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {change > 0 && '+'}{change}% vs mes anterior
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  color = 'blue',
  badge
}: { 
  title: string
  description: string
  href: string
  icon: any
  color?: string
  badge?: number
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50'
  }

  return (
    <Link 
      href={href}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all hover:border-gray-300 relative"
    >
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </div>
      )}
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]} mr-4`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [proximosEventos, setProximosEventos] = useState<ProximoEvento[]>([])
  const [alertas, setAlertas] = useState<AlertaImportante[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics || mockMetrics)
        setProximosEventos(data.proximosEventos || [])
        
        // Generar alertas basadas en métricas
        const alertasGeneradas: AlertaImportante[] = []
        
        if (data.metrics?.seguimientos?.vencidos > 0) {
          alertasGeneradas.push({
            id: '1',
            tipo: 'seguimiento',
            mensaje: `${data.metrics.seguimientos.vencidos} seguimientos vencidos requieren atención inmediata`,
            prioridad: 'alta',
            link: '/admin/seguimientos'
          })
        }
        
        if (data.metrics?.insumos?.alertasBajoStock > 0) {
          alertasGeneradas.push({
            id: '2',
            tipo: 'insumos',
            mensaje: `${data.metrics.insumos.alertasBajoStock} insumos con stock bajo`,
            prioridad: 'media',
            link: '/admin/insumos'
          })
        }
        
        if (data.metrics?.salud?.vacunacionesPendientes > 0) {
          alertasGeneradas.push({
            id: '3',
            tipo: 'salud',
            mensaje: `${data.metrics.salud.vacunacionesPendientes} mascotas necesitan vacunación`,
            prioridad: 'media',
            link: '/admin/expedientes'
          })
        }
        
        setAlertas(alertasGeneradas)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Usar datos de ejemplo si hay error
      setMetrics(mockMetrics)
    } finally {
      setLoading(false)
    }
  }

  // Datos de ejemplo mejorados
  const mockMetrics: DashboardMetrics = {
    perritos: {
      total: 42,
      disponibles: 18,
      enProceso: 6,
      adoptados: 18,
      nuevosEsteMes: 5,
      tendencia: 15,
      porTipoIngreso: {
        entregaVoluntaria: 22,
        rescate: 15,
        decomiso: 5
      }
    },
    solicitudes: {
      total: 127,
      pendientes: 8,
      aprobadas: 94,
      rechazadas: 25,
      tasaAprobacion: 79,
      tendencia: -5,
      recientes: []
    },
    adopciones: {
      esteMes: 12,
      mesAnterior: 10,
      totalAnio: 85,
      tiempoPromedio: 15,
      tendencia: 20
    },
    seguimientos: {
      pendientes: 6,
      realizados: 24,
      proximaSemana: 3,
      tasaExito: 92,
      vencidos: 2
    },
    eventos: {
      proximos: 2,
      esteMes: 3,
      asistentesTotal: 450
    },
    insumos: {
      alertasBajoStock: 3,
      gastosEsteMes: 12500,
      categorias: {
        alimento: 7500,
        medicamento: 3200,
        limpieza: 1800
      }
    },
    salud: {
      vacunacionesPendientes: 4,
      esterilizacionesPendientes: 7,
      consultasEsteMes: 15
    }
  }

  const data = metrics || mockMetrics

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Centro de Control</h1>
        <p className="text-gray-600 mt-2">
          Sistema de Adopción Municipal de Atlixco - {new Date().toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Alertas Importantes */}
      {alertas.length > 0 && (
        <div className="mb-6 space-y-3">
          {alertas.map((alerta) => (
            <div key={alerta.id} className={`
              p-4 rounded-lg border flex items-start
              ${alerta.prioridad === 'alta' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }
            `}>
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1 flex items-center justify-between">
                <p className="font-medium">{alerta.mensaje}</p>
                {alerta.link && (
                  <Link 
                    href={alerta.link}
                    className="ml-4 text-sm font-semibold hover:underline"
                  >
                    Resolver →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Métricas Principales - Primera Fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Perritos Disponibles"
          value={data.perritos.disponibles}
          change={data.perritos.tendencia}
          icon={Dog}
          color="blue"
          subtitle={`De ${data.perritos.total} totales`}
        />
        <MetricCard
          title="Adopciones Este Mes"
          value={data.adopciones.esteMes}
          change={data.adopciones.tendencia}
          icon={Heart}
          color="green"
          subtitle={`${data.adopciones.totalAnio} en el año`}
        />
        <MetricCard
          title="Solicitudes Pendientes"
          value={data.solicitudes.pendientes}
          icon={FileText}
          color="yellow"
          subtitle={`${data.solicitudes.tasaAprobacion}% aprobación`}
        />
        <MetricCard
          title="Seguimientos Pendientes"
          value={data.seguimientos.pendientes}
          icon={Phone}
          color="purple"
          subtitle={`${data.seguimientos.vencidos} vencidos`}
        />
      </div>

      {/* Métricas Secundarias - Segunda Fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Vacunaciones Pendientes"
          value={data.salud.vacunacionesPendientes}
          icon={Syringe}
          color="orange"
          subtitle="Requieren atención"
        />
        <MetricCard
          title="Próximos Eventos"
          value={data.eventos.proximos}
          icon={Megaphone}
          color="blue"
          subtitle={`${data.eventos.asistentesTotal} asistentes totales`}
        />
        <MetricCard
          title="Alertas de Stock"
          value={data.insumos.alertasBajoStock}
          icon={Package}
          color="red"
          subtitle={`$${data.insumos.gastosEsteMes.toLocaleString()} gastados`}
        />
        <MetricCard
          title="Nuevos Este Mes"
          value={data.perritos.nuevosEsteMes}
          icon={TrendingUp}
          color="green"
          subtitle="Ingresos al refugio"
        />
      </div>

      {/* Gráficas y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Estadísticas de Adopción */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Estadísticas de Adopción</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Tiempo promedio de adopción</span>
                <span className="text-sm font-semibold text-gray-900">{data.adopciones.tiempoPromedio} días</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Tasa de éxito en seguimientos</span>
                <span className="text-sm font-semibold text-gray-900">{data.seguimientos.tasaExito}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.seguimientos.tasaExito}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Ocupación del refugio</span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.round((data.perritos.disponibles / data.perritos.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${Math.round((data.perritos.disponibles / data.perritos.total) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Origen de Mascotas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Origen de Mascotas</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Entrega Voluntaria</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{data.perritos.porTipoIngreso.entregaVoluntaria}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Rescate</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{data.perritos.porTipoIngreso.rescate}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Decomiso</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{data.perritos.porTipoIngreso.decomiso}</span>
            </div>
          </div>
        </div>

        {/* Gastos por Categoría */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Gastos del Mes</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Package className="w-4 h-4 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Alimento</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">${data.insumos.categorias.alimento.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <Syringe className="w-4 h-4 text-red-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Medicamentos</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">${data.insumos.categorias.medicamento.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Limpieza</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">${data.insumos.categorias.limpieza.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Registrar Mascota"
            description="Añadir nuevo perrito al sistema"
            href="/admin/perritos/nuevo"
            icon={Dog}
            color="blue"
          />
          <QuickActionCard
            title="Ver Solicitudes"
            description={`${data.solicitudes.pendientes} pendientes de revisar`}
            href="/admin/solicitudes"
            icon={FileText}
            color="green"
            badge={data.solicitudes.pendientes}
          />
          <QuickActionCard
            title="Expedientes Médicos"
            description="Gestionar salud de mascotas"
            href="/admin/expedientes"
            icon={Syringe}
            color="red"
            badge={data.salud.vacunacionesPendientes}
          />
          <QuickActionCard
            title="Programar Seguimiento"
            description="Llamadas de monitoreo"
            href="/admin/seguimientos"
            icon={Phone}
            color="purple"
            badge={data.seguimientos.vencidos}
          />
        </div>
      </div>

      {/* Sección inferior con múltiples widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solicitudes Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Solicitudes Recientes</h2>
            <Link href="/admin/solicitudes" className="text-sm text-blue-600 hover:text-blue-700">
              Ver todas →
            </Link>
          </div>
          {data.solicitudes.recientes.length > 0 ? (
            <div className="space-y-3">
              {data.solicitudes.recientes.slice(0, 5).map((solicitud) => (
                <div key={solicitud.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <img
                      src={solicitud.perrito?.fotoPrincipal || '/placeholder-dog.jpg'}
                      alt={solicitud.perrito?.nombre || 'Perrito'}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{solicitud.nombre}</p>
                      <p className="text-sm text-gray-600">Para {solicitud.perrito?.nombre || 'Sin asignar'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    solicitud.estado === 'nueva' 
                      ? 'bg-blue-100 text-blue-700'
                      : solicitud.estado === 'revision'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {solicitud.estado}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay solicitudes recientes</p>
            </div>
          )}
        </div>

        {/* Próximos Eventos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Próximos Eventos</h2>
            <Link href="/admin/eventos" className="text-sm text-blue-600 hover:text-blue-700">
              Ver todos →
            </Link>
          </div>
          {proximosEventos.length > 0 ? (
            <div className="space-y-3">
              {proximosEventos.map((evento) => (
                <div key={evento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{evento.nombre}</p>
                      <p className="text-sm text-gray-600">{evento.lugar}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(evento.fecha).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">{evento.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay eventos programados</p>
              <Link 
                href="/admin/eventos/nuevo"
                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                Programar evento
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}