'use client'

import { RealtimeDashboard } from '../../../components/admin/RealtimeDashboard'

export default function DashboardPage() {
  return (
    <div style={{ 
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <RealtimeDashboard />
    </div>
  )
}