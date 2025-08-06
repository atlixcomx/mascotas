'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'gray'
  text?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'text-red-600',
    secondary: 'text-yellow-600',
    gray: 'text-gray-500'
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '12px' 
    }}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        style={{
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          border: '2px solid currentColor',
          borderTopColor: 'transparent'
        }}
      />
      {text && (
        <p style={{ 
          fontSize: '14px', 
          color: '#666',
          margin: 0
        }}>
          {text}
        </p>
      )}
    </div>
  )
}