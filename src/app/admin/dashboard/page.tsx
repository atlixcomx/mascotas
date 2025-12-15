'use client'

import { ProfessionalDashboard } from '../../../components/admin/ProfessionalDashboard'

export default function DashboardPage() {
  return (
    <div style={{
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      <ProfessionalDashboard />
    </div>
  )
}
