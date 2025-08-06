import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card, { PerritoCard, CardProps, PerritoCardProps } from '../Card'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

const renderCard = (props: Partial<CardProps> = {}) => {
  const defaultProps: CardProps = {
    children: <div>Card Content</div>,
    ...props
  }
  return render(<Card {...defaultProps} />)
}

const mockPerrito = {
  id: '1',
  nombre: 'Max',
  raza: 'Golden Retriever',
  edad: '3 años',
  sexo: 'Macho',
  tamano: 'Grande',
  energia: 'Alta',
  estado: 'disponible' as const,
  aptoNinos: true,
  fotoPrincipal: '/images/perrito.jpg',
  slug: 'max-golden-retriever',
  fechaIngreso: '2024-01-01',
  ubicacion: 'Atlixco',
  esNuevo: true,
  destacado: false,
  descripcionCorta: 'Un perrito muy amigable y cariñoso'
}

const renderPerritoCard = (props: Partial<PerritoCardProps> = {}) => {
  const defaultProps: PerritoCardProps = {
    perrito: mockPerrito,
    ...props
  }
  return render(<PerritoCard {...defaultProps} />)
}

describe('Card Component', () => {
  describe('Basic Card', () => {
    test('renders with default props', () => {
      renderCard()
      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    test('applies custom className', () => {
      const { container } = renderCard({ className: 'custom-card' })
      const cardElement = container.firstChild as HTMLElement
      expect(cardElement).toHaveClass('custom-card')
    })

    test('applies custom style', () => {
      const customStyle = { backgroundColor: 'red', padding: '20px' }
      const { container } = renderCard({ style: customStyle })
      const cardElement = container.firstChild as HTMLElement
      expect(cardElement).toHaveStyle(customStyle)
    })

    describe('Variants', () => {
      test('renders default variant', () => {
        const { container } = renderCard({ variant: 'default' })
        const cardElement = container.firstChild as HTMLElement
        expect(cardElement).toHaveStyle({
          backgroundColor: 'white',
          borderRadius: '12px'
        })
      })

      test('renders elevated variant', () => {
        const { container } = renderCard({ variant: 'elevated' })
        const cardElement = container.firstChild as HTMLElement
        expect(cardElement).toHaveStyle({
          backgroundColor: 'white',
          borderRadius: '12px'
        })
      })

      test('renders outlined variant', () => {
        const { container } = renderCard({ variant: 'outlined' })
        const cardElement = container.firstChild as HTMLElement
        expect(cardElement).toHaveStyle({
          border: '1px solid #e5e7eb',
          backgroundColor: 'white'
        })
      })

      test('renders flat variant', () => {
        const { container } = renderCard({ variant: 'flat' })
        const cardElement = container.firstChild as HTMLElement
        expect(cardElement).toHaveStyle({
          backgroundColor: 'white',
          boxShadow: 'none'
        })
      })
    })

    describe('Padding', () => {
      test('applies medium padding by default', () => {
        const { container } = renderCard()
        const cardElement = container.firstChild as HTMLElement
        expect(cardElement).toHaveStyle({ padding: '16px' })
      })

      test('applies small padding', () => {
        const { container } = renderCard({ padding: 'sm' })
        const cardElement = container.firstChild as HTMLElement
        expect(cardElement).toHaveStyle({ padding: '12px' })
      })

      test('applies large padding', () => {
        const { container } = renderCard({ padding: 'lg' })
        const cardElement = container.firstChild as HTMLElement
        expect(cardElement).toHaveStyle({ padding: '24px' })
      })

      test('applies no padding', () => {
        const { container } = renderCard({ padding: 'none' })
        const cardElement = container.firstChild as HTMLElement
        expect(cardElement).toHaveStyle({ padding: '0' })
      })
    })

    describe('Interactions', () => {
      test('handles mouse events', () => {
        const mockOnMouseEnter = jest.fn()
        const mockOnMouseLeave = jest.fn()
        
        const { container } = renderCard({
          onMouseEnter: mockOnMouseEnter,
          onMouseLeave: mockOnMouseLeave
        })
        
        const cardElement = container.firstChild as HTMLElement
        
        fireEvent.mouseEnter(cardElement)
        expect(mockOnMouseEnter).toHaveBeenCalledTimes(1)
        
        fireEvent.mouseLeave(cardElement)
        expect(mockOnMouseLeave).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('PerritoCard Component', () => {
    describe('Rendering', () => {
      test('renders perrito information correctly', () => {
        renderPerritoCard()
        
        expect(screen.getByText('Max')).toBeInTheDocument()
        expect(screen.getByText('Golden Retriever • Macho • 3 años')).toBeInTheDocument()
        expect(screen.getByText('disponible')).toBeInTheDocument()
        expect(screen.getByText('Un perrito muy amigable y cariñoso')).toBeInTheDocument()
      })

      test('renders perrito image with correct attributes', () => {
        renderPerritoCard()
        
        const image = screen.getByAltText('Max - Golden Retriever')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', '/images/perrito.jpg')
      })

      test('renders "Ver Detalles" button with correct link', () => {
        renderPerritoCard()
        
        const button = screen.getByRole('button', { name: /ver detalles de max/i })
        expect(button).toBeInTheDocument()
        
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/perritos/max-golden-retriever')
      })
    })

    describe('Status Badges', () => {
      test('shows "Nuevo" badge for new dogs', () => {
        renderPerritoCard({ perrito: { ...mockPerrito, esNuevo: true } })
        expect(screen.getByText('Nuevo')).toBeInTheDocument()
      })

      test('shows "Destacado" badge for featured dogs', () => {
        renderPerritoCard({ perrito: { ...mockPerrito, destacado: true } })
        expect(screen.getByText('⭐ Destacado')).toBeInTheDocument()
      })

      test('does not show badges when not applicable', () => {
        renderPerritoCard({ 
          perrito: { ...mockPerrito, esNuevo: false, destacado: false } 
        })
        expect(screen.queryByText('Nuevo')).not.toBeInTheDocument()
        expect(screen.queryByText('⭐ Destacado')).not.toBeInTheDocument()
      })
    })

    describe('Status Styles', () => {
      test('applies correct styles for disponible status', () => {
        renderPerritoCard({ perrito: { ...mockPerrito, estado: 'disponible' } })
        const statusBadge = screen.getByText('disponible')
        expect(statusBadge).toHaveStyle({
          color: '#246257',
          backgroundColor: 'rgba(61, 155, 132, 0.1)'
        })
      })

      test('applies correct styles for proceso status', () => {
        renderPerritoCard({ perrito: { ...mockPerrito, estado: 'proceso' } })
        const statusBadge = screen.getByText('proceso')
        expect(statusBadge).toHaveStyle({
          color: '#8b6638',
          backgroundColor: 'rgba(199, 155, 102, 0.1)'
        })
      })

      test('applies correct styles for adoptado status', () => {
        renderPerritoCard({ perrito: { ...mockPerrito, estado: 'adoptado' } })
        const statusBadge = screen.getByText('adoptado')
        expect(statusBadge).toHaveStyle({
          color: '#4a4a4a',
          backgroundColor: 'rgba(178, 178, 177, 0.1)'
        })
      })
    })

    describe('Characteristics Tags', () => {
      test('renders size and energy tags', () => {
        renderPerritoCard()
        expect(screen.getByText('Grande')).toBeInTheDocument()
        expect(screen.getByText('Energía Alta')).toBeInTheDocument()
      })

      test('shows child-friendly badge when apto for children', () => {
        renderPerritoCard({ perrito: { ...mockPerrito, aptoNinos: true } })
        expect(screen.getByText('✓ Niños')).toBeInTheDocument()
      })

      test('does not show child-friendly badge when not apto for children', () => {
        renderPerritoCard({ perrito: { ...mockPerrito, aptoNinos: false } })
        expect(screen.queryByText('✓ Niños')).not.toBeInTheDocument()
      })
    })

    describe('Favorite Button', () => {
      test('renders favorite button when showFavoriteButton is true', () => {
        const mockOnFavoriteToggle = jest.fn()
        renderPerritoCard({ 
          showFavoriteButton: true, 
          onFavoriteToggle: mockOnFavoriteToggle 
        })
        
        const favoriteButton = screen.getByLabelText(/agregar max a favoritos/i)
        expect(favoriteButton).toBeInTheDocument()
      })

      test('does not render favorite button when showFavoriteButton is false', () => {
        renderPerritoCard({ showFavoriteButton: false })
        
        expect(screen.queryByLabelText(/agregar max a favoritos/i)).not.toBeInTheDocument()
        expect(screen.queryByLabelText(/quitar max de favoritos/i)).not.toBeInTheDocument()
      })

      test('calls onFavoriteToggle when favorite button is clicked', async () => {
        const user = userEvent.setup()
        const mockOnFavoriteToggle = jest.fn()
        
        renderPerritoCard({ 
          onFavoriteToggle: mockOnFavoriteToggle,
          showFavoriteButton: true 
        })
        
        const favoriteButton = screen.getByLabelText(/agregar max a favoritos/i)
        await user.click(favoriteButton)
        
        expect(mockOnFavoriteToggle).toHaveBeenCalledWith('1')
      })

      test('shows different label when dog is favorited', () => {
        renderPerritoCard({ 
          isFavorite: true,
          showFavoriteButton: true 
        })
        
        expect(screen.getByLabelText(/quitar max de favoritos/i)).toBeInTheDocument()
      })
    })

    describe('Sizes', () => {
      test('applies medium size by default', () => {
        renderPerritoCard()
        const button = screen.getByRole('button', { name: /ver detalles/i })
        expect(button).toHaveStyle({
          fontSize: '14px',
          padding: '12px 16px'
        })
      })

      test('applies small size', () => {
        renderPerritoCard({ size: 'sm' })
        const button = screen.getByRole('button', { name: /ver detalles/i })
        expect(button).toHaveStyle({
          fontSize: '12px',
          padding: '8px 12px'
        })
      })

      test('applies large size', () => {
        renderPerritoCard({ size: 'lg' })
        const button = screen.getByRole('button', { name: /ver detalles/i })
        expect(button).toHaveStyle({
          fontSize: '16px',
          padding: '14px 20px'
        })
      })
    })

    describe('Additional Information', () => {
      test('renders admission date when provided', () => {
        renderPerritoCard({ 
          perrito: { ...mockPerrito, fechaIngreso: '2024-01-01' } 
        })
        expect(screen.getByText(/ingreso: 2024-01-01/i)).toBeInTheDocument()
      })

      test('renders location when provided', () => {
        renderPerritoCard({ 
          perrito: { ...mockPerrito, ubicacion: 'Atlixco' } 
        })
        expect(screen.getByText('Atlixco')).toBeInTheDocument()
      })

      test('does not render additional info section when no data provided', () => {
        renderPerritoCard({ 
          perrito: { 
            ...mockPerrito, 
            fechaIngreso: undefined, 
            ubicacion: undefined 
          } 
        })
        expect(screen.queryByText(/ingreso:/i)).not.toBeInTheDocument()
        expect(screen.queryByText('Atlixco')).not.toBeInTheDocument()
      })
    })

    describe('Accessibility', () => {
      test('has proper alt text for image', () => {
        renderPerritoCard()
        const image = screen.getByAltText('Max - Golden Retriever')
        expect(image).toBeInTheDocument()
      })

      test('has proper aria-label for details button', () => {
        renderPerritoCard()
        const button = screen.getByLabelText(/ver detalles de max/i)
        expect(button).toBeInTheDocument()
      })

      test('has proper aria-label for favorite button', () => {
        renderPerritoCard({ showFavoriteButton: true })
        const favoriteButton = screen.getByLabelText(/agregar max a favoritos/i)
        expect(favoriteButton).toBeInTheDocument()
      })
    })

    describe('Edge Cases', () => {
      test('handles missing optional fields gracefully', () => {
        const minimalPerrito = {
          id: '1',
          nombre: 'Test',
          raza: 'Mixed',
          edad: '2 años',
          sexo: 'Hembra',
          tamano: 'Mediano',
          energia: 'Media',
          estado: 'disponible' as const,
          aptoNinos: false,
          fotoPrincipal: '/images/test.jpg',
          slug: 'test-mixed'
        }
        
        renderPerritoCard({ perrito: minimalPerrito })
        expect(screen.getByText('Test')).toBeInTheDocument()
      })

      test('truncates long description', () => {
        const longDescription = 'Este es un perrito con una descripción muy larga que debería ser truncada para mantener el diseño limpio y organizado en la tarjeta'
        
        renderPerritoCard({ 
          perrito: { ...mockPerrito, descripcionCorta: longDescription } 
        })
        
        const description = screen.getByText(longDescription)
        expect(description).toHaveStyle({
          display: '-webkit-box',
          WebkitLineClamp: 2,
          overflow: 'hidden'
        })
      })
    })
  })
})