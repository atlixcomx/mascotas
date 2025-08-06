import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal, { ConfirmModal, AlertModal, ModalProps, ConfirmModalProps, AlertModalProps } from '../Modal'

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}))

const renderModal = (props: Partial<ModalProps> = {}) => {
  const defaultProps: ModalProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal Content</div>,
    ...props
  }
  return render(<Modal {...defaultProps} />)
}

const renderConfirmModal = (props: Partial<ConfirmModalProps> = {}) => {
  const defaultProps: ConfirmModalProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    message: 'Are you sure?',
    ...props
  }
  return render(<ConfirmModal {...defaultProps} />)
}

const renderAlertModal = (props: Partial<AlertModalProps> = {}) => {
  const defaultProps: AlertModalProps = {
    isOpen: true,
    onClose: jest.fn(),
    message: 'Alert message',
    ...props
  }
  return render(<AlertModal {...defaultProps} />)
}

describe('Modal Component', () => {
  beforeEach(() => {
    // Reset body overflow style
    document.body.style.overflow = 'unset'
  })

  describe('Basic Modal', () => {
    test('renders when isOpen is true', () => {
      renderModal()
      expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    test('does not render when isOpen is false', () => {
      renderModal({ isOpen: false })
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
    })

    test('renders with title', () => {
      renderModal({ title: 'Test Modal' })
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
    })

    test('renders close button by default', () => {
      renderModal({ title: 'Test Modal' })
      const closeButton = screen.getByLabelText(/cerrar modal/i)
      expect(closeButton).toBeInTheDocument()
    })

    test('does not render close button when showCloseButton is false', () => {
      renderModal({ title: 'Test Modal', showCloseButton: false })
      expect(screen.queryByLabelText(/cerrar modal/i)).not.toBeInTheDocument()
    })

    test('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnClose = jest.fn()
      
      renderModal({ title: 'Test Modal', onClose: mockOnClose })
      
      const closeButton = screen.getByLabelText(/cerrar modal/i)
      await user.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Sizes', () => {
    test('applies medium size by default', () => {
      renderModal()
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveStyle({
        maxWidth: '500px',
        width: '90vw'
      })
    })

    test('applies small size', () => {
      renderModal({ size: 'sm' })
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveStyle({
        maxWidth: '400px',
        width: '90vw'
      })
    })

    test('applies large size', () => {
      renderModal({ size: 'lg' })
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveStyle({
        maxWidth: '800px',
        width: '90vw'
      })
    })

    test('applies extra large size', () => {
      renderModal({ size: 'xl' })
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveStyle({
        maxWidth: '1200px',
        width: '95vw'
      })
    })

    test('applies full size', () => {
      renderModal({ size: 'full' })
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveStyle({
        width: '100vw',
        height: '100vh',
        borderRadius: '0'
      })
    })
  })

  describe('Overlay Interactions', () => {
    test('calls onClose when clicking overlay by default', async () => {
      const user = userEvent.setup()
      const mockOnClose = jest.fn()
      
      renderModal({ onClose: mockOnClose })
      
      // Click on the overlay (background)
      const overlay = screen.getByRole('dialog').parentElement
      if (overlay) {
        fireEvent.click(overlay)
      }
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('does not call onClose when closeOnOverlayClick is false', async () => {
      const mockOnClose = jest.fn()
      
      renderModal({ onClose: mockOnClose, closeOnOverlayClick: false })
      
      // Click on the overlay (background)
      const overlay = screen.getByRole('dialog').parentElement
      if (overlay) {
        fireEvent.click(overlay)
      }
      
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    test('does not call onClose when clicking modal content', async () => {
      const mockOnClose = jest.fn()
      
      renderModal({ onClose: mockOnClose })
      
      const modalContent = screen.getByText('Modal Content')
      fireEvent.click(modalContent)
      
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard Interactions', () => {
    test('calls onClose when pressing Escape by default', async () => {
      const mockOnClose = jest.fn()
      
      renderModal({ onClose: mockOnClose })
      
      fireEvent.keyDown(document, { key: 'Escape' })
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('does not call onClose when closeOnEscape is false', async () => {
      const mockOnClose = jest.fn()
      
      renderModal({ onClose: mockOnClose, closeOnEscape: false })
      
      fireEvent.keyDown(document, { key: 'Escape' })
      
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Body Scroll Management', () => {
    test('prevents body scroll when modal is open by default', async () => {
      renderModal()
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })
    })

    test('does not prevent body scroll when preventScroll is false', () => {
      renderModal({ preventScroll: false })
      
      expect(document.body.style.overflow).not.toBe('hidden')
    })

    test('restores body scroll when modal is closed', () => {
      const { rerender } = renderModal()
      
      // Modal is open, body scroll should be prevented
      expect(document.body.style.overflow).toBe('hidden')
      
      // Close modal
      rerender(<Modal isOpen={false} onClose={jest.fn()}>Content</Modal>)
      
      // Body scroll should be restored
      expect(document.body.style.overflow).toBe('unset')
    })
  })

  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      renderModal({ title: 'Test Modal' })
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title')
    })

    test('focuses modal when opened', async () => {
      renderModal()
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveFocus()
      })
    })
  })
})

describe('ConfirmModal Component', () => {
  test('renders confirm modal with message', () => {
    renderConfirmModal({ message: 'Delete this item?' })
    expect(screen.getByText('Delete this item?')).toBeInTheDocument()
  })

  test('renders default confirm and cancel buttons', () => {
    renderConfirmModal()
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  test('renders custom button text', () => {
    renderConfirmModal({
      confirmText: 'Delete',
      cancelText: 'Keep'
    })
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument()
  })

  test('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnConfirm = jest.fn()
    
    renderConfirmModal({ onConfirm: mockOnConfirm })
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    await user.click(confirmButton)
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClose = jest.fn()
    
    renderConfirmModal({ onClose: mockOnClose })
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  describe('Variants', () => {
    test('renders danger variant with correct styling', () => {
      renderConfirmModal({ variant: 'danger' })
      const confirmButton = screen.getByRole('button', { name: /confirmar/i })
      expect(confirmButton).toHaveStyle({
        backgroundColor: '#dc2626'
      })
    })

    test('renders warning variant with correct styling', () => {
      renderConfirmModal({ variant: 'warning' })
      const confirmButton = screen.getByRole('button', { name: /confirmar/i })
      expect(confirmButton).toHaveStyle({
        backgroundColor: '#af1731'
      })
    })

    test('renders success variant with correct styling', () => {
      renderConfirmModal({ variant: 'success' })
      const confirmButton = screen.getByRole('button', { name: /confirmar/i })
      expect(confirmButton).toHaveStyle({
        backgroundColor: '#af1731'
      })
    })

    test('renders info variant with correct styling', () => {
      renderConfirmModal({ variant: 'info' })
      const confirmButton = screen.getByRole('button', { name: /confirmar/i })
      expect(confirmButton).toHaveStyle({
        backgroundColor: '#af1731'
      })
    })
  })

  describe('Loading State', () => {
    test('disables buttons when loading', () => {
      renderConfirmModal({ isLoading: true })
      
      const confirmButton = screen.getByRole('button', { name: /confirmar/i })
      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      
      expect(confirmButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })

    test('prevents modal closing when loading', () => {
      const mockOnClose = jest.fn()
      
      renderConfirmModal({ isLoading: true, onClose: mockOnClose })
      
      fireEvent.keyDown(document, { key: 'Escape' })
      
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  test('handles async onConfirm function', async () => {
    const user = userEvent.setup()
    const mockOnConfirm = jest.fn().mockResolvedValue(undefined)
    const mockOnClose = jest.fn()
    
    renderConfirmModal({ 
      onConfirm: mockOnConfirm,
      onClose: mockOnClose
    })
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })
})

describe('AlertModal Component', () => {
  test('renders alert modal with message', () => {
    renderAlertModal({ message: 'Success!' })
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  test('renders default action button', () => {
    renderAlertModal()
    expect(screen.getByRole('button', { name: /entendido/i })).toBeInTheDocument()
  })

  test('renders custom action button text', () => {
    renderAlertModal({ actionText: 'Got it' })
    expect(screen.getByRole('button', { name: /got it/i })).toBeInTheDocument()
  })

  test('calls onClose when action button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClose = jest.fn()
    
    renderAlertModal({ onClose: mockOnClose })
    
    const actionButton = screen.getByRole('button', { name: /entendido/i })
    await user.click(actionButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  describe('Types', () => {
    test('renders success type with default title', () => {
      renderAlertModal({ type: 'success' })
      expect(screen.getByText('Éxito')).toBeInTheDocument()
    })

    test('renders error type with default title', () => {
      renderAlertModal({ type: 'error' })
      expect(screen.getByText('Error')).toBeInTheDocument()
    })

    test('renders warning type with default title', () => {
      renderAlertModal({ type: 'warning' })
      expect(screen.getByText('Advertencia')).toBeInTheDocument()
    })

    test('renders info type with default title', () => {
      renderAlertModal({ type: 'info' })
      expect(screen.getByText('Información')).toBeInTheDocument()
    })

    test('uses custom title when provided', () => {
      renderAlertModal({ 
        type: 'success', 
        title: 'Custom Success Title' 
      })
      expect(screen.getByText('Custom Success Title')).toBeInTheDocument()
      expect(screen.queryByText('Éxito')).not.toBeInTheDocument()
    })
  })

  describe('React Element Messages', () => {
    test('renders React element as message', () => {
      const ReactMessage = () => (
        <div>
          <strong>Important:</strong> This is a React element message
        </div>
      )
      
      renderConfirmModal({ message: <ReactMessage /> })
      expect(screen.getByText('Important:')).toBeInTheDocument()
      expect(screen.getByText('This is a React element message')).toBeInTheDocument()
    })
  })
})