import { useState, useCallback, useEffect } from 'react'
import { z } from 'zod'

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>
  mode?: 'onChange' | 'onBlur' | 'onSubmit'
  revalidateMode?: 'onChange' | 'onBlur'
  defaultValues?: Partial<T>
  persistKey?: string // Para guardar en localStorage
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  mode = 'onChange',
  revalidateMode = 'onChange',
  defaultValues = {},
  persistKey
}: UseFormValidationOptions<T>) {
  // Estado del formulario
  const [values, setValues] = useState<Partial<T>>(() => {
    if (persistKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(persistKey)
      if (saved) {
        try {
          return { ...defaultValues, ...JSON.parse(saved) }
        } catch (e) {
          console.error('Error loading saved form data:', e)
        }
      }
    }
    return defaultValues
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [submitCount, setSubmitCount] = useState(0)

  // Guardar en localStorage cuando cambien los valores
  useEffect(() => {
    if (persistKey && Object.keys(values).length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(persistKey, JSON.stringify(values))
      }, 500) // Debounce de 500ms

      return () => clearTimeout(timeoutId)
    }
  }, [values, persistKey])

  // Validar campo individual
  const validateField = useCallback(
    async (name: string, value: any): Promise<string | null> => {
      try {
        const fieldSchema = schema.shape[name as keyof T] || schema
        await fieldSchema.parseAsync(value)
        return null
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message || 'Campo inválido'
        }
        return 'Error de validación'
      }
    },
    [schema]
  )

  // Validar todo el formulario
  const validateForm = useCallback(
    async (formValues: Partial<T>): Promise<Record<string, string>> => {
      setIsValidating(true)
      const newErrors: Record<string, string> = {}

      try {
        await schema.parseAsync(formValues)
        setIsValid(true)
      } catch (error) {
        setIsValid(false)
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            const path = err.path.join('.')
            if (path) {
              newErrors[path] = err.message
            }
          })
        }
      }

      setIsValidating(false)
      return newErrors
    },
    [schema]
  )

  // Manejar cambio de valor
  const handleChange = useCallback(
    async (name: string, value: any) => {
      const newValues = { ...values, [name]: value }
      setValues(newValues)

      if (mode === 'onChange' || (touched[name] && revalidateMode === 'onChange')) {
        const error = await validateField(name, value)
        setErrors((prev) => ({
          ...prev,
          [name]: error || ''
        }))
      }
    },
    [values, mode, revalidateMode, touched, validateField]
  )

  // Manejar blur
  const handleBlur = useCallback(
    async (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }))

      if (mode === 'onBlur' || revalidateMode === 'onBlur') {
        const error = await validateField(name, values[name as keyof T])
        setErrors((prev) => ({
          ...prev,
          [name]: error || ''
        }))
      }
    },
    [mode, revalidateMode, values, validateField]
  )

  // Manejar submit
  const handleSubmit = useCallback(
    async (onSubmit: (data: T) => void | Promise<void>) => {
      setSubmitCount((prev) => prev + 1)
      
      // Marcar todos los campos como touched
      const allTouched = Object.keys(schema.shape).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
      setTouched(allTouched)

      // Validar todo el formulario
      const formErrors = await validateForm(values)
      setErrors(formErrors)

      if (Object.keys(formErrors).length === 0) {
        try {
          await onSubmit(values as T)
          
          // Limpiar localStorage si el submit fue exitoso
          if (persistKey) {
            localStorage.removeItem(persistKey)
          }
        } catch (error) {
          console.error('Error submitting form:', error)
        }
      }
    },
    [values, schema, validateForm, persistKey]
  )

  // Resetear formulario
  const reset = useCallback(() => {
    setValues(defaultValues)
    setErrors({})
    setTouched({})
    setSubmitCount(0)
    setIsValid(false)
    
    if (persistKey) {
      localStorage.removeItem(persistKey)
    }
  }, [defaultValues, persistKey])

  // Obtener props para un campo
  const getFieldProps = useCallback(
    (name: string) => ({
      value: values[name as keyof T] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        handleChange(name, e.target.value)
      },
      onBlur: () => handleBlur(name),
      'aria-invalid': !!errors[name] && touched[name],
      'aria-describedby': errors[name] && touched[name] ? `${name}-error` : undefined
    }),
    [values, errors, touched, handleChange, handleBlur]
  )

  // Estado de validación para un campo
  const getFieldState = useCallback(
    (name: string) => ({
      error: errors[name],
      isInvalid: !!errors[name] && touched[name],
      isTouched: touched[name],
      isValid: !errors[name] && touched[name] && !!values[name as keyof T]
    }),
    [errors, touched, values]
  )

  return {
    values,
    errors,
    touched,
    isValid,
    isValidating,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
    getFieldState,
    setValues,
    setErrors,
    setTouched
  }
}

// Hook para mostrar mensajes de validación accesibles
export function useValidationMessage(fieldName: string, error?: string, touched?: boolean) {
  const shouldShowError = error && touched
  const messageId = `${fieldName}-error`

  const ValidationMessage = () => {
    if (!shouldShowError) return null

    return (
      <span
        id={messageId}
        role="alert"
        aria-live="polite"
        className="text-sm text-red-600 mt-1 flex items-center gap-1"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </span>
    )
  }

  return {
    messageId: shouldShowError ? messageId : undefined,
    ValidationMessage
  }
}