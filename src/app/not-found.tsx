import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-atlixco-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-3xl">🐕</span>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          ¡Ups! Página no encontrada
        </h1>
        
        <p className="text-slate-600 mb-6">
          Parece que este perrito se escapó. No pudimos encontrar la página que buscas.
        </p>

        <div className="space-y-3">
          <Link href="/" className="block w-full btn-primary">
            Ir al Inicio
          </Link>
          <Link href="/catalogo" className="block w-full btn-secondary">
            Ver Perritos Disponibles
          </Link>
        </div>
      </div>
    </div>
  )
}