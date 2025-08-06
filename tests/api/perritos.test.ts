/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { GET } from '../../src/app/api/perritos/route'

// Mock Prisma
const mockPrismaPerrito = {
  findMany: jest.fn(),
  count: jest.fn()
}

jest.mock('../../lib/db', () => ({
  prisma: {
    perrito: mockPrismaPerrito
  }
}))

const createMockRequest = (url: string): NextRequest => {
  return new NextRequest(new URL(url))
}

const mockPerritos = [
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
    fechaIngreso: new Date('2024-01-01'),
    estado: 'disponible',
    caracter: '["amigable", "jugueton"]'
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
    fechaIngreso: new Date('2024-02-01'),
    estado: 'disponible',
    caracter: '["tranquila", "cariñosa"]'
  }
]

describe('/api/perritos API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/perritos', () => {
    test('returns paginated perritos with default parameters', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue(mockPerritos)
      mockPrismaPerrito.count.mockResolvedValue(2)

      const request = createMockRequest('http://localhost:3000/api/perritos')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('perritos')
      expect(data).toHaveProperty('pagination')
      expect(data).toHaveProperty('filters')

      expect(data.perritos).toHaveLength(2)
      expect(data.perritos[0].caracter).toEqual(['amigable', 'jugueton'])
      expect(data.perritos[0].esNuevo).toBe(true) // Recent fechaIngreso
      
      expect(data.pagination).toEqual({
        page: 1,
        limit: 12,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      })

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith({
        where: { estado: 'disponible' },
        select: {
          id: true,
          nombre: true,
          slug: true,
          fotoPrincipal: true,
          edad: true,
          tamano: true,
          raza: true,
          sexo: true,
          energia: true,
          aptoNinos: true,
          aptoPerros: true,
          aptoGatos: true,
          destacado: true,
          fechaIngreso: true,
          estado: true,
          caracter: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 12,
      })
    })

    test('handles search parameter correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([mockPerritos[0]])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos?search=Golden')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.perritos).toHaveLength(1)
      expect(data.filters.search).toBe('Golden')

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: 'disponible',
            OR: [
              { nombre: { contains: 'Golden', mode: 'insensitive' } },
              { raza: { contains: 'Golden', mode: 'insensitive' } }
            ]
          }
        })
      )
    })

    test('handles size filter correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([mockPerritos[0]])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos?tamano=Grande')
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: 'disponible',
            tamano: 'Grande'
          }
        })
      )
    })

    test('handles age filter correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([mockPerritos[0]])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos?edad=cachorro')
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: 'disponible',
            edad: { contains: 'cachorro', mode: 'insensitive' }
          }
        })
      )
    })

    test('handles gender filter correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([mockPerritos[1]])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos?genero=hembra')
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: 'disponible',
            sexo: { contains: 'hembra', mode: 'insensitive' }
          }
        })
      )
    })

    test('handles energy filter correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([mockPerritos[0]])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos?energia=Alta')
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: 'disponible',
            energia: 'Alta'
          }
        })
      )
    })

    test('handles child-friendly filter correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue(mockPerritos)
      mockPrismaPerrito.count.mockResolvedValue(2)

      const request = createMockRequest('http://localhost:3000/api/perritos?aptoNinos=true')
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: 'disponible',
            aptoNinos: true
          }
        })
      )
    })

    test('handles featured filter correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([mockPerritos[0]])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos?destacados=true')
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: 'disponible',
            destacado: true
          }
        })
      )
    })

    test('handles pagination correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([mockPerritos[1]])
      mockPrismaPerrito.count.mockResolvedValue(25)

      const request = createMockRequest('http://localhost:3000/api/perritos?page=3&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination).toEqual({
        page: 3,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: false,
        hasPrev: true
      })

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20, // (page - 1) * limit = (3 - 1) * 10
          take: 10
        })
      )
    })

    test('handles ordering correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue(mockPerritos)
      mockPrismaPerrito.count.mockResolvedValue(2)

      const request = createMockRequest('http://localhost:3000/api/perritos?orderBy=nombre&order=asc')
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { nombre: 'asc' }
        })
      )
    })

    test('handles age-based ordering (using fechaIngreso)', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue(mockPerritos)
      mockPrismaPerrito.count.mockResolvedValue(2)

      const request = createMockRequest('http://localhost:3000/api/perritos?orderBy=edad')
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { fechaIngreso: 'desc' }
        })
      )
    })

    test('handles multiple filters combined', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([mockPerritos[0]])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest(
        'http://localhost:3000/api/perritos?search=Golden&tamano=Grande&aptoNinos=true&destacados=true'
      )
      const response = await GET(request)

      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            estado: 'disponible',
            OR: [
              { nombre: { contains: 'Golden', mode: 'insensitive' } },
              { raza: { contains: 'Golden', mode: 'insensitive' } }
            ],
            tamano: 'Grande',
            aptoNinos: true,
            destacado: true
          }
        })
      )
    })

    test('processes character JSON correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue(mockPerritos)
      mockPrismaPerrito.count.mockResolvedValue(2)

      const request = createMockRequest('http://localhost:3000/api/perritos')
      const response = await GET(request)
      const data = await response.json()

      expect(data.perritos[0].caracter).toEqual(['amigable', 'jugueton'])
      expect(data.perritos[1].caracter).toEqual(['tranquila', 'cariñosa'])
    })

    test('handles invalid character JSON gracefully', async () => {
      const perritoWithInvalidJson = {
        ...mockPerritos[0],
        caracter: 'invalid json'
      }
      
      mockPrismaPerrito.findMany.mockResolvedValue([perritoWithInvalidJson])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos')
      const response = await GET(request)
      const data = await response.json()

      expect(data.perritos[0].caracter).toEqual([])
    })

    test('calculates esNuevo correctly for recent dogs', async () => {
      const recentPerrito = {
        ...mockPerritos[0],
        fechaIngreso: new Date() // Today
      }
      
      mockPrismaPerrito.findMany.mockResolvedValue([recentPerrito])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos')
      const response = await GET(request)
      const data = await response.json()

      expect(data.perritos[0].esNuevo).toBe(true)
    })

    test('calculates esNuevo correctly for old dogs', async () => {
      const oldPerrito = {
        ...mockPerritos[0],
        fechaIngreso: new Date('2023-01-01') // More than 7 days ago
      }
      
      mockPrismaPerrito.findMany.mockResolvedValue([oldPerrito])
      mockPrismaPerrito.count.mockResolvedValue(1)

      const request = createMockRequest('http://localhost:3000/api/perritos')
      const response = await GET(request)
      const data = await response.json()

      expect(data.perritos[0].esNuevo).toBe(false)
    })

    test('returns empty results when no perritos found', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([])
      mockPrismaPerrito.count.mockResolvedValue(0)

      const request = createMockRequest('http://localhost:3000/api/perritos?search=NonExistentDog')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.perritos).toEqual([])
      expect(data.pagination.total).toBe(0)
      expect(data.pagination.totalPages).toBe(0)
    })

    test('handles database errors gracefully', async () => {
      mockPrismaPerrito.findMany.mockRejectedValue(new Error('Database connection failed'))

      const request = createMockRequest('http://localhost:3000/api/perritos')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Error interno del servidor')
    })

    test('handles invalid pagination parameters', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([])
      mockPrismaPerrito.count.mockResolvedValue(0)

      const request = createMockRequest('http://localhost:3000/api/perritos?page=invalid&limit=invalid')
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(mockPrismaPerrito.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0, // Default page 1
          take: 12 // Default limit
        })
      )
    })

    test('handles large page numbers correctly', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue([])
      mockPrismaPerrito.count.mockResolvedValue(10)

      const request = createMockRequest('http://localhost:3000/api/perritos?page=999&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination).toEqual({
        page: 999,
        limit: 10,
        total: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: true
      })
    })

    test('includes all expected filters in response', async () => {
      mockPrismaPerrito.findMany.mockResolvedValue(mockPerritos)
      mockPrismaPerrito.count.mockResolvedValue(2)

      const request = createMockRequest(
        'http://localhost:3000/api/perritos?search=test&tamano=Grande&edad=adulto&genero=macho&energia=Alta&aptoNinos=true&destacados=true&orderBy=nombre'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(data.filters).toEqual({
        search: 'test',
        tamano: 'Grande',
        edad: 'adulto',
        genero: 'macho',
        energia: 'Alta',
        aptoNinos: true,
        destacados: true,
        orderBy: 'nombre'
      })
    })
  })
})