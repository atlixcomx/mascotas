'use client'

import { useCallback, useState, useEffect } from 'react'
import { Filter, X, RotateCcw, Settings } from 'lucide-react'
import { Button, Select } from '../ui'

export interface FilterOptions {
  search: string
  tamano: string
  edad: string
  genero: string
  energia: string
  aptoNinos: boolean
  orderBy: string
}

interface FilterPanelProps {
  filters: FilterOptions
  onFilterChange: (key: keyof FilterOptions, value: any) => void
  onClearFilters: () => void
  resultCount?: number
  totalCount?: number
  showHeader?: boolean
  className?: string
  isMobile?: boolean
}

export default function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount = 0,
  totalCount = 0,
  showHeader = true,
  className = "",
  isMobile = false
}: FilterPanelProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(isMobile)

  // Detectar si estamos en vista móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevenir scroll cuando el drawer está abierto
  useEffect(() => {
    if (isDrawerOpen && isMobileView) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen, isMobileView])

  const hasActiveFilters = useCallback(() => {
    return filters.search || 
           filters.tamano || 
           filters.edad || 
           filters.genero ||
           filters.energia || 
           filters.aptoNinos ||
           (filters.orderBy && filters.orderBy !== 'createdAt')
  }, [filters])

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  const handleClearAndClose = () => {
    onClearFilters()
    if (isMobileView) {
      closeDrawer()
    }
  }

  const handleSelectChange = useCallback((key: keyof FilterOptions) => {
    return (value: string) => {
      onFilterChange(key, value)
    }
  }, [onFilterChange])

  const handleCheckboxChange = useCallback((key: keyof FilterOptions) => {
    return (checked: boolean) => {
      onFilterChange(key, checked)
    }
  }, [onFilterChange])

  // Contenido de filtros común
  const FilterContent = () => (
    <>
      {/* Tamaño */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '8px'
        }}>
          Tamaño
        </label>
        <Select
          value={filters.tamano}
          onValueChange={handleSelectChange('tamano')}
          placeholder="Todos los tamaños"
        >
          <option value="">Todos los tamaños</option>
          <option value="pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
        </Select>
      </div>

      {/* Edad */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '8px'
        }}>
          Edad
        </label>
        <Select
          value={filters.edad}
          onValueChange={handleSelectChange('edad')}
          placeholder="Todas las edades"
        >
          <option value="">Todas las edades</option>
          <option value="cachorro">Cachorro (0-1 año)</option>
          <option value="joven">Joven (1-3 años)</option>
          <option value="adulto">Adulto (3-7 años)</option>
          <option value="senior">Senior (7+ años)</option>
        </Select>
      </div>

      {/* Género */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '8px'
        }}>
          Género
        </label>
        <Select
          value={filters.genero}
          onValueChange={handleSelectChange('genero')}
          placeholder="Todos los géneros"
        >
          <option value="">Todos los géneros</option>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
        </Select>
      </div>

      {/* Nivel de Energía */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '8px'
        }}>
          Nivel de Energía
        </label>
        <Select
          value={filters.energia}
          onValueChange={handleSelectChange('energia')}
          placeholder="Todos los niveles"
        >
          <option value="">Todos los niveles</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </Select>
      </div>

      {/* Apto para niños */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151'
        }}>
          <input
            type="checkbox"
            checked={filters.aptoNinos}
            onChange={(e) => handleCheckboxChange('aptoNinos')(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              marginRight: '8px',
              accentColor: '#af1731',
              cursor: 'pointer'
            }}
          />
          Apto para niños
        </label>
      </div>

      {/* Ordenar por */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '8px'
        }}>
          Ordenar por
        </label>
        <Select
          value={filters.orderBy}
          onValueChange={handleSelectChange('orderBy')}
        >
          <option value="createdAt">Más recientes</option>
          <option value="nombre">Nombre A-Z</option>
          <option value="edad">Edad (menor a mayor)</option>
          <option value="fechaIngreso">Fecha de ingreso</option>
        </Select>
      </div>

      {/* Contador de resultados */}
      {(resultCount > 0 || totalCount > 0) && (
        <div style={{ 
          borderTop: '1px solid #e5e7eb',
          paddingTop: '16px',
          fontSize: '14px', 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          {resultCount === totalCount ? (
            <span>Mostrando <strong>{totalCount}</strong> perritos</span>
          ) : (
            <span>
              Mostrando <strong>{resultCount}</strong> de <strong>{totalCount}</strong> perritos
            </span>
          )}
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters() && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <Filter style={{ width: '12px', height: '12px' }} />
            <span style={{ fontWeight: '500' }}>Filtros aplicados:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {filters.search && (
              <span style={{ 
                backgroundColor: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                Búsqueda: "{filters.search}"
              </span>
            )}
            {filters.tamano && (
              <span style={{ 
                backgroundColor: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                Tamaño: {filters.tamano}
              </span>
            )}
            {filters.edad && (
              <span style={{ 
                backgroundColor: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                Edad: {filters.edad}
              </span>
            )}
            {filters.genero && (
              <span style={{ 
                backgroundColor: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                Género: {filters.genero}
              </span>
            )}
            {filters.energia && (
              <span style={{ 
                backgroundColor: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                Energía: {filters.energia}
              </span>
            )}
            {filters.aptoNinos && (
              <span style={{ 
                backgroundColor: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                Apto niños: Sí
              </span>
            )}
            {filters.orderBy && filters.orderBy !== 'createdAt' && (
              <span style={{ 
                backgroundColor: '#e5e7eb',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                Orden: {filters.orderBy === 'nombre' ? 'Nombre A-Z' :
                         filters.orderBy === 'edad' ? 'Edad' : 
                         'Fecha ingreso'}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  )

  // Vista móvil con drawer
  if (isMobileView) {
    return (
      <>
        {/* Botón para abrir filtros en móvil */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '16px'
        }}>
          <button
            onClick={openDrawer}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#af1731',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              minHeight: '44px'
            }}
            aria-label="Abrir filtros"
          >
            <Settings style={{ width: '18px', height: '18px' }} />
            Filtros
            {hasActiveFilters() && (
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '12px',
                fontWeight: '600',
                minWidth: '16px',
                textAlign: 'center'
              }}>
                {[filters.tamano, filters.edad, filters.genero, filters.energia, 
                  filters.aptoNinos, filters.orderBy !== 'createdAt' ? filters.orderBy : null,
                  filters.search].filter(Boolean).length}
              </span>
            )}
          </button>
          
          {hasActiveFilters() && (
            <button
              onClick={onClearFilters}
              style={{
                backgroundColor: 'transparent',
                color: '#af1731',
                border: '1px solid #af1731',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                minHeight: '44px'
              }}
            >
              <RotateCcw style={{ width: '14px', height: '14px' }} />
              Limpiar
            </button>
          )}
        </div>

        {/* Overlay */}
        {isDrawerOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000
            }}
            onClick={closeDrawer}
          />
        )}

        {/* Drawer móvil */}
        <div
          style={{
            position: 'fixed',
            bottom: isDrawerOpen ? 0 : '-100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.15)',
            zIndex: 1001,
            transition: 'bottom 0.3s ease',
            maxHeight: '85vh',
            overflow: 'hidden'
          }}
        >
          {/* Header del drawer */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter style={{ width: '20px', height: '20px', color: '#af1731' }} />
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1f2937' 
              }}>
                Filtros de Búsqueda
              </h3>
            </div>
            <button
              onClick={closeDrawer}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              aria-label="Cerrar filtros"
            >
              <X style={{ width: '24px', height: '24px', color: '#4a4a4a' }} />
            </button>
          </div>

          {/* Contenido del drawer */}
          <div style={{ 
            padding: '20px',
            overflowY: 'auto',
            maxHeight: 'calc(85vh - 140px)'
          }}>
            <FilterContent />
          </div>

          {/* Footer con botones */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white',
            display: 'flex',
            gap: '12px',
            position: 'sticky',
            bottom: 0
          }}>
            {hasActiveFilters() && (
              <button
                onClick={handleClearAndClose}
                style={{
                  flex: '1',
                  backgroundColor: 'transparent',
                  color: '#af1731',
                  border: '1px solid #af1731',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  minHeight: '48px'
                }}
              >
                <RotateCcw style={{ width: '16px', height: '16px' }} />
                Limpiar Filtros
              </button>
            )}
            <button
              onClick={closeDrawer}
              style={{
                flex: hasActiveFilters() ? '2' : '1',
                backgroundColor: '#af1731',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '48px'
              }}
            >
              {hasActiveFilters() ? 
                `Ver ${resultCount} Resultado${resultCount !== 1 ? 's' : ''}` : 
                'Aplicar Filtros'
              }
            </button>
          </div>
        </div>
      </>
    )
  }

  // Vista desktop (original)
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {showHeader && (
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter style={{ width: '18px', height: '18px', color: '#6b7280' }} />
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1f2937' 
            }}>
              Filtros
            </h3>
          </div>
          {hasActiveFilters() && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                fontSize: '12px',
                padding: '4px 8px'
              }}
            >
              <RotateCcw style={{ width: '14px', height: '14px' }} />
              Limpiar
            </Button>
          )}
        </div>
      )}
      
      <div style={{ padding: '20px' }}>
        <FilterContent />
      </div>
    </div>
  )
}