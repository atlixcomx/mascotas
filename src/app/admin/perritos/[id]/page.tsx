import { notFound } from 'next/navigation'
import FormularioPerrito from '../../../../components/admin/FormularioPerrito'
import { ArrowLeft, Eye, FileText } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { id: string }
}

async function getPerrito(id: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/perritos/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching perrito:', error)
    return null
  }
}

export default async function EditarPerrito({ params }: PageProps) {
  const perrito = await getPerrito(params.id)

  if (!perrito) {
    notFound()
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/perritos"
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              href={`/perritos/${perrito.slug}`}
              target="_blank"
              className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Público
            </Link>
            <Link
              href={`/admin/perritos/${perrito.id}/solicitudes`}
              className="flex items-center px-4 py-2 bg-atlixco-600 text-white rounded-lg hover:bg-atlixco-700 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Solicitudes ({perrito.solicitudes?.length || 0})
            </Link>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center space-x-3">
            <img
              src={perrito.fotoPrincipal}
              alt={perrito.nombre}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Editar: {perrito.nombre}
              </h1>
              <p className="text-slate-600">
                {perrito.raza} • {perrito.edad} • 
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  perrito.estado === 'disponible' 
                    ? 'bg-green-100 text-green-800'
                    : perrito.estado === 'proceso'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {perrito.estado}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{perrito.vistas}</div>
          <div className="text-sm text-slate-600">Vistas</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-2xl font-bold text-green-600">{perrito.solicitudes?.length || 0}</div>
          <div className="text-sm text-slate-600">Solicitudes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {perrito.solicitudes?.filter((s: any) => ['nueva', 'revision'].includes(s.estado)).length || 0}
          </div>
          <div className="text-sm text-slate-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-600">{perrito.notas?.length || 0}</div>
          <div className="text-sm text-slate-600">Notas</div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-4xl">
        <FormularioPerrito perrito={perrito} />
      </div>
    </div>
  )
}