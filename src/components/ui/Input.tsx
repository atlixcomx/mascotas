'use client'

import { 
  forwardRef, 
  InputHTMLAttributes, 
  TextareaHTMLAttributes, 
  SelectHTMLAttributes,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react'

export interface BaseInputProps {
  label?: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  required?: boolean
  disabled?: boolean
}

export interface InputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'search'
  showPasswordToggle?: boolean
}

export interface TextareaProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  minRows?: number
  maxRows?: number
}

export interface SelectProps extends BaseInputProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  placeholder?: string
  options?: { value: string; label: string; disabled?: boolean }[]
  children?: ReactNode
}

// Funciones de validación
export const validators = {
  required: (value: string) => !value ? 'Este campo es obligatorio' : null,
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return value && !emailRegex.test(value) ? 'Ingresa un email válido' : null
  },
  minLength: (min: number) => (value: string) => 
    value && value.length < min ? `Mínimo ${min} caracteres` : null,
  maxLength: (max: number) => (value: string) => 
    value && value.length > max ? `Máximo ${max} caracteres` : null,
  phone: (value: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return value && !phoneRegex.test(value) ? 'Ingresa un teléfono válido' : null
  }
}

// Input base
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  type = 'text',
  showPasswordToggle = false,
  required = false,
  disabled = false,
  className,
  style,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const actualType = type === 'password' && showPassword ? 'text' : type
  const hasError = !!error
  const hasSuccess = !!success && !hasError
  const hasRightIcon = rightIcon || (type === 'password' && showPasswordToggle) || hasError || hasSuccess

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '8px 12px',
        fontSize: '14px',
        minHeight: '36px'
      },
      md: {
        padding: '12px 16px',
        fontSize: '16px',
        minHeight: '44px'
      },
      lg: {
        padding: '16px 20px',
        fontSize: '18px',
        minHeight: '52px'
      }
    }

    return sizes[size]
  }

  const getVariantStyles = () => {
    const baseStyles = {
      width: '100%',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      outline: 'none',
      fontFamily: 'inherit',
      color: '#1f2937'
    }

    const variants = {
      default: {
        backgroundColor: disabled ? '#f9fafb' : '#fafafa',
        ':focus': {
          borderColor: hasError ? '#ef4444' : '#c79b66',
          backgroundColor: 'white',
          boxShadow: `0 0 0 3px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(199, 155, 102, 0.1)'}`
        }
      },
      filled: {
        backgroundColor: disabled ? '#f3f4f6' : '#f3f4f6',
        border: '1px solid transparent',
        ':focus': {
          backgroundColor: 'white',
          borderColor: hasError ? '#ef4444' : '#c79b66',
          boxShadow: `0 0 0 3px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(199, 155, 102, 0.1)'}`
        }
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: '2px',
        ':focus': {
          borderColor: hasError ? '#ef4444' : '#af1731',
          boxShadow: `0 0 0 2px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(175, 23, 49, 0.1)'}`
        }
      }
    }

    // Apply error/success states
    if (hasError) {
      baseStyles.borderColor = '#ef4444'
    } else if (hasSuccess) {
      baseStyles.borderColor = '#10b981'
    }

    return { ...baseStyles, ...variants[variant] }
  }

  const inputPadding = getSizeStyles().padding.split(' ')
  const paddingWithIcons = {
    paddingLeft: leftIcon ? `${parseInt(inputPadding[1]) + 36}px` : inputPadding[1],
    paddingRight: hasRightIcon ? `${parseInt(inputPadding[1]) + 36}px` : inputPadding[1],
    paddingTop: inputPadding[0],
    paddingBottom: inputPadding[0]
  }

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: '500',
          color: disabled ? '#9ca3af' : '#374151'
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: disabled ? '#9ca3af' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          ref={ref}
          type={actualType}
          disabled={disabled}
          required={required}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          style={{
            ...getVariantStyles(),
            ...getSizeStyles(),
            ...paddingWithIcons,
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
            ...(isFocused && !disabled ? (getVariantStyles() as any)[':focus'] : {}),
            ...style
          }}
          className={className}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : 
            success ? `${props.id}-success` :
            helperText ? `${props.id}-helper` : 
            undefined
          }
        />

        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {hasError && (
            <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
          )}
          {hasSuccess && (
            <Check style={{ width: '16px', height: '16px', color: '#10b981' }} />
          )}
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeOff style={{ width: '16px', height: '16px' }} />
              ) : (
                <Eye style={{ width: '16px', height: '16px' }} />
              )}
            </button>
          )}
          {rightIcon && !hasError && !hasSuccess && (
            <div style={{ color: disabled ? '#9ca3af' : '#6b7280' }}>
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p id={`${props.id}-error`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#ef4444',
          margin: '6px 0 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <AlertCircle style={{ width: '14px', height: '14px' }} />
          {error}
        </p>
      )}

      {success && !error && (
        <p id={`${props.id}-success`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#10b981',
          margin: '6px 0 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Check style={{ width: '14px', height: '14px' }} />
          {success}
        </p>
      )}

      {helperText && !error && !success && (
        <p id={`${props.id}-helper`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#6b7280',
          margin: '6px 0 0 0'
        }}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Textarea
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  success,
  helperText,
  size = 'md',
  variant = 'default',
  resize = 'vertical',
  minRows = 3,
  maxRows,
  required = false,
  disabled = false,
  className,
  style,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasError = !!error
  const hasSuccess = !!success && !hasError

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '8px 12px',
        fontSize: '14px',
        lineHeight: '1.4'
      },
      md: {
        padding: '12px 16px',
        fontSize: '16px',
        lineHeight: '1.5'
      },
      lg: {
        padding: '16px 20px',
        fontSize: '18px',
        lineHeight: '1.6'
      }
    }

    return sizes[size]
  }

  const getVariantStyles = () => {
    const baseStyles = {
      width: '100%',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      outline: 'none',
      fontFamily: 'inherit',
      color: '#1f2937',
      resize: resize,
      minHeight: `${minRows * 1.5}em`
    }

    const variants = {
      default: {
        backgroundColor: disabled ? '#f9fafb' : '#fafafa',
        ':focus': {
          borderColor: hasError ? '#ef4444' : '#c79b66',
          backgroundColor: 'white',
          boxShadow: `0 0 0 3px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(199, 155, 102, 0.1)'}`
        }
      },
      filled: {
        backgroundColor: disabled ? '#f3f4f6' : '#f3f4f6',
        border: '1px solid transparent',
        ':focus': {
          backgroundColor: 'white',
          borderColor: hasError ? '#ef4444' : '#c79b66',
          boxShadow: `0 0 0 3px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(199, 155, 102, 0.1)'}`
        }
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: '2px',
        ':focus': {
          borderColor: hasError ? '#ef4444' : '#af1731',
          boxShadow: `0 0 0 2px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(175, 23, 49, 0.1)'}`
        }
      }
    }

    if (hasError) {
      baseStyles.borderColor = '#ef4444'
    } else if (hasSuccess) {
      baseStyles.borderColor = '#10b981'
    }

    if (maxRows) {
      baseStyles['maxHeight'] = `${maxRows * 1.5}em`
    }

    return { ...baseStyles, ...variants[variant] }
  }

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: '500',
          color: disabled ? '#9ca3af' : '#374151'
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}

      <textarea
        {...props}
        ref={ref}
        disabled={disabled}
        required={required}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        style={{
          ...getVariantStyles(),
          ...getSizeStyles(),
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
          ...(isFocused && !disabled ? (getVariantStyles() as any)[':focus'] : {}),
          ...style
        }}
        className={className}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${props.id}-error` : 
          success ? `${props.id}-success` :
          helperText ? `${props.id}-helper` : 
          undefined
        }
      />

      {error && (
        <p id={`${props.id}-error`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#ef4444',
          margin: '6px 0 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <AlertCircle style={{ width: '14px', height: '14px' }} />
          {error}
        </p>
      )}

      {success && !error && (
        <p id={`${props.id}-success`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#10b981',
          margin: '6px 0 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Check style={{ width: '14px', height: '14px' }} />
          {success}
        </p>
      )}

      {helperText && !error && !success && (
        <p id={`${props.id}-helper`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#6b7280',
          margin: '6px 0 0 0'
        }}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// Select
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  success,
  helperText,
  size = 'md',
  variant = 'default',
  placeholder,
  options = [],
  children,
  required = false,
  disabled = false,
  className,
  style,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasError = !!error
  const hasSuccess = !!success && !hasError

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '8px 12px',
        fontSize: '14px',
        minHeight: '36px'
      },
      md: {
        padding: '12px 16px',
        fontSize: '16px',
        minHeight: '44px'
      },
      lg: {
        padding: '16px 20px',
        fontSize: '18px',
        minHeight: '52px'
      }
    }

    return sizes[size]
  }

  const getVariantStyles = () => {
    const baseStyles = {
      width: '100%',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      outline: 'none',
      fontFamily: 'inherit',
      color: '#1f2937',
      appearance: 'none' as const,
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 12px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      paddingRight: '44px'
    }

    const variants = {
      default: {
        backgroundColor: disabled ? '#f9fafb' : '#fafafa',
        ':focus': {
          borderColor: hasError ? '#ef4444' : '#c79b66',
          backgroundColor: 'white',
          boxShadow: `0 0 0 3px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(199, 155, 102, 0.1)'}`
        }
      },
      filled: {
        backgroundColor: disabled ? '#f3f4f6' : '#f3f4f6',
        border: '1px solid transparent',
        ':focus': {
          backgroundColor: 'white',
          borderColor: hasError ? '#ef4444' : '#c79b66',
          boxShadow: `0 0 0 3px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(199, 155, 102, 0.1)'}`
        }
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: '2px',
        ':focus': {
          borderColor: hasError ? '#ef4444' : '#af1731',
          boxShadow: `0 0 0 2px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(175, 23, 49, 0.1)'}`
        }
      }
    }

    if (hasError) {
      baseStyles.borderColor = '#ef4444'
    } else if (hasSuccess) {
      baseStyles.borderColor = '#10b981'
    }

    return { ...baseStyles, ...variants[variant] }
  }

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: '500',
          color: disabled ? '#9ca3af' : '#374151'
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <select
          {...props}
          ref={ref}
          disabled={disabled}
          required={required}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          style={{
            ...getVariantStyles(),
            ...getSizeStyles(),
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            ...(isFocused && !disabled ? (getVariantStyles() as any)[':focus'] : {}),
            ...style
          }}
          className={className}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : 
            success ? `${props.id}-success` :
            helperText ? `${props.id}-helper` : 
            undefined
          }
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
          {children}
        </select>

        {(hasError || hasSuccess) && (
          <div style={{
            position: 'absolute',
            right: '36px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            {hasError && (
              <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
            )}
            {hasSuccess && (
              <Check style={{ width: '16px', height: '16px', color: '#10b981' }} />
            )}
          </div>
        )}
      </div>

      {error && (
        <p id={`${props.id}-error`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#ef4444',
          margin: '6px 0 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <AlertCircle style={{ width: '14px', height: '14px' }} />
          {error}
        </p>
      )}

      {success && !error && (
        <p id={`${props.id}-success`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#10b981',
          margin: '6px 0 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Check style={{ width: '14px', height: '14px' }} />
          {success}
        </p>
      )}

      {helperText && !error && !success && (
        <p id={`${props.id}-helper`} style={{
          marginTop: '6px',
          fontSize: '14px',
          color: '#6b7280',
          margin: '6px 0 0 0'
        }}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Input