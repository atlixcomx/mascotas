'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '../ui'

interface SearchBarProps {
  value: string
  onSearch: (query: string) => void
  placeholder?: string
  debounceDelay?: number
  className?: string
}

export default function SearchBar({ 
  value, 
  onSearch, 
  placeholder = "Buscar por nombre o raza...",
  debounceDelay = 300,
  className = ""
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sincronizar con valor externo
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce del valor de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onSearch(localValue)
      }
    }, debounceDelay)

    return () => clearTimeout(timer)
  }, [localValue, value, onSearch, debounceDelay])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setLocalValue('')
    onSearch('')
  }, [onSearch])

  return (
    <div className={`relative ${className}`}>
      <div style={{ position: 'relative' }}>
        <Search style={{ 
          position: 'absolute', 
          left: '12px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          width: '18px', 
          height: '18px', 
          color: '#9ca3af',
          zIndex: 1
        }} />
        <Input
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          style={{
            paddingLeft: '44px',
            paddingRight: localValue ? '40px' : '16px'
          }}
          aria-label="Búsqueda de perritos"
        />
        {localValue && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              fontSize: '18px',
              lineHeight: 1,
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#6b7280'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af'
            }}
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>
      {localValue !== value && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '8px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          animation: 'pulse 1s infinite'
        }} />
      )}
    </div>
  )
}