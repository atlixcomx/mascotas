import FormularioPerrito from '../../../../components/admin/FormularioPerrito'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoPerrito() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/perritos"
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-900">Agregar Nuevo Perrito</h1>
          <p className="text-slate-600 mt-1">
            Completa la información del perrito para agregarlo al catálogo de adopción
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-4xl">
        <FormularioPerrito />
      </div>
    </div>
  )
}