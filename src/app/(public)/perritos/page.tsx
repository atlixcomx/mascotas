import { Suspense } from 'react'
import { Metadata } from 'next'
import CatalogoPerritos from '@/components/CatalogoPerritos'

export const metadata: Metadata = {
  title: 'Perritos en Adopción | Centro de Adopción Atlixco',
  description: 'Encuentra tu compañero perfecto entre nuestros perritos disponibles para adopción en Atlixco, Puebla.',
  keywords: 'adopción, perros, mascotas, Atlixco, Puebla, rescate animal',
  openGraph: {
    title: 'Perritos en Adopción - Atlixco',
    description: 'Encuentra tu compañero perfecto entre nuestros perritos disponibles para adopción.',
    images: ['/og-perritos.jpg'],
  },
}

export default function PerritosPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Perritos en Adopción
          </h1>
          <p className="text-lg text-slate-600">
            Encuentra a tu nuevo mejor amigo entre nuestros perritos rescatados
          </p>
        </div>
      </div>

      {/* Catálogo */}
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-slate-200 rounded w-20 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
              {/* Grid skeleton */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="h-48 bg-slate-200"></div>
                      <div className="p-4">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <CatalogoPerritos />
      </Suspense>
    </div>
  )
}