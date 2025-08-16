'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  TrendingUp, Download, Calendar, Filter,
  BarChart3, PieChart, Activity, AlertCircle,
  CheckCircle, Syringe, Heart, Shield,
  Dog, FileText, Clock, Users
} from 'lucide-react'
import styles from '../veterinario.module.css'

interface ReporteData {
  periodo: string
  totalConsultas: number
  vacunasAplicadas: number
  esterilizaciones: number
  emergencias: number
  adopciones: number
}

interface EstadisticasGenerales {
  mascotasTotal: number
  consultasMes: number
  vacunacionPorcentaje: number
  esterilizacionPorcentaje: number
  saludPromedio: number
  tratamientosActivos: number
}

interface DistribucionEdad {
  categoria: string
  cantidad: number
  porcentaje: number
}

interface TendenciaMensual {
  mes: string
  consultas: number
  vacunas: number
  emergencias: number
}

export default function ReportesSaludPage() {
  const { data: session } = useSession()
  const [reporteActual, setReporteActual] = useState<ReporteData | null>(null)
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales | null>(null)
  const [distribucionEdad, setDistribucionEdad] = useState<DistribucionEdad[]>([])
  const [tendenciaMensual, setTendenciaMensual] = useState<TendenciaMensual[]>([])
  const [loading, setLoading] = useState(true)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes_actual')
  const [tipoReporte, setTipoReporte] = useState('general')

  useEffect(() => {
    fetchReportes()
  }, [periodoSeleccionado, tipoReporte])

  const fetchReportes = async () => {
    try {
      // Datos mock para demostrar funcionalidad
      setReporteActual({
        periodo: 'Enero 2024',
        totalConsultas: 142,
        vacunasAplicadas: 89,
        esterilizaciones: 23,
        emergencias: 15,
        adopciones: 31
      })

      setEstadisticas({
        mascotasTotal: 45,
        consultasMes: 142,
        vacunacionPorcentaje: 87,
        esterilizacionPorcentaje: 72,
        saludPromedio: 8.4,
        tratamientosActivos: 12
      })

      setDistribucionEdad([
        { categoria: 'Cachorros (0-1 año)', cantidad: 12, porcentaje: 27 },
        { categoria: 'Jóvenes (1-3 años)', cantidad: 18, porcentaje: 40 },
        { categoria: 'Adultos (3-7 años)', cantidad: 11, porcentaje: 24 },
        { categoria: 'Seniors (7+ años)', cantidad: 4, porcentaje: 9 }
      ])

      setTendenciaMensual([
        { mes: 'Sep', consultas: 98, vacunas: 67, emergencias: 8 },
        { mes: 'Oct', consultas: 112, vacunas: 78, emergencias: 12 },
        { mes: 'Nov', consultas: 125, vacunas: 82, emergencias: 10 },
        { mes: 'Dic', consultas: 134, vacunas: 85, emergencias: 13 },
        { mes: 'Ene', consultas: 142, vacunas: 89, emergencias: 15 }
      ])
    } catch (error) {
      console.error('Error fetching reportes:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (tipo: string) => {
    // Simular generación de reporte
    alert(`Generando reporte de ${tipo}...`)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando reportes de salud...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <TrendingUp className={styles.headerIcon} />
            <div>
              <h1 className={styles.title}>Reportes de Salud</h1>
              <p className={styles.subtitle}>Análisis y estadísticas veterinarias</p>
            </div>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.filterGroup}>
              <Calendar size={16} />
              <select
                value={periodoSeleccionado}
                onChange={(e) => setPeriodoSeleccionado(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="mes_actual">Mes actual</option>
                <option value="trimestre">Último trimestre</option>
                <option value="semestre">Último semestre</option>
                <option value="año">Último año</option>
              </select>
            </div>
            <button 
              onClick={() => generateReport('completo')}
              className={styles.primaryButton}
            >
              <Download size={20} />
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Resumen del Período */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Resumen - {reporteActual?.periodo}
          </h2>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#e0f2fe' }}>
              <FileText size={24} style={{ color: '#0284c7' }} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Consultas</p>
              <p className={styles.statValue}>{reporteActual?.totalConsultas}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
              <Syringe size={24} style={{ color: '#16a34a' }} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Vacunas Aplicadas</p>
              <p className={styles.statValue}>{reporteActual?.vacunasAplicadas}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#fce7f3' }}>
              <Heart size={24} style={{ color: '#be185d' }} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Esterilizaciones</p>
              <p className={styles.statValue}>{reporteActual?.esterilizaciones}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#fee2e2' }}>
              <AlertCircle size={24} style={{ color: '#dc2626' }} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Emergencias</p>
              <p className={styles.statValue}>{reporteActual?.emergencias}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className={styles.mainGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <BarChart3 size={20} />
              Indicadores de Salud
            </h2>
          </div>

          <div className={styles.indicadoresGrid}>
            <div className={styles.indicadorCard}>
              <div className={styles.indicadorHeader}>
                <Dog size={20} />
                <span>Total Mascotas</span>
              </div>
              <div className={styles.indicadorValue}>
                {estadisticas?.mascotasTotal}
              </div>
            </div>

            <div className={styles.indicadorCard}>
              <div className={styles.indicadorHeader}>
                <Syringe size={20} />
                <span>Cobertura Vacunación</span>
              </div>
              <div className={styles.indicadorValue}>
                {estadisticas?.vacunacionPorcentaje}%
              </div>
              <div className={styles.indicadorBar}>
                <div 
                  className={styles.indicadorProgress}
                  style={{ width: `${estadisticas?.vacunacionPorcentaje}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.indicadorCard}>
              <div className={styles.indicadorHeader}>
                <Heart size={20} />
                <span>Esterilización</span>
              </div>
              <div className={styles.indicadorValue}>
                {estadisticas?.esterilizacionPorcentaje}%
              </div>
              <div className={styles.indicadorBar}>
                <div 
                  className={styles.indicadorProgress}
                  style={{ width: `${estadisticas?.esterilizacionPorcentaje}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.indicadorCard}>
              <div className={styles.indicadorHeader}>
                <Activity size={20} />
                <span>Salud Promedio</span>
              </div>
              <div className={styles.indicadorValue}>
                {estadisticas?.saludPromedio}/10
              </div>
              <div className={styles.indicadorBar}>
                <div 
                  className={styles.indicadorProgress}
                  style={{ width: `${(estadisticas?.saludPromedio || 0) * 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <PieChart size={20} />
              Distribución por Edad
            </h2>
          </div>

          <div className={styles.distribucionChart}>
            {distribucionEdad.map(item => (
              <div key={item.categoria} className={styles.distribucionItem}>
                <div className={styles.distribucionLabel}>
                  <span>{item.categoria}</span>
                  <span>{item.cantidad} mascotas</span>
                </div>
                <div className={styles.distribucionBar}>
                  <div 
                    className={styles.distribucionProgress}
                    style={{ width: `${item.porcentaje}%` }}
                  ></div>
                </div>
                <span className={styles.distribucionPorcentaje}>
                  {item.porcentaje}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tendencia Mensual */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp size={20} />
            Tendencia Mensual
          </h2>
        </div>

        <div className={styles.tendenciaChart}>
          <div className={styles.chartContainer}>
            {tendenciaMensual.map((mes, index) => (
              <div key={mes.mes} className={styles.chartBar}>
                <div className={styles.barGroup}>
                  <div 
                    className={styles.bar}
                    style={{ 
                      height: `${(mes.consultas / 150) * 100}%`,
                      backgroundColor: '#0284c7'
                    }}
                    title={`Consultas: ${mes.consultas}`}
                  ></div>
                  <div 
                    className={styles.bar}
                    style={{ 
                      height: `${(mes.vacunas / 150) * 100}%`,
                      backgroundColor: '#16a34a'
                    }}
                    title={`Vacunas: ${mes.vacunas}`}
                  ></div>
                  <div 
                    className={styles.bar}
                    style={{ 
                      height: `${(mes.emergencias / 150) * 100}%`,
                      backgroundColor: '#dc2626'
                    }}
                    title={`Emergencias: ${mes.emergencias}`}
                  ></div>
                </div>
                <span className={styles.barLabel}>{mes.mes}</span>
              </div>
            ))}
          </div>

          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#0284c7' }}></div>
              <span>Consultas</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#16a34a' }}></div>
              <span>Vacunas</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#dc2626' }}></div>
              <span>Emergencias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reportes Rápidos */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Generar Reportes Específicos
          </h2>
        </div>

        <div className={styles.reportesRapidos}>
          <button 
            onClick={() => generateReport('vacunacion')}
            className={styles.reporteButton}
          >
            <Syringe size={24} />
            <span>Reporte de Vacunación</span>
            <Download size={16} />
          </button>

          <button 
            onClick={() => generateReport('consultas')}
            className={styles.reporteButton}
          >
            <FileText size={24} />
            <span>Reporte de Consultas</span>
            <Download size={16} />
          </button>

          <button 
            onClick={() => generateReport('esterilizaciones')}
            className={styles.reporteButton}
          >
            <Heart size={24} />
            <span>Reporte de Esterilizaciones</span>
            <Download size={16} />
          </button>

          <button 
            onClick={() => generateReport('emergencias')}
            className={styles.reporteButton}
          >
            <AlertCircle size={24} />
            <span>Reporte de Emergencias</span>
            <Download size={16} />
          </button>

          <button 
            onClick={() => generateReport('adopciones')}
            className={styles.reporteButton}
          >
            <Users size={24} />
            <span>Reporte de Adopciones</span>
            <Download size={16} />
          </button>

          <button 
            onClick={() => generateReport('general')}
            className={styles.reporteButton}
          >
            <TrendingUp size={24} />
            <span>Reporte General</span>
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}