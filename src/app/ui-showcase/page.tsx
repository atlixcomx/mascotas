'use client'

import { useState } from 'react'
import { AccessibleButton } from '@/components/ui/accessible/AccessibleButton'
import { AccessibleContactForm } from '@/components/ui/accessible/AccessibleForm'
import { NotificationProvider, useNotifications, NotificationExamples } from '@/components/ui/accessible/NotificationSystem'
import { SkipLinks, MainContent } from '@/components/ui/accessible/SkipLinks'
import { SwipeableCard, SwipeableGallery } from '@/components/mobile/SwipeableCard'
import { PullToRefresh, MobileOptimizedList } from '@/components/mobile/PullToRefresh'
import { LazyImage, OptimizedImageGallery } from '@/components/ui/LazyImage'
import { useAnimation, useScrollAnimation } from '@/hooks/useAnimation'

// Envolver el contenido con el provider de notificaciones
function UIShowcaseContent() {
  const { notify } = useNotifications()
  const [refreshing, setRefreshing] = useState(false)
  
  // Animaciones
  const titleAnimation = useAnimation('slideInDown', { duration: 600 })
  const cardAnimation = useScrollAnimation('fadeIn', { threshold: 0.3 })

  // Datos de ejemplo
  const perritos = [
    { id: '1', title: 'Max', subtitle: 'Cachorro juguetón', image: '/images/perrito1.jpg', badge: 'Nuevo' },
    { id: '2', title: 'Luna', subtitle: 'Muy cariñosa', image: '/images/perrito2.jpg' },
    { id: '3', title: 'Rocky', subtitle: 'Guardian perfecto', image: '/images/perrito3.jpg' },
  ]

  const galleryImages = [
    { src: '/images/centro/foto0.jpeg', alt: 'Centro de adopción - Vista frontal' },
    { src: '/images/centro/foto1.jpeg', alt: 'Área de juegos' },
    { src: '/images/centro/Foto2.jpeg', alt: 'Veterinario atendiendo' },
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    notify({
      type: 'success',
      title: 'Lista actualizada',
      message: 'Se encontraron 2 nuevos perritos'
    })
    setRefreshing(false)
  }

  return (
    <>
      <SkipLinks />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header con navegación */}
        <header id="main-navigation" className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-puebla-primary">UI/UX Showcase</h1>
              <nav className="hidden md:flex space-x-8">
                <a href="#forms" className="text-gray-700 hover:text-puebla-primary transition-colors">
                  Formularios
                </a>
                <a href="#mobile" className="text-gray-700 hover:text-puebla-primary transition-colors">
                  Móvil
                </a>
                <a href="#images" className="text-gray-700 hover:text-puebla-primary transition-colors">
                  Imágenes
                </a>
              </nav>
            </div>
          </div>
        </header>

        <MainContent>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            {/* Hero Section con animación */}
            <section ref={titleAnimation.ref} className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Componentes UI/UX Mejorados
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Showcase de todos los componentes implementados para alcanzar el 100% en accesibilidad,
                usabilidad, consistencia y experiencia móvil.
              </p>
            </section>

            {/* Sección de Botones Accesibles */}
            <section className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">Botones Accesibles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold mb-4">Estados de Carga</h4>
                  <div className="space-y-3">
                    <AccessibleButton loading loadingText="Guardando...">
                      Guardar
                    </AccessibleButton>
                    <AccessibleButton variant="secondary" loading loadingText="Procesando...">
                      Procesar
                    </AccessibleButton>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold mb-4">Variantes</h4>
                  <div className="space-y-3">
                    <AccessibleButton variant="primary">Principal</AccessibleButton>
                    <AccessibleButton variant="outline">Contorno</AccessibleButton>
                    <AccessibleButton variant="danger">Peligro</AccessibleButton>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold mb-4">Con Iconos</h4>
                  <div className="space-y-3">
                    <AccessibleButton icon={<span>🐕</span>}>
                      Ver Perritos
                    </AccessibleButton>
                    <AccessibleButton icon={<span>❤️</span>} iconPosition="right">
                      Favoritos
                    </AccessibleButton>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección de Formularios */}
            <section id="forms" className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Formulario con Validación en Tiempo Real
              </h3>
              
              <div ref={cardAnimation.ref} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <AccessibleContactForm />
              </div>
            </section>

            {/* Sección de Notificaciones */}
            <section className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Sistema de Notificaciones ARIA Live
              </h3>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <NotificationExamples />
              </div>
            </section>

            {/* Sección Móvil */}
            <section id="mobile" className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Componentes Móviles Optimizados
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Swipeable Cards */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-semibold mb-4">Cards con Gestos</h4>
                  <SwipeableCard
                    onSwipeLeft={() => notify({ type: 'info', title: 'Swipe izquierda' })}
                    onSwipeRight={() => notify({ type: 'info', title: 'Swipe derecha' })}
                    className="bg-gradient-to-r from-puebla-primary to-burgundy text-white p-8 rounded-lg text-center"
                  >
                    <p className="text-2xl font-bold mb-2">¡Deslízame!</p>
                    <p>Swipe en cualquier dirección</p>
                  </SwipeableCard>
                </div>

                {/* Pull to Refresh List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <h4 className="font-semibold p-6 pb-0">Lista con Pull to Refresh</h4>
                  <div className="h-96">
                    <MobileOptimizedList
                      items={perritos}
                      onRefresh={handleRefresh}
                      loading={refreshing}
                      onItemClick={(item) => notify({ 
                        type: 'info', 
                        title: `Seleccionaste a ${item.title}` 
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Galería Swipeable */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold mb-4">Galería con Swipe</h4>
                <SwipeableGallery 
                  images={galleryImages}
                  className="h-64 md:h-96 rounded-lg overflow-hidden"
                />
              </div>
            </section>

            {/* Sección de Imágenes */}
            <section id="images" className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Sistema de Lazy Loading Optimizado
              </h3>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold mb-4">Galería Optimizada</h4>
                <OptimizedImageGallery
                  images={[
                    { src: '/images/perrito1.jpg', alt: 'Perrito 1' },
                    { src: '/images/perrito2.jpg', alt: 'Perrito 2' },
                    { src: '/images/perrito3.jpg', alt: 'Perrito 3' },
                    { src: '/images/perrito4.jpg', alt: 'Perrito 4' },
                    { src: '/images/perrito5.jpg', alt: 'Perrito 5' },
                    { src: '/images/perrito6.jpg', alt: 'Perrito 6' },
                  ]}
                  columns={3}
                  onImageClick={(index) => notify({ 
                    type: 'info', 
                    title: `Imagen ${index + 1} seleccionada` 
                  })}
                />
              </div>
            </section>

            {/* Sección de Animaciones */}
            <section className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Sistema de Animaciones Consistentes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover-lift">
                  <h4 className="font-semibold mb-2">Hover Lift</h4>
                  <p className="text-gray-600">Pasa el cursor para elevar</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover-grow">
                  <h4 className="font-semibold mb-2">Hover Grow</h4>
                  <p className="text-gray-600">Pasa el cursor para crecer</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md hover-shine">
                  <h4 className="font-semibold mb-2">Hover Shine</h4>
                  <p className="text-gray-600">Pasa el cursor para brillar</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="font-semibold mb-4">Animaciones de Carga</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>Cargando contenido...</span>
                  </div>
                  
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </MainContent>

        {/* Footer */}
        <footer id="footer" className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>Centro de Bienestar Animal Atlixco - UI/UX 100%</p>
          </div>
        </footer>
      </div>
    </>
  )
}

// Página principal con provider
export default function UIShowcasePage() {
  return (
    <NotificationProvider position="top-right">
      <UIShowcaseContent />
      <style jsx global>{`
        @import '/src/styles/design-tokens.css';
        @import '/src/styles/animations.css';
      `}</style>
    </NotificationProvider>
  )
}