import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../SearchBar'

interface SearchBarProps {
  value: string
  onSearch: (query: string) => void
  placeholder?: string
  debounceDelay?: number
  className?: string
}

const renderSearchBar = (props: Partial<SearchBarProps> = {}) => {
  const defaultProps: SearchBarProps = {
    value: '',
    onSearch: jest.fn(),
    ...props
  }
  return render(<SearchBar {...defaultProps} />)
}

describe('SearchBar Component', () => {
  beforeEach(() => {
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Rendering', () => {
    test('renders search input with default placeholder', () => {
      renderSearchBar()
      
      const input = screen.getByPlaceholderText(/buscar por nombre o raza/i)
      expect(input).toBeInTheDocument()
    })

    test('renders with custom placeholder', () => {
      renderSearchBar({ placeholder: 'Search dogs...' })
      
      const input = screen.getByPlaceholderText('Search dogs...')
      expect(input).toBeInTheDocument()
    })

    test('renders search icon', () => {
      renderSearchBar()
      
      // Search icon should be present in the component
      const searchContainer = screen.getByLabelText(/búsqueda de perritos/i).parentElement
      expect(searchContainer).toBeInTheDocument()
    })

    test('displays current value', () => {
      renderSearchBar({ value: 'Golden Retriever' })
      
      const input = screen.getByDisplayValue('Golden Retriever')
      expect(input).toBeInTheDocument()
    })

    test('applies custom className', () => {
      const { container } = renderSearchBar({ className: 'custom-search' })
      
      expect(container.firstChild).toHaveClass('custom-search')
    })
  })

  describe('Search Functionality', () => {
    test('updates local value when typing', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ onSearch: mockOnSearch })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      
      await user.type(input, 'Labrador')
      
      expect(input).toHaveValue('Labrador')
    })

    test('calls onSearch after debounce delay', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ onSearch: mockOnSearch, debounceDelay: 300 })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      
      await user.type(input, 'Lab')
      
      // onSearch should not be called immediately
      expect(mockOnSearch).not.toHaveBeenCalled()
      
      // Fast-forward time by debounce delay
      jest.advanceTimersByTime(300)
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('Lab')
      })
    })

    test('debounces multiple keystrokes', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ onSearch: mockOnSearch, debounceDelay: 300 })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      
      // Type multiple characters quickly
      await user.type(input, 'L')
      jest.advanceTimersByTime(100)
      
      await user.type(input, 'a')
      jest.advanceTimersByTime(100)
      
      await user.type(input, 'b')
      
      // onSearch should not be called yet
      expect(mockOnSearch).not.toHaveBeenCalled()
      
      // Complete the debounce delay
      jest.advanceTimersByTime(300)
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1)
        expect(mockOnSearch).toHaveBeenCalledWith('Lab')
      })
    })

    test('uses custom debounce delay', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ onSearch: mockOnSearch, debounceDelay: 500 })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      
      await user.type(input, 'Test')
      
      // Should not be called after default delay
      jest.advanceTimersByTime(300)
      expect(mockOnSearch).not.toHaveBeenCalled()
      
      // Should be called after custom delay
      jest.advanceTimersByTime(200)
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('Test')
      })
    })
  })

  describe('Clear Functionality', () => {
    test('shows clear button when there is text', () => {
      renderSearchBar({ value: 'Some text' })
      
      const clearButton = screen.getByLabelText(/limpiar búsqueda/i)
      expect(clearButton).toBeInTheDocument()
    })

    test('does not show clear button when input is empty', () => {
      renderSearchBar({ value: '' })
      
      const clearButton = screen.queryByLabelText(/limpiar búsqueda/i)
      expect(clearButton).not.toBeInTheDocument()
    })

    test('clears input and calls onSearch when clear button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ value: 'Test query', onSearch: mockOnSearch })
      
      const clearButton = screen.getByLabelText(/limpiar búsqueda/i)
      await user.click(clearButton)
      
      expect(mockOnSearch).toHaveBeenCalledWith('')
    })

    test('updates input value immediately when cleared', async () => {
      const user = userEvent.setup()
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ value: 'Test query', onSearch: mockOnSearch })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      const clearButton = screen.getByLabelText(/limpiar búsqueda/i)
      
      expect(input).toHaveValue('Test query')
      
      await user.click(clearButton)
      
      expect(input).toHaveValue('')
    })
  })

  describe('External Value Synchronization', () => {
    test('updates local value when external value changes', () => {
      const { rerender } = renderSearchBar({ value: 'Initial' })
      
      let input = screen.getByLabelText(/búsqueda de perritos/i)
      expect(input).toHaveValue('Initial')
      
      rerender(<SearchBar value="Updated" onSearch={jest.fn()} />)
      
      input = screen.getByLabelText(/búsqueda de perritos/i)
      expect(input).toHaveValue('Updated')
    })

    test('does not call onSearch when external value changes', () => {
      const mockOnSearch = jest.fn()
      const { rerender } = renderSearchBar({ 
        value: 'Initial', 
        onSearch: mockOnSearch 
      })
      
      rerender(<SearchBar value="Updated" onSearch={mockOnSearch} />)
      
      jest.advanceTimersByTime(1000)
      
      expect(mockOnSearch).not.toHaveBeenCalled()
    })
  })

  describe('Visual Indicators', () => {
    test('shows pending indicator when local value differs from prop value', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      
      renderSearchBar({ value: 'Initial' })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      
      // Type to change local value
      await user.clear(input)
      await user.type(input, 'Changed')
      
      // Look for the pending indicator (blue dot)
      const container = input.closest('.relative')
      const pendingIndicator = container?.querySelector('div[style*="backgroundColor: #3b82f6"]')
      
      expect(pendingIndicator).toBeInTheDocument()
    })

    test('does not show pending indicator when values match', () => {
      renderSearchBar({ value: 'Same value' })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      const container = input.closest('.relative')
      const pendingIndicator = container?.querySelector('div[style*="backgroundColor: #3b82f6"]')
      
      expect(pendingIndicator).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('has proper aria-label for input', () => {
      renderSearchBar()
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      expect(input).toBeInTheDocument()
    })

    test('has proper aria-label for clear button', () => {
      renderSearchBar({ value: 'Test' })
      
      const clearButton = screen.getByLabelText(/limpiar búsqueda/i)
      expect(clearButton).toBeInTheDocument()
    })

    test('input has correct type attribute', () => {
      renderSearchBar()
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      expect(input).toHaveAttribute('type', 'text')
    })
  })

  describe('Styling and Layout', () => {
    test('applies correct padding for search icon', () => {
      renderSearchBar()
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      expect(input).toHaveStyle({
        paddingLeft: '44px'
      })
    })

    test('applies correct padding when clear button is visible', () => {
      renderSearchBar({ value: 'Test' })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      expect(input).toHaveStyle({
        paddingRight: '40px'
      })
    })

    test('applies default padding when no clear button', () => {
      renderSearchBar({ value: '' })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      expect(input).toHaveStyle({
        paddingRight: '16px'
      })
    })
  })

  describe('Edge Cases', () => {
    test('handles empty string search', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ value: 'Initial', onSearch: mockOnSearch })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      
      await user.clear(input)
      
      jest.advanceTimersByTime(300)
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('')
      })
    })

    test('handles special characters in search', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ onSearch: mockOnSearch })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      const specialChars = 'áéíóú ñ @#$%'
      
      await user.type(input, specialChars)
      
      jest.advanceTimersByTime(300)
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(specialChars)
      })
    })

    test('handles very long search terms', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ onSearch: mockOnSearch })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      const longText = 'A'.repeat(100)
      
      await user.type(input, longText)
      
      jest.advanceTimersByTime(300)
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(longText)
      })
    })

    test('handles rapid clear and type actions', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const mockOnSearch = jest.fn()
      
      renderSearchBar({ value: 'Initial', onSearch: mockOnSearch })
      
      const input = screen.getByLabelText(/búsqueda de perritos/i)
      const clearButton = screen.getByLabelText(/limpiar búsqueda/i)
      
      // Clear and immediately type
      await user.click(clearButton)
      await user.type(input, 'New')
      
      jest.advanceTimersByTime(300)
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('')
        expect(mockOnSearch).toHaveBeenCalledWith('New')
      })
    })
  })
})