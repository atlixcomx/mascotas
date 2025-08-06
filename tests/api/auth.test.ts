/**
 * @jest-environment node
 */

import { authOptions } from '../../lib/auth'
import bcrypt from 'bcryptjs'

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}))

// Mock Prisma
const mockPrismaUsuario = {
  findUnique: jest.fn()
}

jest.mock('../../lib/db', () => ({
  prisma: {
    usuario: mockPrismaUsuario
  }
}))

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

const mockUser = {
  id: '1',
  email: 'admin@atlixco.com',
  nombre: 'Admin User',
  password: '$2a$12$hashedpassword',
  rol: 'admin',
  activo: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('authOptions configuration', () => {
    test('has correct structure', () => {
      expect(authOptions).toHaveProperty('providers')
      expect(authOptions).toHaveProperty('session')
      expect(authOptions).toHaveProperty('jwt')
      expect(authOptions).toHaveProperty('callbacks')
      expect(authOptions).toHaveProperty('pages')
      expect(authOptions).toHaveProperty('secret')
    })

    test('configures session correctly', () => {
      expect(authOptions.session).toEqual({
        strategy: 'jwt',
        maxAge: 24 * 60 * 60 // 24 hours
      })
    })

    test('configures JWT correctly', () => {
      expect(authOptions.jwt).toEqual({
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 24 * 60 * 60 // 24 hours
      })
    })

    test('configures custom pages correctly', () => {
      expect(authOptions.pages).toEqual({
        signIn: '/admin/login',
        error: '/admin/login'
      })
    })

    test('uses environment secret', () => {
      expect(authOptions.secret).toBe(process.env.NEXTAUTH_SECRET)
    })
  })

  describe('CredentialsProvider authorization', () => {
    const credentialsProvider = authOptions.providers[0] as any

    test('has correct provider configuration', () => {
      expect(credentialsProvider.name).toBe('credentials')
      expect(credentialsProvider.credentials).toEqual({
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      })
    })

    describe('authorize function', () => {
      test('returns null when credentials are missing', async () => {
        const result = await credentialsProvider.authorize({})
        expect(result).toBeNull()

        const result2 = await credentialsProvider.authorize({
          email: 'test@test.com'
        })
        expect(result2).toBeNull()

        const result3 = await credentialsProvider.authorize({
          password: 'password'
        })
        expect(result3).toBeNull()
      })

      test('returns null when email is empty', async () => {
        const result = await credentialsProvider.authorize({
          email: '',
          password: 'password'
        })
        expect(result).toBeNull()
      })

      test('returns null when password is empty', async () => {
        const result = await credentialsProvider.authorize({
          email: 'test@test.com',
          password: ''
        })
        expect(result).toBeNull()
      })

      test('returns null when user not found', async () => {
        mockPrismaUsuario.findUnique.mockResolvedValue(null)

        const result = await credentialsProvider.authorize({
          email: 'nonexistent@test.com',
          password: 'password'
        })

        expect(result).toBeNull()
        expect(mockPrismaUsuario.findUnique).toHaveBeenCalledWith({
          where: { email: 'nonexistent@test.com' }
        })
      })

      test('returns null when user is inactive', async () => {
        mockPrismaUsuario.findUnique.mockResolvedValue({
          ...mockUser,
          activo: false
        })

        const result = await credentialsProvider.authorize({
          email: 'admin@atlixco.com',
          password: 'password'
        })

        expect(result).toBeNull()
      })

      test('returns null when password is invalid', async () => {
        mockPrismaUsuario.findUnique.mockResolvedValue(mockUser)
        mockBcrypt.compare.mockResolvedValue(false)

        const result = await credentialsProvider.authorize({
          email: 'admin@atlixco.com',
          password: 'wrongpassword'
        })

        expect(result).toBeNull()
        expect(mockBcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password)
      })

      test('returns user object when credentials are valid', async () => {
        mockPrismaUsuario.findUnique.mockResolvedValue(mockUser)
        mockBcrypt.compare.mockResolvedValue(true)

        const result = await credentialsProvider.authorize({
          email: 'admin@atlixco.com',
          password: 'correctpassword'
        })

        expect(result).toEqual({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.nombre,
          role: mockUser.rol
        })

        expect(mockPrismaUsuario.findUnique).toHaveBeenCalledWith({
          where: { email: 'admin@atlixco.com' }
        })
        expect(mockBcrypt.compare).toHaveBeenCalledWith('correctpassword', mockUser.password)
      })

      test('handles database errors gracefully', async () => {
        mockPrismaUsuario.findUnique.mockRejectedValue(new Error('Database error'))

        const result = await credentialsProvider.authorize({
          email: 'admin@atlixco.com',
          password: 'password'
        })

        expect(result).toBeNull()
      })

      test('handles bcrypt errors gracefully', async () => {
        mockPrismaUsuario.findUnique.mockResolvedValue(mockUser)
        mockBcrypt.compare.mockRejectedValue(new Error('Bcrypt error'))

        const result = await credentialsProvider.authorize({
          email: 'admin@atlixco.com',
          password: 'password'
        })

        expect(result).toBeNull()
      })

      test('handles users with different roles', async () => {
        const editorUser = { ...mockUser, rol: 'editor' }
        mockPrismaUsuario.findUnique.mockResolvedValue(editorUser)
        mockBcrypt.compare.mockResolvedValue(true)

        const result = await credentialsProvider.authorize({
          email: 'editor@atlixco.com',
          password: 'password'
        })

        expect(result).toEqual({
          id: editorUser.id,
          email: editorUser.email,
          name: editorUser.nombre,
          role: 'editor'
        })
      })
    })
  })

  describe('JWT callback', () => {
    test('adds role to token when user is present', async () => {
      const token = { sub: '1' }
      const user = { id: '1', role: 'admin' }

      const result = await authOptions.callbacks!.jwt!({ token, user } as any)

      expect(result).toEqual({
        sub: '1',
        role: 'admin'
      })
    })

    test('returns token unchanged when user is not present', async () => {
      const token = { sub: '1', role: 'existing_role' }

      const result = await authOptions.callbacks!.jwt!({ token } as any)

      expect(result).toEqual(token)
    })

    test('handles token without existing role', async () => {
      const token = { sub: '1' }
      const user = { id: '1', role: 'editor' }

      const result = await authOptions.callbacks!.jwt!({ token, user } as any)

      expect(result.role).toBe('editor')
    })
  })

  describe('Session callback', () => {
    test('adds id and role to session from token', async () => {
      const session = {
        user: { email: 'test@test.com' },
        expires: '2024-12-31'
      }
      const token = { sub: '1', role: 'admin' }

      const result = await authOptions.callbacks!.session!({ session, token } as any)

      expect(result.user.id).toBe('1')
      expect(result.user.role).toBe('admin')
      expect(result.user.email).toBe('test@test.com')
      expect(result.expires).toBe('2024-12-31')
    })

    test('handles session when token is not present', async () => {
      const session = {
        user: { email: 'test@test.com' },
        expires: '2024-12-31'
      }

      const result = await authOptions.callbacks!.session!({ session } as any)

      expect(result).toEqual(session)
    })

    test('handles token without sub or role', async () => {
      const session = {
        user: { email: 'test@test.com' },
        expires: '2024-12-31'
      }
      const token = { someOtherProp: 'value' }

      const result = await authOptions.callbacks!.session!({ session, token } as any)

      expect(result.user.id).toBeUndefined()
      expect(result.user.role).toBeUndefined()
      expect(result.user.email).toBe('test@test.com')
    })
  })

  describe('Security considerations', () => {
    test('does not expose sensitive user data in returned user object', async () => {
      const credentialsProvider = authOptions.providers[0] as any
      
      mockPrismaUsuario.findUnique.mockResolvedValue(mockUser)
      mockBcrypt.compare.mockResolvedValue(true)

      const result = await credentialsProvider.authorize({
        email: 'admin@atlixco.com',
        password: 'password'
      })

      // Should not include password or other sensitive fields
      expect(result).not.toHaveProperty('password')
      expect(result).not.toHaveProperty('createdAt')
      expect(result).not.toHaveProperty('updatedAt')
      expect(result).not.toHaveProperty('activo')

      // Should only include necessary fields
      expect(Object.keys(result)).toEqual(['id', 'email', 'name', 'role'])
    })

    test('uses secure password comparison', async () => {
      const credentialsProvider = authOptions.providers[0] as any
      
      mockPrismaUsuario.findUnique.mockResolvedValue(mockUser)
      mockBcrypt.compare.mockResolvedValue(true)

      await credentialsProvider.authorize({
        email: 'admin@atlixco.com',
        password: 'password'
      })

      // Verify bcrypt.compare is used for password verification
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password', mockUser.password)
    })

    test('validates user activity status', async () => {
      const credentialsProvider = authOptions.providers[0] as any
      
      // Test with inactive user
      mockPrismaUsuario.findUnique.mockResolvedValue({
        ...mockUser,
        activo: false
      })

      const result = await credentialsProvider.authorize({
        email: 'admin@atlixco.com',
        password: 'password'
      })

      expect(result).toBeNull()
    })
  })

  describe('Error handling and edge cases', () => {
    test('handles null/undefined credentials gracefully', async () => {
      const credentialsProvider = authOptions.providers[0] as any

      const result1 = await credentialsProvider.authorize(null)
      const result2 = await credentialsProvider.authorize(undefined)

      expect(result1).toBeNull()
      expect(result2).toBeNull()
    })

    test('handles email with special characters', async () => {
      const credentialsProvider = authOptions.providers[0] as any
      const specialEmail = 'user+test@example-domain.co.uk'
      
      mockPrismaUsuario.findUnique.mockResolvedValue({
        ...mockUser,
        email: specialEmail
      })
      mockBcrypt.compare.mockResolvedValue(true)

      const result = await credentialsProvider.authorize({
        email: specialEmail,
        password: 'password'
      })

      expect(result).toBeTruthy()
      expect(result.email).toBe(specialEmail)
    })

    test('handles very long passwords', async () => {
      const credentialsProvider = authOptions.providers[0] as any
      const longPassword = 'a'.repeat(1000)
      
      mockPrismaUsuario.findUnique.mockResolvedValue(mockUser)
      mockBcrypt.compare.mockResolvedValue(false)

      const result = await credentialsProvider.authorize({
        email: 'admin@atlixco.com',
        password: longPassword
      })

      expect(result).toBeNull()
      expect(mockBcrypt.compare).toHaveBeenCalledWith(longPassword, mockUser.password)
    })
  })
})