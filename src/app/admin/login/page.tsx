'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import ModernAdminLogin from './ModernAdminLogin'
import styles from './modern-login.module.css'

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
      </div>
    }>
      <ModernAdminLogin />
    </Suspense>
  )
}