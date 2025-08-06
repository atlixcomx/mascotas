import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '../../../../../lib/db'
import FormularioAdopcion from '../../../../components/FormularioAdopcion'

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: { perritoId: string }
}

async function getPerrito(perritoId: string) {
  try {
    const perrito = await prisma.perrito.findUnique({
      where: { id: perritoId },
      select: {
        id: true,
        nombre: true,
        fotoPrincipal: true,
        raza: true,
        edad: true,
        sexo: true,
        tamano: true,
        estado: true,
        slug: true
      }
    })

    return perrito
  } catch (error) {
    console.error('Error fetching perrito:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const perrito = await getPerrito(params.perritoId)

  if (!perrito) {
    return {
      title: 'Perrito no encontrado | Centro de Adopción Atlixco'
    }
  }

  return {
    title: `Adoptar a ${perrito.nombre} | Centro de Adopción Atlixco`,
    description: `Completa tu solicitud de adopción para ${perrito.nombre}, un ${perrito.raza} que busca un hogar lleno de amor.`,
    robots: 'noindex', // No indexar formularios
  }
}

export default async function SolicitudAdopcionPage({ params }: PageProps) {
  const perrito = await getPerrito(params.perritoId)

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