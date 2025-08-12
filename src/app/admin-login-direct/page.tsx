'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import AdminLoginRefactored from '../admin/login/AdminLoginRefactored'
import styles from '../admin/login/login.module.css'

export default function AdminLoginDirect() {
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