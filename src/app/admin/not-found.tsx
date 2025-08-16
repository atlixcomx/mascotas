'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Shield, AlertTriangle } from 'lucide-react'

export default function AdminNotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Página no encontrada
            </h1>
            <p className="text-gray-600 text-lg">
              Error 404
            </p>
          </div>

          {/* Message */}
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed">
              La página que buscas no existe o ha sido movida. 
              Esto puede suceder si el enlace está obsoleto o si no tienes permisos para acceder a esta sección.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Volver atrás
            </button>
            
            <Link
              href="/admin/dashboard"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Home size={20} />
              Ir al Dashboard
            </Link>

            <Link
              href="/admin/veterinario"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
            >
              <Shield size={20} />
              Módulo Veterinario
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Sistema de Administración - H. Ayuntamiento de Atlixco
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}