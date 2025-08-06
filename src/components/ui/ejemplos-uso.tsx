/**
 * EJEMPLOS DE USO - Biblioteca de Componentes UI Centro de Adopción Atlixco
 * 
 * Este archivo contiene ejemplos de cómo usar los componentes de la biblioteca UI.
 * No debe ser importado en producción, solo sirve como documentación.
 */

import React, { useState } from 'react'
import {
  Button,
  Card,
  PerritoCard,
  Input,
  Textarea,
  Select,
  Form,
  FormField,
  FormSection,
  FormGroup,
  Modal,
  ConfirmModal,
  AlertModal,
  Search,
  Mail,
  Phone,
  User
} from './index'

// ============================================================================
// EJEMPLOS DE BUTTON
// ============================================================================

export function ButtonExamples() {
  const [loading, setLoading] = useState(false)

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2>Ejemplos de Button</h2>
      
      {/* Variantes básicas */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button variant="primary">Primario</Button>
        <Button variant="secondary">Secundario</Button>
        <Button variant="danger">Peligro</Button>
        <Button variant="outline">Outlined</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      {/* Tamaños */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button size="sm">Pequeño</Button>
        <Button size="md">Mediano</Button>
        <Button size="lg">Grande</Button>
      </div>

      {/* Estados */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button disabled>Deshabilitado</Button>
        <Button 
          isLoading={loading} 
          onClick={() => {
            setLoading(true)
            setTimeout(() => setLoading(false), 2000)
          }}
        >
          {loading ? 'Cargando...' : 'Probar Loading'}
        </Button>
      </div>

      {/* Con iconos */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button leftIcon={<User style={{ width: '16px', height: '16px' }} />}>
          Con icono izquierdo
        </Button>
        <Button rightIcon={<Search style={{ width: '16px', height: '16px' }} />}>
          Con icono derecho
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// EJEMPLOS DE CARD
// ============================================================================

export function CardExamples() {
  const [favorites, setFavorites] = useState<string[]>([])

  const perritoEjemplo = {
    id: '1',
    nombre: 'Max',
    raza: 'Labrador Retriever',
    edad: '2 años',
    sexo: 'Macho',
    tamano: 'Grande',
    energia: 'Alta',
    estado: 'disponible' as const,
    aptoNinos: true,
    fotoPrincipal: '/api/placeholder/300/200',
    slug: 'max-labrador',
    fechaIngreso: '15 Jul 2024',
    ubicacion: 'Refugio Central',
    esNuevo: true,
    destacado: false,
    descripcionCorta: 'Max es un perro muy cariñoso y juguetón, perfecto para familias activas.'
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ejemplos de Card</h2>
      
      {/* Card básico */}
      <div style={{ marginBottom: '32px' }}>
        <h3>Card Básico</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <Card>
            <h3>Card Simple</h3>
            <p>Este es un card básico con contenido personalizado.</p>
            <Button variant="primary">Acción</Button>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3>Card Elevado</h3>
            <p>Card con sombra más pronunciada y padding grande.</p>
          </Card>

          <Card variant="outlined">
            <h3>Card con Borde</h3>
            <p>Card con borde y sin sombra.</p>
          </Card>
        </div>
      </div>

      {/* PerritoCard */}
      <div>
        <h3>PerritoCard</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <PerritoCard
            perrito={perritoEjemplo}
            onFavoriteToggle={(id) => {
              if (favorites.includes(id)) {
                setFavorites(favorites.filter(fav => fav !== id))
              } else {
                setFavorites([...favorites, id])
              }
            }}
            isFavorite={favorites.includes(perritoEjemplo.id)}
            size="md"
          />

          <PerritoCard
            perrito={{...perritoEjemplo, id: '2', destacado: true, esNuevo: false}}
            size="sm"
            showFavoriteButton={false}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// EJEMPLOS DE INPUT
// ============================================================================

export function InputExamples() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    bio: '',
    city: ''
  })

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Ejemplos de Input</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Input básico */}
        <Input
          label="Nombre completo"
          placeholder="Escribe tu nombre"
          value={values.name}
          onChange={(e) => setValues({...values, name: e.target.value})}
          leftIcon={<User style={{ width: '16px', height: '16px' }} />}
          required
        />

        {/* Input con validación */}
        <Input
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={values.email}
          onChange={(e) => setValues({...values, email: e.target.value})}
          leftIcon={<Mail style={{ width: '16px', height: '16px' }} />}
          error={values.email && !values.email.includes('@') ? 'Email inválido' : ''}
          helperText="Usaremos tu email para contactarte sobre la adopción"
        />

        {/* Input de teléfono */}
        <Input
          type="tel"
          label="Teléfono"
          placeholder="222-123-4567"
          value={values.phone}
          onChange={(e) => setValues({...values, phone: e.target.value})}
          leftIcon={<Phone style={{ width: '16px', height: '16px' }} />}
          variant="filled"
        />

        {/* Password con toggle */}
        <Input
          type="password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          value={values.password}
          onChange={(e) => setValues({...values, password: e.target.value})}
          showPasswordToggle
          variant="outlined"
          success={values.password.length >= 8 ? 'Contraseña segura' : ''}
        />

        {/* Textarea */}
        <Textarea
          label="Cuéntanos sobre ti"
          placeholder="Describe tu experiencia con mascotas..."
          value={values.bio}
          onChange={(e) => setValues({...values, bio: e.target.value})}
          minRows={4}
          maxRows={8}
          helperText={`${values.bio.length}/500 caracteres`}
        />

        {/* Select */}
        <Select
          label="Ciudad"
          placeholder="Selecciona tu ciudad"
          value={values.city}
          onChange={(e) => setValues({...values, city: e.target.value})}
          options={[
            { value: 'puebla', label: 'Puebla' },
            { value: 'atlixco', label: 'Atlixco' },
            { value: 'cholula', label: 'Cholula' },
            { value: 'tehuacan', label: 'Tehuacán' }
          ]}
        />
      </div>
    </div>
  )
}

// ============================================================================
// EJEMPLOS DE FORM
// ============================================================================

export function FormExamples() {
  const [submitResult, setSubmitResult] = useState<string>('')

  const handleSubmit = async (values: Record<string, any>) => {
    console.log('Datos enviados:', values)
    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSubmitResult('¡Formulario enviado correctamente!')
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setSubmitResult(''), 3000)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Ejemplo de Form</h2>
      
      {submitResult && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#d1fae5', 
          color: '#065f46', 
          borderRadius: '6px', 
          marginBottom: '20px' 
        }}>
          {submitResult}
        </div>
      )}

      <Form
        initialValues={{
          nombre: '',
          email: '',
          telefono: '',
          experiencia: '',
          tipo_mascota: ''
        }}
        validationSchema={{
          nombre: [
            { type: 'required', message: 'El nombre es obligatorio' },
            { type: 'minLength', value: 2, message: 'Mínimo 2 caracteres' }
          ],
          email: [
            { type: 'required' },
            { type: 'email' }
          ],
          telefono: [
            { type: 'required' },
            { type: 'phone' }
          ],
          experiencia: [
            { type: 'required', message: 'Cuéntanos tu experiencia' }
          ]
        }}
        onSubmit={handleSubmit}
        submitButton={{
          text: 'Enviar Solicitud',
          loadingText: 'Enviando...',
          variant: 'primary'
        }}
      >
        <FormSection
          title="Información Personal"
          description="Por favor completa tus datos de contacto"
        >
          <FormGroup columns={2}>
            <FormField name="nombre">
              {({ value, error, onChange, onBlur }) => (
                <Input
                  label="Nombre completo"
                  placeholder="Tu nombre"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  error={error}
                  required
                />
              )}
            </FormField>

            <FormField name="email">
              {({ value, error, onChange, onBlur }) => (
                <Input
                  type="email"
                  label="Email"
                  placeholder="tu@email.com"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  error={error}
                  required
                />
              )}
            </FormField>
          </FormGroup>

          <FormField name="telefono">
            {({ value, error, onChange, onBlur }) => (
              <Input
                type="tel"
                label="Teléfono"
                placeholder="222-123-4567"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                error={error}
                required
              />
            )}
          </FormField>
        </FormSection>

        <FormSection
          title="Experiencia con Mascotas"
          description="Cuéntanos sobre tu experiencia previa"
        >
          <FormField name="tipo_mascota">
            {({ value, error, onChange, onBlur }) => (
              <Select
                label="¿Has tenido mascotas antes?"
                placeholder="Selecciona una opción"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                error={error}
                options={[
                  { value: 'perros', label: 'Sí, perros' },
                  { value: 'gatos', label: 'Sí, gatos' },
                  { value: 'ambos', label: 'Sí, perros y gatos' },
                  { value: 'otras', label: 'Otras mascotas' },
                  { value: 'ninguna', label: 'No, sería mi primera mascota' }
                ]}
              />
            )}
          </FormField>

          <FormField name="experiencia">
            {({ value, error, onChange, onBlur }) => (
              <Textarea
                label="Cuéntanos tu experiencia"
                placeholder="Describe tu experiencia con mascotas, tu casa, jardín, etc."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                error={error}
                minRows={4}
                required
              />
            )}
          </FormField>
        </FormSection>
      </Form>
    </div>
  )
}

// ============================================================================
// EJEMPLOS DE MODAL
// ============================================================================

export function ModalExamples() {
  const [modals, setModals] = useState({
    basic: false,
    confirm: false,
    alert: false,
    large: false
  })

  const [loading, setLoading] = useState(false)

  const openModal = (type: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [type]: true }))
  }

  const closeModal = (type: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [type]: false }))
  }

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ejemplos de Modal</h2>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button onClick={() => openModal('basic')}>Modal Básico</Button>
        <Button onClick={() => openModal('confirm')} variant="danger">Modal Confirmación</Button>
        <Button onClick={() => openModal('alert')} variant="secondary">Modal Alerta</Button>
        <Button onClick={() => openModal('large')}>Modal Grande</Button>
      </div>

      {/* Modal básico */}
      <Modal
        isOpen={modals.basic}
        onClose={() => closeModal('basic')}
        title="Modal de Ejemplo"
        size="md"
      >
        <div style={{ padding: '20px 0' }}>
          <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
            Este es un modal básico con contenido personalizado. Puedes agregar cualquier 
            contenido aquí: texto, formularios, imágenes, etc.
          </p>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            El modal se puede cerrar haciendo clic en el botón X, presionando Escape,
            o haciendo clic fuera del modal.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="primary">Acción Principal</Button>
            <Button variant="outline" onClick={() => closeModal('basic')}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={modals.confirm}
        onClose={() => closeModal('confirm')}
        onConfirm={handleConfirm}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este perrito? Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={loading}
      />

      {/* Modal de alerta */}
      <AlertModal
        isOpen={modals.alert}
        onClose={() => closeModal('alert')}
        type="success"
        title="¡Solicitud Enviada!"
        message="Tu solicitud de adopción ha sido enviada correctamente. Nos pondremos en contacto contigo pronto."
        actionText="Entendido"
      />

      {/* Modal grande */}
      <Modal
        isOpen={modals.large}
        onClose={() => closeModal('large')}
        title="Modal Grande"
        size="lg"
      >
        <div style={{ padding: '20px 0' }}>
          <h3>Contenido Extenso</h3>
          <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
            Este es un modal más grande que puede contener más información. 
            Es útil para formularios largos, galerías de imágenes, o cualquier 
            contenido que necesite más espacio.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            margin: '20px 0'
          }}>
            <Card>
              <h4>Sección 1</h4>
              <p>Contenido de la primera sección</p>
            </Card>
            <Card>
              <h4>Sección 2</h4>
              <p>Contenido de la segunda sección</p>
            </Card>
            <Card>
              <h4>Sección 3</h4>
              <p>Contenido de la tercera sección</p>
            </Card>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => closeModal('large')}>
              Cancelar
            </Button>
            <Button variant="primary">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ============================================================================
// PÁGINA DE EJEMPLOS COMPLETA
// ============================================================================

export default function ComponentExamplesPage() {
  const [activeSection, setActiveSection] = useState('buttons')

  const sections = [
    { id: 'buttons', name: 'Buttons', component: ButtonExamples },
    { id: 'cards', name: 'Cards', component: CardExamples },
    { id: 'inputs', name: 'Inputs', component: InputExamples },
    { id: 'forms', name: 'Forms', component: FormExamples },
    { id: 'modals', name: 'Modals', component: ModalExamples }
  ]

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || ButtonExamples

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar de navegación */}
      <div style={{ 
        width: '250px', 
        backgroundColor: '#f8fafc', 
        padding: '20px',
        borderRight: '1px solid #e2e8f0'
      }}>
        <h1 style={{ fontSize: '20px', marginBottom: '24px', color: '#af1731' }}>
          UI Components
        </h1>
        <nav>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                margin: '4px 0',
                backgroundColor: activeSection === section.id ? '#af1731' : 'transparent',
                color: activeSection === section.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeSection === section.id ? '600' : '400',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9'
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {section.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ActiveComponent />
      </div>
    </div>
  )
}