'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Dog, 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Eye,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import {
  ResponsiveTable,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  StatusBadge,
  ActionButton,
  PetInfo
} from '../../../components/admin/ResponsiveTable'

interface Perrito {
  id: string
  codigo: string
  nombre: string
  raza: string
  edad: string
  sexo: string
  tamano: string
  estado: 'disponible' | 'proceso' | 'adoptado' | 'tratamiento'
  tipoIngreso: string
  fechaIngreso: string
  fotoPrincipal: string
}

interface Metrics {
  total: number
  disponibles: number
  enProceso: number
  adoptados: number
  enTratamiento: number
  porTipoIngreso: {
    entregaVoluntaria: number
    rescate: number
    decomiso: number
  }
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue'
}: { 
  title: string
  value: number
  icon: any
  color?: string
}) {
  const colorStyles = {
    blue: { bg: '#eff6ff', color: '#2563eb' },
    green: { bg: '#f0fdf4', color: '#16a34a' },
    yellow: { bg: '#fefce8', color: '#ca8a04' },
    red: { bg: '#fef2f2', color: '#dc2626' },
    purple: { bg: '#faf5ff', color: '#9333ea' }
  }

  const style = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0 0 4px 0',
            fontFamily: 'Poppins, sans-serif'
          }}>{title}</p>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: 0,
            fontFamily: 'Albert Sans, sans-serif'
          }}>{value}</p>
        </div>
        <div style={{
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: style.bg,
          color: style.color
        }}>
          <Icon style={{ width: '20px', height: '20px' }} />
        </div>
      </div>
    </div>
  )
}

export default function PerritosResponsive() {
  const router = useRouter()
  const [perritos, setPerritos] = useState<Perrito[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPerritos()
  }, [currentPage, filterTipo, filterEstado])

  async function fetchPerritos() {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (filterTipo) params.append('tipo_ingreso', filterTipo)
      if (filterEstado) params.append('estado', filterEstado)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/perritos?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setPerritos(data.perritos || [])
        setTotalPages(data.totalPages || 1)
        
        // Calculate metrics
        const metricsData: Metrics = {
          total: data.total || 0,
          disponibles: data.summary?.disponible || 0,
          enProceso: data.summary?.proceso || 0,
          adoptados: data.summary?.adoptado || 0,
          enTratamiento: data.summary?.tratamiento || 0,
          porTipoIngreso: {
            entregaVoluntaria: 0,
            rescate: 0,
            decomiso: 0
          }
        }
        setMetrics(metricsData)
      }
    } catch (error) {
      console.error('Error fetching perritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta mascota?')) {
      try {
        const response = await fetch(`/api/admin/perritos/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchPerritos()
        }
      } catch (error) {
        console.error('Error deleting perrito:', error)
      }
    }
  }

  const getEstadoLabel = (estado: string) => {
    const labels = {
      disponible: 'Disponible',
      proceso: 'En Proceso',
      adoptado: 'Adoptado',
      tratamiento: 'En Tratamiento'
    }
    return labels[estado as keyof typeof labels] || estado
  }

  return (
    <div style={{
      padding: '16px',
      width: '100%',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 8px 0',
          fontFamily: 'Albert Sans, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Dog style={{ width: '32px', height: '32px', color: '#f59e0b' }} />
          Gestión de Mascotas
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#64748b',
          margin: 0,
          fontFamily: 'Poppins, sans-serif'
        }}>
          Administra el registro de mascotas disponibles para adopción
        </p>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <MetricCard 
            title="Total de Mascotas" 
            value={metrics.total} 
            icon={Dog}
            color="blue"
          />
          <MetricCard 
            title="Disponibles" 
            value={metrics.disponibles} 
            icon={Heart}
            color="green"
          />
          <MetricCard 
            title="En Proceso" 
            value={metrics.enProceso} 
            icon={ShieldCheck}
            color="yellow"
          />
          <MetricCard 
            title="En Tratamiento" 
            value={metrics.enTratamiento} 
            icon={AlertCircle}
            color="red"
          />
        </div>
      )}

      {/* Action Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            minWidth: '250px',
            flex: '1 1 300px',
            maxWidth: '400px'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: 'white',
                color: '#1e293b',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          {/* Filters */}
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: 'white',
              color: '#1e293b',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="proceso">En Proceso</option>
            <option value="adoptado">Adoptado</option>
            <option value="tratamiento">En Tratamiento</option>
          </select>
        </div>

        {/* Add Button */}
        <button
          onClick={() => router.push('/admin/perritos/nuevo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            fontFamily: 'Albert Sans, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          Agregar Mascota
        </button>
      </div>

      {/* Responsive Table */}
      <ResponsiveTable>
        <TableHead>
          <TableRow>
            <TableHeader>MASCOTA</TableHeader>
            <TableHeader>INFORMACIÓN</TableHeader>
            <TableHeader>ESTADO</TableHeader>
            <TableHeader>TIPO INGRESO</TableHeader>
            <TableHeader>FECHA</TableHeader>
            <TableHeader align="center">ACCIONES</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {perritos.map((perrito) => (
            <TableRow key={perrito.id}>
              <TableCell dataLabel="Mascota">
                <PetInfo
                  imageUrl={perrito.fotoPrincipal || '/placeholder-dog.jpg'}
                  name={perrito.nombre}
                  code={perrito.codigo}
                />
              </TableCell>
              <TableCell dataLabel="Información">
                <div>
                  <p style={{ margin: '0 0 2px 0', fontWeight: '500' }}>
                    {perrito.raza}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                    {perrito.sexo} • {perrito.edad} • {perrito.tamano}
                  </p>
                </div>
              </TableCell>
              <TableCell dataLabel="Estado">
                <StatusBadge status={perrito.estado}>
                  {getEstadoLabel(perrito.estado)}
                </StatusBadge>
              </TableCell>
              <TableCell dataLabel="Tipo Ingreso">
                {perrito.tipoIngreso}
              </TableCell>
              <TableCell dataLabel="Fecha">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar style={{ width: '14px', height: '14px', color: '#64748b' }} />
                  <span>{new Date(perrito.fechaIngreso).toLocaleDateString('es-MX')}</span>
                </div>
              </TableCell>
              <TableCell dataLabel="Acciones" align="center">
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <ActionButton
                    type="view"
                    onClick={() => router.push(`/admin/perritos/${perrito.id}`)}
                    ariaLabel={`Ver detalles de ${perrito.nombre}`}
                  >
                    <Eye style={{ width: '16px', height: '16px' }} />
                  </ActionButton>
                  <ActionButton
                    type="edit"
                    onClick={() => router.push(`/admin/perritos/${perrito.id}/editar`)}
                    ariaLabel={`Editar ${perrito.nombre}`}
                  >
                    <Edit2 style={{ width: '16px', height: '16px' }} />
                  </ActionButton>
                  <ActionButton
                    type="delete"
                    onClick={() => handleDelete(perrito.id)}
                    ariaLabel={`Eliminar ${perrito.nombre}`}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </ActionButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </ResponsiveTable>

      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '24px'
      }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: currentPage === 1 ? '#cbd5e1' : '#475569',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.875rem',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          <ChevronLeft style={{ width: '16px', height: '16px' }} />
          Anterior
        </button>
        
        <span style={{
          padding: '8px 16px',
          fontSize: '0.875rem',
          color: '#475569',
          fontFamily: 'Poppins, sans-serif'
        }}>
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: currentPage === totalPages ? '#cbd5e1' : '#475569',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.875rem',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          Siguiente
          <ChevronRight style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  )
}