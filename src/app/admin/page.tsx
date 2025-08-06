import { Suspense } from 'react'
import { prisma } from '../../../lib/db'
import { 
  Dog, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Heart,
  Calendar
} from 'lucide-react'

async function getDashboardStats() {
  try {
    const [
      totalPerritos,
      perritosDisponibles,
      perritosEnProceso,
      perritosAdoptados,
      totalSolicitudes,
      solicitudesPendientes,
      solicitudesRecientes,
      adopcionesEsteMes
    ] = await Promise.all([
      // Conteos de perritos
      prisma.perrito.count(),
      prisma.perrito.count({ where: { estado: 'disponible' } }),
      prisma.perrito.count({ where: { estado: 'proceso' } }),
      prisma.perrito.count({ where: { estado: 'adoptado' } }),
      
      // Conteos de solicitudes
      prisma.solicitud.count(),
      prisma.solicitud.count({ where: { estado: { in: ['nueva', 'revision'] } } }),
      
      // Solicitudes recientes (últimos 7 días)
      prisma.solicitud.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          perrito: {
            select: {
              nombre: true,
              fotoPrincipal: true,
              raza: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }),
      
      // Adopciones este mes
      prisma.solicitud.count({
        where: {
          estado: 'aprobada',
          updatedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    return {
      perritos: {
        total: totalPerritos,
        disponibles: perritosDisponibles,
        enProceso: perritosEnProceso,
        adoptados: perritosAdoptados
      },
      solicitudes: {
        total: totalSolicitudes,
        pendientes: solicitudesPendientes,
        recientes: solicitudesRecientes,
        adopcionesEsteMes
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      perritos: { total: 0, disponibles: 0, enProceso: 0, adoptados: 0 },
      solicitudes: { total: 0, pendientes: 0, recientes: [], adopcionesEsteMes: 0 }
    }
  }
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  description 
}: {
  title: string
  value: number | string
  icon: any
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  description?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

function SolicitudesRecientes({ solicitudes }: { solicitudes: any[] }) {
  if (solicitudes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-slate-400" />
        <p className="text-slate-500 mt-2">No hay solicitudes recientes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {solicitudes.map((solicitud) => (
        <div key={solicitud.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
          <img
            src={solicitud.perrito.fotoPrincipal}
            alt={solicitud.perrito.nombre}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900">{solicitud.nombre}</p>
            <p className="text-sm text-slate-600">
              Quiere adoptar a <strong>{solicitud.perrito.nombre}</strong>
            </p>
            <p className="text-xs text-slate-500">
              {new Date(solicitud.createdAt).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              solicitud.estado === 'nueva' 
                ? 'bg-blue-100 text-blue-800'
                : solicitud.estado === 'revision'
                ? 'bg-yellow-100 text-yellow-800'  
                : 'bg-gray-100 text-gray-800'
            }`}>
              {solicitud.estado}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Perritos"
          value={stats.perritos.total}
          icon={Dog}
          color="blue"
        />
        <StatCard
          title="Disponibles"
          value={stats.perritos.disponibles}
          icon={Heart}
          color="green"
          description="Listos para adopción"
        />
        <StatCard
          title="En Proceso"
          value={stats.perritos.enProceso}
          icon={Clock}
          color="yellow"
          description="Con solicitudes activas"
        />
        <StatCard
          title="Adoptados"
          value={stats.perritos.adoptados}
          icon={CheckCircle}
          color="purple"
          description="Encontraron hogar"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Solicitudes Totales"
          value={stats.solicitudes.total}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={stats.solicitudes.pendientes}
          icon={Clock}
          color="red"
          description="Requieren atención"
        />
        <StatCard
          title="Adopciones Este Mes"
          value={stats.solicitudes.adopcionesEsteMes}
          icon={TrendingUp}
          color="green"
          description="Familias felices"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Solicitudes Recientes */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Solicitudes Recientes
            </h2>
            <a 
              href="/admin/solicitudes"
              className="text-sm text-atlixco-600 hover:text-atlixco-700 font-medium"
            >
              Ver todas →
            </a>
          </div>
          <Suspense fallback={<div className="animate-pulse h-32 bg-slate-100 rounded"></div>}>
            <SolicitudesRecientes solicitudes={stats.solicitudes.recientes} />
          </Suspense>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Acciones Rápidas
          </h2>
          <div className="space-y-4">
            <a
              href="/admin/perritos"
              className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Dog className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Gestionar Perritos</p>
                <p className="text-sm text-slate-600">Agregar, editar o actualizar estado</p>
              </div>
            </a>
            
            <a
              href="/admin/solicitudes"
              className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <FileText className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Revisar Solicitudes</p>
                <p className="text-sm text-slate-600">Procesar adopciones pendientes</p>
              </div>
            </a>

            <a
              href="/admin/comercios"
              className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Comercios Pet-Friendly</p>
                <p className="text-sm text-slate-600">Gestionar directorio y QR</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {stats.solicitudes.pendientes > 0 && (
        <div className="mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800">
                <strong>{stats.solicitudes.pendientes} solicitudes</strong> requieren tu atención.
                <a href="/admin/solicitudes" className="ml-2 underline hover:no-underline">
                  Revisar ahora
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}