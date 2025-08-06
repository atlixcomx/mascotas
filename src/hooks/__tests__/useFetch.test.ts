import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from '../useFetch'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('useFetch Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Initial State', () => {
    test('returns initial state when autoFetch is true and url is provided', () => {
      const { result } = renderHook(() => useFetch('/api/test'))
      
      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBeNull()
      expect(result.current.isEmpty).toBe(false)
      expect(result.current.success).toBe(false)
      expect(result.current.retryCount).toBe(0)
      expect(result.current.isRetrying).toBe(false)
    })

    test('returns initial state with loading false when autoFetch is false', () => {
      const { result } = renderHook(() => 
        useFetch('/api/test', { autoFetch: false })
      )
      
      expect(result.current.loading).toBe(false)
    })

    test('returns initial state with loading false when url is null', () => {
      const { result } = renderHook(() => useFetch(null))
      
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Successful Fetch', () => {
    test('fetches data successfully', async () => {
      const mockData = { id: 1, name: 'Test' }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.success).toBe(true)
      })

      expect(result.current.data).toEqual(mockData)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.isEmpty).toBe(false)
      expect(fetch).toHaveBeenCalledWith('/api/test')
    })

    test('determines empty state for empty array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      })

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.success).toBe(true)
      })

      expect(result.current.isEmpty).toBe(true)
    })

    test('determines empty state for object with empty perritos array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ perritos: [] })
      })

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.success).toBe(true)
      })

      expect(result.current.isEmpty).toBe(true)
    })

    test('determines empty state for object with empty data array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      })

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.success).toBe(true)
      })

      expect(result.current.isEmpty).toBe(true)
    })

    test('does not consider non-empty arrays as empty', async () => {
      const mockData = [{ id: 1 }, { id: 2 }]
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.success).toBe(true)
      })

      expect(result.current.isEmpty).toBe(false)
    })
  })

  describe('Error Handling', () => {
    test('handles HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.error).toBe('HTTP 404: Not Found')
      })

      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.success).toBe(false)
    })

    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.error).toBe('Network error')
      })

      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.success).toBe(false)
    })

    test('handles unknown errors', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error')

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.error).toBe('Error desconocido')
      })
    })
  })

  describe('Retry Logic', () => {
    test('retries failed requests with exponential backoff', async () => {
      // First call fails
      mockFetch
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })

      const { result } = renderHook(() => 
        useFetch('/api/test', { retryAttempts: 3, retryDelay: 100 })
      )

      // Should start retrying
      await waitFor(() => {
        expect(result.current.isRetrying).toBe(true)
      })

      // Advance timers for first retry (100ms)
      jest.advanceTimersByTime(100)

      await waitFor(() => {
        expect(result.current.retryCount).toBe(1)
      })

      // Advance timers for second retry (200ms - exponential backoff)
      jest.advanceTimersByTime(200)

      await waitFor(() => {
        expect(result.current.retryCount).toBe(2)
      })

      // Advance timers for third attempt (400ms)
      jest.advanceTimersByTime(400)

      await waitFor(() => {
        expect(result.current.success).toBe(true)
        expect(result.current.retryCount).toBe(0)
        expect(result.current.isRetrying).toBe(false)
      })

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    test('stops retrying after max attempts', async () => {
      mockFetch.mockRejectedValue(new Error('Persistent error'))

      const { result } = renderHook(() => 
        useFetch('/api/test', { retryAttempts: 2, retryDelay: 100 })
      )

      // Wait for all retry attempts
      jest.advanceTimersByTime(100) // First retry
      jest.advanceTimersByTime(200) // Second retry

      await waitFor(() => {
        expect(result.current.error).toBe('Persistent error')
        expect(result.current.retryCount).toBe(0)
        expect(result.current.isRetrying).toBe(false)
      })

      expect(mockFetch).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })
  })

  describe('Manual Operations', () => {
    test('refetch triggers new request', async () => {
      const mockData = { id: 1, name: 'Test' }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const { result } = renderHook(() => 
        useFetch('/api/test', { autoFetch: false })
      )

      expect(result.current.loading).toBe(false)

      // Trigger refetch
      result.current.refetch()

      await waitFor(() => {
        expect(result.current.success).toBe(true)
      })

      expect(result.current.data).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('/api/test')
    })

    test('retry resets retry count and fetches again', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })

      const { result } = renderHook(() => 
        useFetch('/api/test', { retryAttempts: 1, retryDelay: 100 })
      )

      // Wait for initial failure and retry
      jest.advanceTimersByTime(100)

      await waitFor(() => {
        expect(result.current.error).toBe('First error')
      })

      // Manual retry
      result.current.retry()

      await waitFor(() => {
        expect(result.current.success).toBe(true)
      })

      expect(mockFetch).toHaveBeenCalledTimes(3) // Initial + auto retry + manual retry
    })

    test('does not fetch when url is null', () => {
      const { result } = renderHook(() => useFetch(null))

      result.current.refetch()
      result.current.retry()

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('URL Changes', () => {
    test('fetches data when URL changes', async () => {
      const mockData1 = { id: 1, name: 'First' }
      const mockData2 = { id: 2, name: 'Second' }
      
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData1)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockData2)
        })

      const { result, rerender } = renderHook(
        ({ url }) => useFetch(url),
        { initialProps: { url: '/api/first' } }
      )

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1)
      })

      // Change URL
      rerender({ url: '/api/second' })

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData2)
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/first')
      expect(mockFetch).toHaveBeenCalledWith('/api/second')
    })

    test('does not fetch when changing to null URL', () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      })

      const { rerender } = renderHook(
        ({ url }) => useFetch(url),
        { initialProps: { url: '/api/test' } }
      )

      // Change to null URL
      rerender({ url: null })

      // Should not trigger additional fetch
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Options Configuration', () => {
    test('uses custom retry attempts', async () => {
      mockFetch.mockRejectedValue(new Error('Error'))

      renderHook(() => 
        useFetch('/api/test', { retryAttempts: 5, retryDelay: 10 })
      )

      // Advance through all retry attempts
      for (let i = 0; i < 5; i++) {
        jest.advanceTimersByTime(10 * Math.pow(2, i))
      }

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(6) // Initial + 5 retries
      })
    })

    test('uses custom retry delay', async () => {
      mockFetch.mockRejectedValue(new Error('Error'))

      renderHook(() => 
        useFetch('/api/test', { retryAttempts: 1, retryDelay: 500 })
      )

      // Should not retry before custom delay
      jest.advanceTimersByTime(400)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Should retry after custom delay
      jest.advanceTimersByTime(100)
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2)
      })
    })

    test('respects autoFetch false option', () => {
      renderHook(() => 
        useFetch('/api/test', { autoFetch: false })
      )

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('handles empty response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null)
      })

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.success).toBe(true)
      })

      expect(result.current.data).toBeNull()
      expect(result.current.isEmpty).toBe(true)
    })

    test('handles malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      })

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid JSON')
      })

      expect(result.current.success).toBe(false)
    })

    test('handles concurrent requests to same URL', async () => {
      let resolveFirst: (value: any) => void
      let resolveSecond: (value: any) => void

      const firstPromise = new Promise(resolve => { resolveFirst = resolve })
      const secondPromise = new Promise(resolve => { resolveSecond = resolve })

      mockFetch
        .mockReturnValueOnce(firstPromise)
        .mockReturnValueOnce(secondPromise)

      const { result, rerender } = renderHook(
        ({ url }) => useFetch(url),
        { initialProps: { url: '/api/test' } }
      )

      // Trigger second request before first completes
      rerender({ url: '/api/test2' })

      // Resolve first request
      resolveFirst({
        ok: true,
        json: () => Promise.resolve({ from: 'first' })
      })

      // Resolve second request
      resolveSecond({
        ok: true,
        json: () => Promise.resolve({ from: 'second' })
      })

      await waitFor(() => {
        expect(result.current.data).toEqual({ from: 'second' })
      })
    })
  })
})