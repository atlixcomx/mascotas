'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Stethoscope, Calendar, FileText, Syringe, TrendingUp, AlertTriangle } from 'lucide-react'

export default function VeterinarioNotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Página no encontrada
            </h1>
            <p className="text-gray-600">
              La función del módulo veterinario que buscas no existe o no está disponible.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Funciones disponibles del módulo veterinario:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/veterinario"
                className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Stethoscope className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">Dashboard Veterinario</div>
                  <div className="text-sm text-green-600">Panel principal</div>
                </div>
              </Link>

              <Link
                href="/admin/veterinario/calendario"
                className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Calendario de Citas</div>
                  <div className="text-sm text-blue-600">Programar consultas</div>
                </div>
              </Link>

              <Link
                href="/admin/veterinario/vacunacion"
                className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Syringe className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">Programa de Vacunación</div>
                  <div className="text-sm text-purple-600">Control de vacunas</div>
                </div>
              </Link>

              <Link
                href="/admin/veterinario/expedientes"
                className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <FileText className="w-6 h-6 text-orange-600" />
                <div>
                  <div className="font-medium text-orange-900">Expedientes Médicos</div>
                  <div className="text-sm text-orange-600">Historiales clínicos</div>
                </div>
              </Link>

              <Link
                href="/admin/veterinario/reportes"
                className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors md:col-span-2"
              >
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <div>
                  <div className="font-medium text-indigo-900">Reportes de Salud</div>
                  <div className="text-sm text-indigo-600">Estadísticas y análisis</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Volver atrás
            </button>
            
            <Link
              href="/admin/veterinario"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              <Stethoscope size={20} />
              Ir al Módulo Veterinario
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Módulo Veterinario - Sistema de Administración de Atlixco
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}