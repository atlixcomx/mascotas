'use client'

import { useState } from 'react'
import { Upload, Link, Check, AlertCircle } from 'lucide-react'

interface SimpleImageUploaderProps {
  onImageAdded: (url: string) => void
}

export function SimpleImageUploader({ onImageAdded }: SimpleImageUploaderProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const validateAndAddImage = () => {
    setError('')
    setShowSuccess(false)

    if (!url.trim()) {
      setError('Por favor ingresa una URL')
      return
    }

    // Validación básica de URL de imagen
    const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i
    const isValidImageUrl = url.startsWith('http') && (
      imageUrlPattern.test(url) || 
      url.includes('uploadthing.com') ||
      url.includes('utfs.io') ||
      url.includes('unsplash.com') ||
      url.includes('pexels.com') ||
      url.includes('imgur.com') ||
      url.includes('cloudinary.com')
    )

    if (!isValidImageUrl) {
      setError('La URL no parece ser una imagen válida')
      return
    }

    // Verificar que la imagen se puede cargar
    const img = new Image()
    img.onload = () => {
      onImageAdded(url)
      setUrl('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
    img.onerror = () => {
      setError('No se pudo cargar la imagen desde esa URL')
    }
    img.src = url
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      validateAndAddImage()
    }
  }

  const suggestedServices = [
    { name: 'ImgBB', url: 'https://imgbb.com', color: 'text-blue-600' },
    { name: 'Imgur', url: 'https://imgur.com/upload', color: 'text-green-600' },
    { name: 'Postimages', url: 'https://postimages.org', color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Link className="h-4 w-4" />
          Agregar imagen por URL
        </h4>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={validateAndAddImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Agregar
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {showSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              ¡Imagen agregada exitosamente!
            </div>
          )}

          <div className="text-sm text-slate-600">
            <p className="mb-2">Puedes subir imágenes gratis en:</p>
            <div className="flex gap-3">
              {suggestedServices.map((service) => (
                <a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${service.color} hover:underline font-medium`}
                >
                  {service.name} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        <p>Consejo: Sube tu imagen a uno de los servicios sugeridos, copia la URL directa de la imagen (termina en .jpg, .png, etc.) y pégala aquí.</p>
      </div>
    </div>
  )
}