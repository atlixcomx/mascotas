'use client'

import React, { ReactNode } from 'react'
import styles from './ResponsiveTable.module.css'

interface ResponsiveTableProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <table className={styles.table}>
        {children}
      </table>
    </div>
  )
}

interface TableHeadProps {
  children: ReactNode
}

export function TableHead({ children }: TableHeadProps) {
  return <thead className={styles.thead}>{children}</thead>
}

interface TableBodyProps {
  children: ReactNode
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className={styles.tbody}>{children}</tbody>
}

interface TableRowProps {
  children: ReactNode
  onClick?: () => void
}

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr className={styles.tr} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {children}
    </tr>
  )
}

interface TableHeaderProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
}

export function TableHeader({ children, align = 'left' }: TableHeaderProps) {
  return (
    <th className={styles.th} style={{ textAlign: align }}>
      {children}
    </th>
  )
}

interface TableCellProps {
  children: ReactNode
  dataLabel?: string
  align?: 'left' | 'center' | 'right'
}

export function TableCell({ children, dataLabel, align = 'left' }: TableCellProps) {
  return (
    <td className={styles.td} data-label={dataLabel} style={{ textAlign: align }}>
      {children}
    </td>
  )
}

// Status Badge Component
interface StatusBadgeProps {
  status: 'disponible' | 'proceso' | 'adoptado' | 'tratamiento'
  children: ReactNode
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      {children}
    </span>
  )
}

// Action Button Component
interface ActionButtonProps {
  type: 'view' | 'edit' | 'delete'
  onClick: () => void
  children: ReactNode
  ariaLabel: string
}

export function ActionButton({ type, onClick, children, ariaLabel }: ActionButtonProps) {
  return (
    <button
      className={`${styles.actionButton} ${styles[type]}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  )
}

// Pet Info Component for consistent pet display
interface PetInfoProps {
  imageUrl: string
  name: string
  code: string
}

export function PetInfo({ imageUrl, name, code }: PetInfoProps) {
  return (
    <div className={styles.petInfo}>
      <img 
        src={imageUrl} 
        alt={`Foto de ${name}`}
        className={styles.petImage}
      />
      <div className={styles.petDetails}>
        <p className={styles.petName}>{name}</p>
        <p className={styles.petCode}>{code}</p>
      </div>
    </div>
  )
}