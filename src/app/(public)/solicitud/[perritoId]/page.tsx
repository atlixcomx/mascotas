'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import FormularioAdopcion from '../../../../components/FormularioAdopcion'

interface PageProps {
  params: { perritoId: string }
}

interface Perrito {
  id: string
  nombre: string
  fotoPrincipal: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  estado: string
  slug: string
}

export default function SolicitudAdopcionPage({ params }: PageProps) {
  const [perrito, setPerrito] = useState<Perrito | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPerrito() {
      try {
        const response = await fetch(`/api/perritos?id=${params.perritoId}`)
        
        if (!response.ok) {
          setPerrito(null)
        } else {
          const data = await response.json()
          // The API returns an array, so we need to get the first item
          if (data.perritos && data.perritos.length > 0) {
            setPerrito(data.perritos[0])
          } else {
            setPerrito(null)
          }
        }
      } catch (error) {
        console.error('Error fetching perrito:', error)
        setPerrito(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPerrito()
  }, [params.perritoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="animate-pulse">
          <div className="bg-white shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
              <div>
                <div className="h-6 bg-slate-200 rounded w-64 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-48"></div>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!perrito) {
    notFound()
  }

  if (perrito.estado === 'adoptado') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">😢</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {perrito.nombre} ya fue adoptado
          </h1>
          <p className="text-slate-600 mb-6">
            Este perrito ya encontró su hogar para siempre. Te invitamos a conocer otros perritos disponibles.
          </p>
          <Link href="/perritos" className="btn-primary">
            Ver Otros Perritos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <img
              src={perrito.fotoPrincipal}
              alt={perrito.nombre}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Solicitud de Adopción para {perrito.nombre}
              </h1>
              <p className="text-slate-600">
                {perrito.raza} • {perrito.sexo} • {perrito.edad} • {perrito.tamano}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormularioAdopcion perrito={perrito} />
      </div>
    </div>
  )
}