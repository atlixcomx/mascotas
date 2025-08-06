import { renderHook, waitFor } from '@testing-library/react'
import { usePerritos, usePerrito } from '../usePerritos'

// Mock the useFetch hook
jest.mock('../useFetch', () => ({
  useFetch: jest.fn()
}))

const mockUseFetch = require('../useFetch').useFetch as jest.MockedFunction<typeof import('../useFetch').useFetch>

const mockPerritosResponse = {
  perritos: [
    {
      id: '1',
      nombre: 'Max',
      slug: 'max-golden',
      fotoPrincipal: '/images/max.jpg',
      edad: '3 años',
      tamano: 'Grande',
      raza: 'Golden Retriever',
      sexo: 'Macho',
      energia: 'Alta',
      aptoNinos: true,
      aptoPerros: true,
      aptoGatos: false,
      destacado: true,
      fechaIngreso: '2024-01-01',
      estado: 'disponible',
      caracter: ['amigable', 'jugueton'],
      esNuevo: true
    },
    {
      id: '2',
      nombre: 'Luna',
      slug: 'luna-labrador',
      fotoPrincipal: '/images/luna.jpg',
      edad: '2 años',
      tamano: 'Mediano',
      raza: 'Labrador',
      sexo: 'Hembra',
      energia: 'Media',
      aptoNinos: true,
      aptoPerros: true,
      aptoGatos: true,
      destacado: false,
      fechaIngreso: '2024-02-01',
      estado: 'disponible',
      caracter: ['tranquila', 'cariñosa'],
      esNuevo: false
    }
  ],
  pagination: {
    page: 1,
    limit: 12,
    total: 2,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  },
  filters: {
    search: '',
    tamano: '',
    edad: '',
    genero: '',
    energia: '',
    aptoNinos: false,
    destacados: false,
    orderBy: 'createdAt'
  }
}

const mockPerritoDetail = {
  id: '1',
  nombre: 'Max',
  slug: 'max-golden',
  fotoPrincipal: '/images/max.jpg',
  fotos: ['/images/max.jpg', '/images/max2.jpg'],
  edad: '3 años',
  tamano: 'Grande',
  raza: 'Golden Retriever',
  sexo: 'Macho',
  energia: 'Alta',
  aptoNinos: true,
  aptoPerros: true,
  aptoGatos: false,
  destacado: true,
  fechaIngreso: '2024-01-01',
  estado: 'disponible',
  caracter: ['amigable', 'jugueton'],
  esNuevo: true,
  historia: 'Max es un perro muy cariñoso...',
  similares: [],
  vistas: 150,
  peso: 25,
  procedencia: 'Rescate',
  vacunas: true,
  esterilizado: true,
  desparasitado: true,
  saludNotas: 'En perfecto estado de salud'
}

describe('usePerritos Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Default Behavior', () => {
    test('constructs correct URL with no filters', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      renderHook(() => usePerritos())

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos?', {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })

    test('returns processed data correctly', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerritos())

      expect(result.current.perritos).toEqual(mockPerritosResponse.perritos)
      expect(result.current.pagination).toEqual(mockPerritosResponse.pagination)
      expect(result.current.appliedFilters).toEqual(mockPerritosResponse.filters)
    })

    test('returns default pagination when data is null', () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        isEmpty: false,
        success: false,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerritos())

      expect(result.current.perritos).toEqual([])
      expect(result.current.pagination).toEqual({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      })
      expect(result.current.appliedFilters).toEqual({})
    })
  })

  describe('Filter URL Construction', () => {
    test('constructs URL with search filter', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      renderHook(() => usePerritos({ search: 'Golden' }))

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos?search=Golden', {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })

    test('constructs URL with size filter', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      renderHook(() => usePerritos({ tamano: 'Grande' }))

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos?tamano=Grande', {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })

    test('constructs URL with multiple filters', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      renderHook(() => usePerritos({ 
        search: 'Labrador',
        tamano: 'Mediano',
        edad: 'adulto',
        genero: 'hembra',
        energia: 'Alta',
        aptoNinos: true,
        orderBy: 'nombre',
        page: 2,
        limit: 24
      }))

      const expectedUrl = '/api/perritos?' + 
        'search=Labrador&' +
        'tamano=Mediano&' +
        'edad=adulto&' +
        'genero=hembra&' +
        'energia=Alta&' +
        'aptoNinos=true&' +
        'orderBy=nombre&' +
        'page=2&' +
        'limit=24'

      expect(mockUseFetch).toHaveBeenCalledWith(expectedUrl, {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })

    test('ignores undefined, empty string, and false values', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      renderHook(() => usePerritos({ 
        search: '',
        tamano: undefined,
        aptoNinos: false,
        page: 1
      }))

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos?', {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })

    test('includes page=1 when it is not default (page 1)', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      renderHook(() => usePerritos({ page: 2 }))

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos?page=2', {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })
  })

  describe('State Propagation', () => {
    test('propagates loading state', () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        isEmpty: false,
        success: false,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerritos())

      expect(result.current.loading).toBe(true)
    })

    test('propagates error state', () => {
      const errorMessage = 'Network error'
      
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: errorMessage,
        isEmpty: false,
        success: false,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerritos())

      expect(result.current.error).toBe(errorMessage)
    })

    test('propagates empty state', () => {
      mockUseFetch.mockReturnValue({
        data: { ...mockPerritosResponse, perritos: [] },
        loading: false,
        error: null,
        isEmpty: true,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerritos())

      expect(result.current.isEmpty).toBe(true)
      expect(result.current.perritos).toEqual([])
    })

    test('propagates retry functions', () => {
      const mockRefetch = jest.fn()
      const mockRetry = jest.fn()

      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 2,
        refetch: mockRefetch,
        retry: mockRetry,
        isRetrying: true
      })

      const { result } = renderHook(() => usePerritos())

      expect(result.current.refetch).toBe(mockRefetch)
      expect(result.current.retry).toBe(mockRetry)
      expect(result.current.retryCount).toBe(2)
      expect(result.current.isRetrying).toBe(true)
    })
  })

  describe('Filter Updates', () => {
    test('updates URL when filters change', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritosResponse,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { rerender } = renderHook(
        ({ filters }) => usePerritos(filters),
        { initialProps: { filters: { search: 'Golden' } } }
      )

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos?search=Golden', {
        retryAttempts: 3,
        retryDelay: 1000
      })

      rerender({ filters: { search: 'Labrador', tamano: 'Grande' } })

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos?search=Labrador&tamano=Grande', {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })
  })
})

describe('usePerrito Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Default Behavior', () => {
    test('constructs correct URL with slug', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritoDetail,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      renderHook(() => usePerrito('max-golden'))

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos/max-golden', {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })

    test('uses null URL when slug is null', () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: null,
        isEmpty: false,
        success: false,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      renderHook(() => usePerrito(null))

      expect(mockUseFetch).toHaveBeenCalledWith(null, {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })

    test('returns perrito data correctly', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritoDetail,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerrito('max-golden'))

      expect(result.current.perrito).toEqual(mockPerritoDetail)
      expect(result.current.notFound).toBe(false)
    })
  })

  describe('Not Found State', () => {
    test('returns notFound=true when perrito is not found and not loading', () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: null,
        isEmpty: false,
        success: false,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerrito('non-existent-slug'))

      expect(result.current.notFound).toBe(true)
      expect(result.current.perrito).toBeNull()
    })

    test('returns notFound=false when loading', () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        isEmpty: false,
        success: false,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerrito('some-slug'))

      expect(result.current.notFound).toBe(false)
    })

    test('returns notFound=false when there is an error', () => {
      mockUseFetch.mockReturnValue({
        data: null,
        loading: false,
        error: 'Network error',
        isEmpty: false,
        success: false,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerrito('some-slug'))

      expect(result.current.notFound).toBe(false)
      expect(result.current.error).toBe('Network error')
    })

    test('returns notFound=false when perrito is found', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritoDetail,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerrito('max-golden'))

      expect(result.current.notFound).toBe(false)
      expect(result.current.perrito).toEqual(mockPerritoDetail)
    })
  })

  describe('State Propagation', () => {
    test('propagates all useFetch states', () => {
      const mockRefetch = jest.fn()
      const mockRetry = jest.fn()

      mockUseFetch.mockReturnValue({
        data: mockPerritoDetail,
        loading: true,
        error: 'Some error',
        isEmpty: true,
        success: false,
        retryCount: 3,
        refetch: mockRefetch,
        retry: mockRetry,
        isRetrying: true
      })

      const { result } = renderHook(() => usePerrito('max-golden'))

      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBe('Some error')
      expect(result.current.isEmpty).toBe(true)
      expect(result.current.success).toBe(false)
      expect(result.current.retryCount).toBe(3)
      expect(result.current.isRetrying).toBe(true)
      expect(result.current.refetch).toBe(mockRefetch)
      expect(result.current.retry).toBe(mockRetry)
    })
  })

  describe('Slug Changes', () => {
    test('updates URL when slug changes', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritoDetail,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { rerender } = renderHook(
        ({ slug }) => usePerrito(slug),
        { initialProps: { slug: 'max-golden' } }
      )

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos/max-golden', {
        retryAttempts: 3,
        retryDelay: 1000
      })

      rerender({ slug: 'luna-labrador' })

      expect(mockUseFetch).toHaveBeenCalledWith('/api/perritos/luna-labrador', {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })

    test('handles slug changing to null', () => {
      mockUseFetch.mockReturnValue({
        data: mockPerritoDetail,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { rerender } = renderHook(
        ({ slug }) => usePerrito(slug),
        { initialProps: { slug: 'max-golden' } }
      )

      rerender({ slug: null })

      expect(mockUseFetch).toHaveBeenCalledWith(null, {
        retryAttempts: 3,
        retryDelay: 1000
      })
    })
  })

  describe('TypeScript Types', () => {
    test('returns correct extended perrito type', () => {
      const extendedPerrito = {
        ...mockPerritoDetail,
        fotos: ['/image1.jpg', '/image2.jpg'],
        historia: 'A wonderful dog story',
        similares: [],
        vistas: 100,
        peso: 25,
        procedencia: 'Shelter',
        vacunas: true,
        esterilizado: true,
        desparasitado: true,
        saludNotas: 'Healthy'
      }

      mockUseFetch.mockReturnValue({
        data: extendedPerrito,
        loading: false,
        error: null,
        isEmpty: false,
        success: true,
        retryCount: 0,
        refetch: jest.fn(),
        retry: jest.fn(),
        isRetrying: false
      })

      const { result } = renderHook(() => usePerrito('max-golden'))

      expect(result.current.perrito).toEqual(extendedPerrito)
      
      // These properties should be accessible (TypeScript compilation would fail if types are wrong)
      if (result.current.perrito) {
        expect(result.current.perrito.fotos).toBeDefined()
        expect(result.current.perrito.historia).toBeDefined()
        expect(result.current.perrito.similares).toBeDefined()
        expect(result.current.perrito.vistas).toBeDefined()
      }
    })
  })
})