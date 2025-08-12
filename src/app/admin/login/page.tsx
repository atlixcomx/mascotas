'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import AdminLoginRefactored from './AdminLoginRefactored'
import styles from './login.module.css'

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className={styles.loadingFallback}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>
            Cargando sistema de autenticación...
          </p>
        </div>
      </div>
    }>
      <AdminLoginRefactored />
    </Suspense>
  )
}