// Exportaciones de componentes UI
export { default as Button } from './Button'
export type { ButtonProps } from './Button'

export { default as Card, PerritoCard } from './Card'
export type { CardProps, PerritoCardProps } from './Card'

export { default as Input, Textarea, Select, validators } from './Input'
export type { InputProps, TextareaProps, SelectProps, BaseInputProps } from './Input'

export { default as Form, FormField, FormSection, FormGroup, useForm } from './Form'
export type { 
  FormProps, 
  FormFieldProps, 
  FormSectionProps, 
  FormGroupProps, 
  ValidationRule 
} from './Form'

export { default as Modal, ConfirmModal, AlertModal } from './Modal'
export type { ModalProps, ConfirmModalProps, AlertModalProps } from './Modal'

// Exportaciones de componentes existentes
export { default as LoadingSpinner } from './LoadingSpinner'
export { default as ErrorMessage } from './ErrorMessage'
export { default as EmptyState } from './EmptyState'
export { default as PerritoDetailSkeleton } from './PerritoDetailSkeleton'

// Re-exportaciones para compatibilidad
export {
  // Iconos más comunes para uso con los componentes
  Search,
  Filter,
  Heart,
  Eye,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
  Plus,
  Minus,
  Check,
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  EyeOff
} from 'lucide-react'