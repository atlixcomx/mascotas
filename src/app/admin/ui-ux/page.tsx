'use client'

import { UIUXAnalyzer } from '@/components/admin/UIUXAnalyzer'

export default function UIUXPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Análisis UI/UX</h1>
          <p className="mt-2 text-sm text-gray-600">
            Analiza y mejora la experiencia de usuario y la interfaz de los componentes
          </p>
        </div>

        <UIUXAnalyzer />

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cómo usar el Analizador UI/UX</h2>
          
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900">Análisis de Componente Individual</h3>
              <p>Ingresa la ruta completa de un componente (ej: /src/components/Button.tsx) para analizar:</p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Problemas de accesibilidad</li>
                <li>Mejores prácticas de UI/UX</li>
                <li>Sugerencias de mejora específicas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Análisis del Sistema Completo</h3>
              <p>Analiza todo el sistema de diseño para obtener:</p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Puntuación general de UI/UX</li>
                <li>Tokens de diseño extraídos</li>
                <li>Análisis de consistencia</li>
                <li>Recomendaciones priorizadas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Niveles de Severidad</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded">CRITICAL</span>
                  <span className="text-sm">Problemas que impiden el uso del componente</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded">HIGH</span>
                  <span className="text-sm">Problemas importantes que afectan la usabilidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-50 rounded">MEDIUM</span>
                  <span className="text-sm">Mejoras recomendadas para mejor experiencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded">LOW</span>
                  <span className="text-sm">Sugerencias opcionales de optimización</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Exportar Reportes</h3>
              <p>Después de realizar un análisis, puedes exportar el reporte completo en formato Markdown para:</p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Compartir con el equipo de desarrollo</li>
                <li>Documentar el progreso de mejoras</li>
                <li>Crear tickets de trabajo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}