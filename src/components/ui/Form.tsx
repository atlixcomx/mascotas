'use client'

import { 
  FormHTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'
import Button from './Button'

// Tipos para el contexto del formulario
interface FormContextType {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
  setValue: (name: string, value: any) => void
  setError: (name: string, error: string) => void
  clearError: (name: string) => void
  setTouched: (name: string, touched: boolean) => void
  validateField: (name: string, value: any, rules: ValidationRule[]) => string | null
  validateForm: () => boolean
}

// Tipos para las reglas de validación
export type ValidationRule = 
  | { type: 'required'; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'custom'; validator: (value: any) => boolean; message: string }
  | { type: 'phone'; message?: string }

// Props del componente Form
export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  initialValues?: Record<string, any>
  validationSchema?: Record<string, ValidationRule[]>
  onSubmit: (values: Record<string, any>) => Promise<void> | void
  children: ReactNode
  submitButton?: {
    text?: string
    loadingText?: string
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
  }
  showSubmitButton?: boolean
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

// Props del componente FormField
export interface FormFieldProps {
  name: string
  validation?: ValidationRule[]
  children: (field: {
    value: any
    error?: string
    touched: boolean
    onChange: (value: any) => void
    onBlur: () => void
  }) => ReactNode
}

// Contexto del formulario
const FormContext = createContext<FormContextType | null>(null)

// Hook para usar el contexto del formulario
export const useForm = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForm debe ser usado dentro de un componente Form')
  }
  return context
}

// Funciones de validación
const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message || 'Este campo es obligatorio'
        }
        break
      
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return rule.message || 'Ingresa un email válido'
        }
        break
      
      case 'minLength':
        if (value && value.length < rule.value) {
          return rule.message || `Mínimo ${rule.value} caracteres`
        }
        break
      
      case 'maxLength':
        if (value && value.length > rule.value) {
          return rule.message || `Máximo ${rule.value} caracteres`
        }
        break
      
      case 'pattern':
        if (value && !rule.value.test(value)) {
          return rule.message || 'Formato inválido'
        }
        break
      
      case 'phone':
        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          return rule.message || 'Ingresa un teléfono válido'
        }
        break
      
      case 'custom':
        if (value && !rule.validator(value)) {
          return rule.message
        }
        break
    }
  }
  return null
}

// Componente Form principal
export default function Form({
  initialValues = {},
  validationSchema = {},
  onSubmit,
  children,
  submitButton = { text: 'Enviar', loadingText: 'Enviando...', variant: 'primary', size: 'md' },
  showSubmitButton = true,
  validateOnChange = true,
  validateOnBlur = true,
  className,
  style,
  ...props
}: FormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouchedFields] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcular si el formulario es válido
  const isValid = Object.keys(errors).length === 0

  // Función para establecer un valor
  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validar en tiempo real si está habilitado
    if (validateOnChange && validationSchema[name]) {
      const error = validateField(value, validationSchema[name])
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }
  }, [validateOnChange, validationSchema])

  // Función para establecer un error
  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  // Función para limpiar un error
  const clearError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  // Función para marcar un campo como tocado
  const setTouched = useCallback((name: string, touched: boolean) => {
    setTouchedFields(prev => ({ ...prev, [name]: touched }))
  }, [])

  // Función para validar un campo específico
  const validateFieldFunction = useCallback((name: string, value: any, rules: ValidationRule[]): string | null => {
    return validateField(value, rules)
  }, [])

  // Función para validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}
    
    Object.entries(validationSchema).forEach(([fieldName, rules]) => {
      const error = validateField(values[fieldName], rules)
      if (error) {
        newErrors[fieldName] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, validationSchema])

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    // Marcar todos los campos como tocados
    const allFieldNames = Object.keys(validationSchema)
    const newTouched = allFieldNames.reduce((acc, name) => {
      acc[name] = true
      return acc
    }, {} as Record<string, boolean>)
    setTouchedFields(newTouched)
    
    // Validar el formulario
    const isFormValid = validateForm()
    
    if (!isFormValid) return
    
    setIsSubmitting(true)
    
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Valor del contexto
  const contextValue: FormContextType = {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setError,
    clearError,
    setTouched,
    validateField: validateFieldFunction,
    validateForm
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form
        {...props}
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          ...style
        }}
        className={className}
        noValidate
      >
        {children}
        
        {showSubmitButton && (
          <div style={{ marginTop: '24px' }}>
            <Button
              type="submit"
              variant={submitButton.variant}
              size={submitButton.size}
              disabled={submitButton.disabled || isSubmitting || !isValid}
              isLoading={isSubmitting}
              style={{ width: '100%' }}
            >
              {isSubmitting ? submitButton.loadingText : submitButton.text}
            </Button>
          </div>
        )}
      </form>
    </FormContext.Provider>
  )
}

// Componente FormField
export function FormField({ name, validation = [], children }: FormFieldProps) {
  const { 
    values, 
    errors, 
    touched, 
    setValue, 
    setTouched, 
    validateField,
    validateOnBlur 
  } = useForm()

  const value = values[name] || ''
  const error = touched[name] ? errors[name] : undefined
  const isTouched = touched[name] || false

  const handleChange = (newValue: any) => {
    setValue(name, newValue)
  }

  const handleBlur = () => {
    setTouched(name, true)
    
    // Validar en blur si está habilitado
    if (validateOnBlur && validation.length > 0) {
      const error = validateField(name, value, validation)
      if (error) {
        // El error ya se establece en setValue si validateOnChange está habilitado
        // Solo lo establecemos aquí si validateOnChange está deshabilitado
      }
    }
  }

  return (
    <>
      {children({
        value,
        error,
        touched: isTouched,
        onChange: handleChange,
        onBlur: handleBlur
      })}
    </>
  )
}

// Componente FormSection para agrupar campos
export interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function FormSection({ title, description, children, className, style }: FormSectionProps) {
  return (
    <div
      className={className}
      style={{
        marginBottom: '32px',
        ...style
      }}
    >
      {title && (
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          {title}
        </h3>
      )}
      {description && (
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '16px',
          margin: '0 0 16px 0',
          lineHeight: '1.5'
        }}>
          {description}
        </p>
      )}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {children}
      </div>
    </div>
  )
}

// Componente FormGroup para campos en línea
export interface FormGroupProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: string
  className?: string
  style?: React.CSSProperties
}

export function FormGroup({ children, columns = 2, gap = '16px', className, style }: FormGroupProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        ...style
      }}
    >
      {children}
    </div>
  )
}