import { useState, useEffect, useCallback } from 'react'

export interface ReminderStats {
  total: number
  urgentes: number
  normales: number
  porEstado: { [key: string]: number }
  promedioVencimiento: number
}

export function useReminders() {
  const [stats, setStats] = useState<ReminderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/recordatorios?action=stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Error al obtener estadísticas de recordatorios')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error('Error fetching reminder stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // Refrescar cada 5 minutos
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  }
}