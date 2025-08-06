import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button, { ButtonProps } from '../Button'

const renderButton = (props: Partial<ButtonProps> = {}) => {
  const defaultProps: ButtonProps = {
    children: 'Test Button',
    ...props
  }
  return render(<Button {...defaultProps} />)
}

describe('Button Component', () => {
  describe('Rendering', () => {
    test('renders with default props', () => {
      renderButton()
      const button = screen.getByRole('button', { name: /test button/i })
      expect(button).toBeInTheDocument()
    })

    test('renders children correctly', () => {
      const testContent = 'Custom Button Text'
      renderButton({ children: testContent })
      expect(screen.getByText(testContent)).toBeInTheDocument()
    })

    test('applies custom className', () => {
      const customClass = 'custom-button-class'
      renderButton({ className: customClass })
      const button = screen.getByRole('button')
      expect(button).toHaveClass(customClass)
    })

    test('renders with custom style', () => {
      const customStyle = { backgroundColor: 'red', color: 'white' }
      renderButton({ style: customStyle })
      const button = screen.getByRole('button')
      expect(button).toHaveStyle(customStyle)
    })
  })

  describe('Variants', () => {
    test('renders primary variant by default', () => {
      renderButton()
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        backgroundColor: '#af1731',
        color: 'white'
      })
    })

    test('renders secondary variant', () => {
      renderButton({ variant: 'secondary' })
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        border: '2px solid #c79b66',
        color: '#840f31',
        backgroundColor: 'transparent'
      })
    })

    test('renders danger variant', () => {
      renderButton({ variant: 'danger' })
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        backgroundColor: '#dc2626',
        color: 'white'
      })
    })

    test('renders outline variant', () => {
      renderButton({ variant: 'outline' })
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        border: '2px solid #af1731',
        color: '#af1731',
        backgroundColor: 'transparent'
      })
    })

    test('renders ghost variant', () => {
      renderButton({ variant: 'ghost' })
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        backgroundColor: 'transparent',
        color: '#0e312d'
      })
    })
  })

  describe('Sizes', () => {
    test('renders medium size by default', () => {
      renderButton()
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        padding: '12px 24px',
        fontSize: '16px'
      })
    })

    test('renders small size', () => {
      renderButton({ size: 'sm' })
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        padding: '8px 16px',
        fontSize: '14px'
      })
    })

    test('renders large size', () => {
      renderButton({ size: 'lg' })
      const button = screen.getByRole('button')
      expect(button).toHaveStyle({
        padding: '16px 32px',
        fontSize: '18px'
      })
    })
  })

  describe('States', () => {
    test('renders loading state', () => {
      renderButton({ isLoading: true })
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveStyle({ opacity: 0.6, cursor: 'not-allowed' })
    })

    test('renders disabled state', () => {
      renderButton({ disabled: true })
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveStyle({ opacity: 0.6, cursor: 'not-allowed' })
    })

    test('does not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const mockOnClick = jest.fn()
      renderButton({ disabled: true, onClick: mockOnClick })
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockOnClick).not.toHaveBeenCalled()
    })

    test('does not call onClick when loading', async () => {
      const user = userEvent.setup()
      const mockOnClick = jest.fn()
      renderButton({ isLoading: true, onClick: mockOnClick })
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockOnClick).not.toHaveBeenCalled()
    })
  })

  describe('Icons', () => {
    const TestIcon = () => <span data-testid="test-icon">🔍</span>

    test('renders left icon', () => {
      renderButton({ leftIcon: <TestIcon /> })
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    test('renders right icon', () => {
      renderButton({ rightIcon: <TestIcon /> })
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    test('does not render left icon when loading', () => {
      renderButton({ 
        isLoading: true,
        leftIcon: <TestIcon />
      })
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
    })

    test('still renders right icon when loading', () => {
      renderButton({ 
        isLoading: true,
        rightIcon: <TestIcon />
      })
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    test('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const mockOnClick = jest.fn()
      renderButton({ onClick: mockOnClick })
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    test('handles keyboard navigation', async () => {
      const user = userEvent.setup()
      const mockOnClick = jest.fn()
      renderButton({ onClick: mockOnClick })
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(mockOnClick).toHaveBeenCalledTimes(1)
      
      await user.keyboard(' ')
      expect(mockOnClick).toHaveBeenCalledTimes(2)
    })

    test('handles mouse events', async () => {
      const mockOnMouseEnter = jest.fn()
      const mockOnMouseLeave = jest.fn()
      
      renderButton({ 
        onMouseEnter: mockOnMouseEnter,
        onMouseLeave: mockOnMouseLeave
      })
      
      const button = screen.getByRole('button')
      
      fireEvent.mouseEnter(button)
      expect(mockOnMouseEnter).toHaveBeenCalledTimes(1)
      
      fireEvent.mouseLeave(button)
      expect(mockOnMouseLeave).toHaveBeenCalledTimes(1)
    })

    test('handles focus events', async () => {
      const mockOnFocus = jest.fn()
      const mockOnBlur = jest.fn()
      
      renderButton({ 
        onFocus: mockOnFocus,
        onBlur: mockOnBlur
      })
      
      const button = screen.getByRole('button')
      
      fireEvent.focus(button)
      expect(mockOnFocus).toHaveBeenCalledTimes(1)
      
      fireEvent.blur(button)
      expect(mockOnBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    test('has proper aria attributes', () => {
      renderButton({ 'aria-label': 'Custom button label' })
      const button = screen.getByLabelText('Custom button label')
      expect(button).toBeInTheDocument()
    })

    test('sets aria-disabled when disabled', () => {
      renderButton({ disabled: true })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    test('sets aria-disabled when loading', () => {
      renderButton({ isLoading: true })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    test('uses children as aria-label when no explicit label provided', () => {
      const buttonText = 'Submit Form'
      renderButton({ children: buttonText })
      const button = screen.getByLabelText(buttonText)
      expect(button).toBeInTheDocument()
    })
  })

  describe('Loading Spinner', () => {
    test('shows loading spinner when isLoading is true', () => {
      renderButton({ isLoading: true })
      const button = screen.getByRole('button')
      const spinner = button.querySelector('div[style*="animation"]')
      expect(spinner).toBeInTheDocument()
    })

    test('does not show loading spinner when isLoading is false', () => {
      renderButton({ isLoading: false })
      const button = screen.getByRole('button')
      const spinner = button.querySelector('div[style*="animation"]')
      expect(spinner).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('handles empty children', () => {
      renderButton({ children: '' })
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('')
    })

    test('handles React element as children', () => {
      const ReactElement = () => <span data-testid="react-child">React Element</span>
      renderButton({ children: <ReactElement /> })
      expect(screen.getByTestId('react-child')).toBeInTheDocument()
    })

    test('preserves other HTML attributes', () => {
      renderButton({ 
        'data-testid': 'custom-button',
        title: 'Button tooltip'
      })
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('title', 'Button tooltip')
    })
  })
})