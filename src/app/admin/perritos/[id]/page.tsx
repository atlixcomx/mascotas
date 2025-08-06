'use client'

import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import FormularioPerrito from '../../../../components/admin/FormularioPerrito'
import { ArrowLeft, Eye, FileText } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { id: string }
}

export default function EditarPerrito({ params }: PageProps) {
  const [perrito, setPerrito] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchPerrito() {
      try {
        const response = await fetch(`/api/admin/perritos/${params.id}`)
        
        if (!response.ok) {
          setPerrito(null)
        } else {
          const data = await response.json()
          setPerrito(data)
        }
      } catch (error) {
        console.error('Error fetching perrito:', error)
        setPerrito(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPerrito()
  }, [params.id])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

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