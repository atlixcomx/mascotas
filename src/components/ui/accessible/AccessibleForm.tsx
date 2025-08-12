'use client'

import { useFormValidation } from '@/hooks/useFormValidation'
import { useValidationMessage } from '@/hooks/useFormValidation'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { AccessibleButton } from './AccessibleButton'

interface AccessibleFormFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  helpText?: string
  autoComplete?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url'
  rows?: number
}

export function AccessibleFormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  options = [],
  helpText,
  autoComplete,
  inputMode,
  rows = 3,
  formProps,
  ...props
}: AccessibleFormFieldProps & { formProps: any }) {
  const fieldProps = formProps.getFieldProps(name)
  const fieldState = formProps.getFieldState(name)
  const { ValidationMessage, messageId } = useValidationMessage(name, fieldState.error, fieldState.isTouched)

  const inputClasses = `
    w-full px-4 py-2 
    border rounded-md
    transition-all duration-200
    ${fieldState.isInvalid 
      ? 'border-red-500 focus:ring-red-500' 
      : fieldState.isValid 
        ? 'border-green-500 focus:ring-green-500' 
        : 'border-gray-300 focus:ring-puebla-primary'
    }
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            rows={rows}
            className={inputClasses}
            placeholder={placeholder}
            aria-required={required}
            aria-describedby={helpText ? `${name}-help` : messageId}
            autoComplete={autoComplete}
            {...fieldProps}
            {...props}
          />
        )
      
      case 'select':
        return (
          <select
            id={name}
            className={inputClasses}
            aria-required={required}
            aria-describedby={helpText ? `${name}-help` : messageId}
            {...fieldProps}
            {...props}
          >
            <option value="">Selecciona una opción</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      default:
        return (
          <input
            id={name}
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            aria-required={required}
            aria-describedby={helpText ? `${name}-help` : messageId}
            autoComplete={autoComplete}
            inputMode={inputMode}
            {...fieldProps}
            {...props}
          />
        )
    }
  }

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
      </label>
      
      {renderField()}
      
      {helpText && !fieldState.isInvalid && (
        <p id={`${name}-help`} className="text-sm text-gray-600 mt-1">
          {helpText}
        </p>
      )}
      
      <ValidationMessage />
      
      {fieldState.isValid && (
        <span className="text-sm text-green-600 mt-1 flex items-center gap-1" role="status">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Campo válido
        </span>
      )}
    </div>
  )
}

// Ejemplo de formulario completo con auto-guardado
interface ContactFormData {
  nombre: string
  email: string
  telefono: string
  mensaje: string
}

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
})

export function AccessibleContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const form = useFormValidation({
    schema: contactSchema,
    mode: 'onChange',
    persistKey: 'contact-form-draft',
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      mensaje: ''
    }
  })

  // Auto-guardado visual
  useEffect(() => {
    if (Object.keys(form.values).some(key => form.values[key as keyof ContactFormData])) {
      setLastSaved(new Date())
    }
  }, [form.values])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await form.handleSubmit(async (data) => {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitSuccess(true)
      
      // Anunciar éxito a lectores de pantalla
      const announcement = document.createElement('div')
      announcement.setAttribute('role', 'status')
      announcement.setAttribute('aria-live', 'polite')
      announcement.textContent = 'Formulario enviado exitosamente'
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 1000)
    })

    setIsSubmitting(false)
  }

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 mb-2">¡Mensaje enviado!</h3>
        <p className="text-green-700">Nos pondremos en contacto contigo pronto.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Tu progreso se guarda automáticamente. Puedes cerrar y continuar más tarde.
        </p>
      </div>

      <AccessibleFormField
        name="nombre"
        label="Nombre completo"
        required
        placeholder="Juan Pérez"
        autoComplete="name"
        formProps={form}
      />

      <AccessibleFormField
        name="email"
        label="Correo electrónico"
        type="email"
        required
        placeholder="juan@ejemplo.com"
        autoComplete="email"
        inputMode="email"
        formProps={form}
      />

      <AccessibleFormField
        name="telefono"
        label="Teléfono"
        type="tel"
        required
        placeholder="1234567890"
        autoComplete="tel"
        inputMode="numeric"
        helpText="10 dígitos sin espacios ni guiones"
        formProps={form}
      />

      <AccessibleFormField
        name="mensaje"
        label="Mensaje"
        type="textarea"
        required
        placeholder="Escribe tu mensaje aquí..."
        rows={5}
        formProps={form}
      />

      {lastSaved && (
        <p className="text-sm text-gray-600 italic" role="status">
          Guardado automáticamente a las {lastSaved.toLocaleTimeString()}
        </p>
      )}

      <div className="flex gap-4">
        <AccessibleButton
          type="submit"
          loading={isSubmitting}
          loadingText="Enviando..."
          disabled={!form.isValid || isSubmitting}
          fullWidth
        >
          Enviar mensaje
        </AccessibleButton>

        <AccessibleButton
          type="button"
          variant="outline"
          onClick={() => {
            if (confirm('¿Estás seguro de que quieres limpiar el formulario?')) {
              form.reset()
              setLastSaved(null)
            }
          }}
          disabled={isSubmitting}
        >
          Limpiar
        </AccessibleButton>
      </div>

      {form.submitCount > 0 && !form.isValid && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium">
            Por favor corrige los errores antes de enviar el formulario.
          </p>
        </div>
      )}
    </form>
  )
}