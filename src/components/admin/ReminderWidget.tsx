'use client'

import Link from 'next/link'
import { Bell, AlertTriangle, Clock, ChevronRight } from 'lucide-react'
import { useReminders } from '../../hooks/useReminders'

export function ReminderWidget() {
  const { stats, loading, error } = useReminders()

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '20px'
      }}>
        <div style={{ 
          height: '24px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '4px',
          marginBottom: '12px',
          width: '60%'
        }} />
        <div style={{ 
          height: '16px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '4px',
          marginBottom: '16px'
        }} />
        <div style={{ 
          height: '40px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '4px'
        }} />
      </div>
    )
  }

  if (error || !stats) {
    return null
  }

  const hasReminders = stats.total > 0
  const hasUrgent = stats.urgentes > 0

  return (
    <Link href="/admin/recordatorios" style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: hasUrgent ? '2px solid #fecaca' : '1px solid rgba(0, 0, 0, 0.05)',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: hasUrgent ? '#fef2f2' : '#f0f9ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {hasUrgent ? (
                <AlertTriangle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              ) : (
                <Bell style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              )}
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1f2937',
                margin: 0
              }}>
                Recordatorios
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: 0
              }}>
                {hasReminders ? 'Solicitudes pendientes' : 'Todo al día'}
              </p>
            </div>
          </div>
          <ChevronRight style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700', 
              color: hasUrgent ? '#ef4444' : '#3b82f6',
              margin: '0 0 4px 0'
            }}>
              {stats.urgentes}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
              Urgentes
            </div>
          </div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700', 
              color: '#f59e0b',
              margin: '0 0 4px 0'
            }}>
              {stats.normales}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
              Normales
            </div>
          </div>
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700', 
              color: '#6b7280',
              margin: '0 0 4px 0'
            }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
              Total
            </div>
          </div>
        </div>

        {/* Status message */}
        {hasReminders ? (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: hasUrgent ? '#fef2f2' : '#fefbf3',
            border: hasUrgent ? '1px solid #fecaca' : '1px solid #fed7aa'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.8125rem',
              color: hasUrgent ? '#991b1b' : '#92400e',
              fontWeight: '500'
            }}>
              <Clock style={{ width: '14px', height: '14px' }} />
              {hasUrgent ? 
                `${stats.urgentes} solicitud${stats.urgentes === 1 ? '' : 'es'} necesita${stats.urgentes === 1 ? '' : 'n'} atención inmediata` :
                `${stats.total} recordatorio${stats.total === 1 ? '' : 's'} pendiente${stats.total === 1 ? '' : 's'}`
              }
            </div>
          </div>
        ) : (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ 
              fontSize: '0.8125rem',
              color: '#166534',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              ✅ Todas las solicitudes están al día
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}