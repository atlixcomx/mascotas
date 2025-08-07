'use client'

export const dynamic = 'force-dynamic'

import { Settings, Database, Shield, Mail, Bell } from 'lucide-react'

export default function AdminConfiguracion() {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#0e312d',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          Configuración del Sistema
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#64748b',
          margin: '0'
        }}>
          Administra la configuración general del sistema de adopción
        </p>
      </div>

      {/* Coming Soon */}
      <div style={{ textAlign: 'center', padding: '64px 20px' }}>
        <div style={{
          width: '120px',
          height: '120px',
          backgroundColor: '#e0f2fe',
          border: '3px solid #0369a1',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 8px 16px rgba(3, 105, 161, 0.1)'
        }}>
          <Settings style={{ width: '48px', height: '48px', color: '#0369a1' }} />
        </div>
        
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#0e312d', 
          marginBottom: '16px',
          margin: '0 0 16px 0'
        }}>
          Próximamente Disponible
        </h2>
        
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          marginBottom: '48px',
          maxWidth: '600px',
          margin: '0 auto 48px',
          lineHeight: '1.6'
        }}>
          Esta sección permitirá configurar aspectos avanzados del sistema de adopción, 
          notificaciones, integraciones y parámetros operativos.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          maxWidth: '800px', 
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            padding: '32px',
            textAlign: 'center'
          }}>
            <Database style={{ width: '40px', height: '40px', color: '#7c3aed', margin: '0 auto 16px' }} />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0e312d', 
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              Configuración de Base de Datos
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              lineHeight: '1.5',
              margin: '0'
            }}>
              Gestión de conexiones, backups y mantenimiento de la base de datos
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            padding: '32px',
            textAlign: 'center'
          }}>
            <Mail style={{ width: '40px', height: '40px', color: '#dc2626', margin: '0 auto 16px' }} />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0e312d', 
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              Notificaciones Email
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              lineHeight: '1.5',
              margin: '0'
            }}>
              Configuración de servidor SMTP y plantillas de correo electrónico
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            padding: '32px',
            textAlign: 'center'
          }}>
            <Shield style={{ width: '40px', height: '40px', color: '#059669', margin: '0 auto 16px' }} />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0e312d', 
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              Seguridad y Permisos
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              lineHeight: '1.5',
              margin: '0'
            }}>
              Gestión de usuarios, roles y configuración de seguridad
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            padding: '32px',
            textAlign: 'center'
          }}>
            <Bell style={{ width: '40px', height: '40px', color: '#f59e0b', margin: '0 auto 16px' }} />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0e312d', 
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              Alertas del Sistema
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748b', 
              lineHeight: '1.5',
              margin: '0'
            }}>
              Configuración de alertas automáticas y notificaciones push
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          maxWidth: '600px',
          margin: '48px auto 0'
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#166534', 
            fontWeight: '500',
            margin: '0'
          }}>
            💡 <strong>Nota:</strong> Esta funcionalidad estará disponible en la próxima actualización del sistema. 
            Mientras tanto, las configuraciones críticas se manejan automáticamente.
          </p>
        </div>
      </div>
    </div>
  )
}