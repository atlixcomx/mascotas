'use client'

import { Building2, MapPin, QrCode, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function AdminComercios() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Comercios Pet-Friendly</h1>
        <p className="text-slate-600 mt-1">
          Gestiona el directorio de comercios y sus códigos QR
        </p>
      </div>

      {/* Coming Soon */}
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-atlixco-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Building2 className="h-12 w-12 text-atlixco-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Próximamente Disponible
        </h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
          Esta sección permitirá gestionar el directorio de comercios pet-friendly, 
          generar códigos QR para campañas de adopción y hacer seguimiento de conversiones.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <MapPin className="h-8 w-8 text-atlixco-600 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">Directorio</h3>
            <p className="text-sm text-slate-600">
              Gestiona comercios certificados como pet-friendly
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <QrCode className="h-8 w-8 text-atlixco-600 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">Códigos QR</h3>
            <p className="text-sm text-slate-600">
              Genera QR únicos para campañas de adopción
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <TrendingUp className="h-8 w-8 text-atlixco-600 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">Analytics</h3>
            <p className="text-sm text-slate-600">
              Seguimiento de escaneos y conversiones
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Esta funcionalidad estará disponible en la siguiente versión del sistema.
        </p>
      </div>
    </div>
  )
}