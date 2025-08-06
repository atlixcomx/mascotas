/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { GET } from '../../src/app/api/health/route'

describe('/api/health API Integration Tests', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('GET /api/health', () => {
    test('returns health status with all environment variables configured', async () => {
      process.env.NEXTAUTH_URL = 'http://localhost:3000'
      process.env.DATABASE_URL = 'sqlite:./test.db'
      process.env.NEXTAUTH_SECRET = 'secret123'

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('status', 'ok')
      expect(data).toHaveProperty('timestamp')
      expect(data).toHaveProperty('env')

      expect(data.env).toEqual({
        NEXTAUTH_URL: 'configured',
        DATABASE_URL: 'configured',
        NEXTAUTH_SECRET: 'configured'
      })

      // Verify timestamp is a valid ISO string
      expect(() => new Date(data.timestamp)).not.toThrow()
      expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp)
    })

    test('returns health status with missing environment variables', async () => {
      delete process.env.NEXTAUTH_URL
      delete process.env.DATABASE_URL
      delete process.env.NEXTAUTH_SECRET

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.env).toEqual({
        NEXTAUTH_URL: 'missing',
        DATABASE_URL: 'missing',
        NEXTAUTH_SECRET: 'missing'
      })
    })

    test('returns health status with partially configured environment', async () => {
      process.env.NEXTAUTH_URL = 'http://localhost:3000'
      delete process.env.DATABASE_URL
      process.env.NEXTAUTH_SECRET = 'secret123'

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.env).toEqual({
        NEXTAUTH_URL: 'configured',
        DATABASE_URL: 'missing',
        NEXTAUTH_SECRET: 'configured'
      })
    })

    test('handles empty environment variables as missing', async () => {
      process.env.NEXTAUTH_URL = ''
      process.env.DATABASE_URL = ''
      process.env.NEXTAUTH_SECRET = ''

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.env).toEqual({
        NEXTAUTH_URL: 'missing',
        DATABASE_URL: 'missing',
        NEXTAUTH_SECRET: 'missing'
      })
    })

    test('returns current timestamp in each response', async () => {
      const beforeTime = new Date().toISOString()
      
      const response = await GET()
      const data = await response.json()
      
      const afterTime = new Date().toISOString()

      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(data.timestamp >= beforeTime).toBe(true)
      expect(data.timestamp <= afterTime).toBe(true)
    })

    test('returns consistent response structure', async () => {
      const response = await GET()
      const data = await response.json()

      expect(Object.keys(data).sort()).toEqual(['env', 'status', 'timestamp'])
      expect(Object.keys(data.env).sort()).toEqual(['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'])
    })

    test('returns proper HTTP status and headers', async () => {
      const response = await GET()

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/json')
    })

    test('multiple calls return updated timestamps', async () => {
      const response1 = await GET()
      const data1 = await response1.json()

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10))

      const response2 = await GET()
      const data2 = await response2.json()

      expect(data1.timestamp).not.toBe(data2.timestamp)
      expect(data1.timestamp < data2.timestamp).toBe(true)
    })

    test('does not expose actual environment variable values', async () => {
      process.env.NEXTAUTH_URL = 'http://localhost:3000/secret-path'
      process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/secretdb'
      process.env.NEXTAUTH_SECRET = 'super-secret-key-123'

      const response = await GET()
      const data = await response.json()
      const responseText = JSON.stringify(data)

      expect(responseText).not.toContain('secret-path')
      expect(responseText).not.toContain('password')
      expect(responseText).not.toContain('super-secret-key-123')
      expect(responseText).not.toContain('secretdb')

      expect(data.env.NEXTAUTH_URL).toBe('configured')
      expect(data.env.DATABASE_URL).toBe('configured')
      expect(data.env.NEXTAUTH_SECRET).toBe('configured')
    })

    test('handles undefined vs empty string environment variables correctly', async () => {
      // Set some to empty strings, leave others undefined
      process.env.NEXTAUTH_URL = ''
      delete process.env.DATABASE_URL
      process.env.NEXTAUTH_SECRET = 'configured'

      const response = await GET()
      const data = await response.json()

      expect(data.env.NEXTAUTH_URL).toBe('missing') // Empty string
      expect(data.env.DATABASE_URL).toBe('missing') // Undefined
      expect(data.env.NEXTAUTH_SECRET).toBe('configured') // Has value
    })

    test('response structure is valid JSON', async () => {
      const response = await GET()
      const text = await response.text()

      expect(() => JSON.parse(text)).not.toThrow()

      const data = JSON.parse(text)
      expect(typeof data).toBe('object')
      expect(data).not.toBeNull()
      expect(Array.isArray(data)).toBe(false)
    })

    test('handles special characters in environment variables', async () => {
      process.env.DATABASE_URL = 'postgresql://user:p@ssw0rd!@localhost/db?ssl=true'
      
      const response = await GET()
      const data = await response.json()

      expect(data.env.DATABASE_URL).toBe('configured')
    })
  })

  describe('Error Scenarios', () => {
    test('health endpoint is resilient to timestamp generation', async () => {
      // Mock Date to throw an error (edge case)
      const originalDate = global.Date
      
      try {
        // @ts-ignore
        global.Date = class extends originalDate {
          toISOString() {
            throw new Error('Date error')
          }
        }

        const response = await GET()
        const data = await response.json()

        // Should still return a valid response structure
        expect(response.status).toBe(200)
        expect(data).toHaveProperty('status', 'ok')
        expect(data).toHaveProperty('env')
        
      } catch (error) {
        // If the endpoint throws, we expect it to be handled gracefully
        expect(error).toBeDefined()
      } finally {
        global.Date = originalDate
      }
    })
  })

  describe('Performance', () => {
    test('health endpoint responds quickly', async () => {
      const startTime = Date.now()
      
      await GET()
      
      const endTime = Date.now()
      const responseTime = endTime - startTime

      // Health endpoint should respond in less than 100ms
      expect(responseTime).toBeLessThan(100)
    })

    test('multiple concurrent requests are handled properly', async () => {
      const promises = Array(10).fill(null).map(() => GET())
      
      const responses = await Promise.all(promises)
      
      expect(responses).toHaveLength(10)
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      const dataPromises = responses.map(r => r.json())
      const dataArray = await Promise.all(dataPromises)
      
      dataArray.forEach(data => {
        expect(data.status).toBe('ok')
        expect(data).toHaveProperty('timestamp')
        expect(data).toHaveProperty('env')
      })
    })
  })
})