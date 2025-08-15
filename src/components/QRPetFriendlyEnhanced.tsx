'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface QRPetFriendlyEnhancedProps {
  url: string
  size?: number
  color?: string
  backgroundColor?: string
  comercioNombre?: string
  codigo?: string
  categoria?: string
}

export default function QRPetFriendlyEnhanced({ 
  url, 
  size = 400, 
  color = '#0891b2',
  backgroundColor = '#f0f9ff',
  comercioNombre = 'Pet Friendly',
  codigo = '',
  categoria = 'hotel'
}: QRPetFriendlyEnhancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Configurar canvas con mayor tamaño para mejor calidad
      const canvasWidth = size + 140
      const canvasHeight = size + 240
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Crear gradiente de fondo
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
      gradient.addColorStop(0, '#ffffff')
      gradient.addColorStop(1, backgroundColor)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Sombra para el contenedor principal
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 10

      // Contenedor principal con bordes redondeados
      const containerMargin = 25
      const containerRadius = 20
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      roundedRect(ctx, containerMargin, containerMargin, 
                  canvasWidth - containerMargin * 2, 
                  canvasHeight - containerMargin * 2 - 40, 
                  containerRadius)
      ctx.fill()
      
      // Resetear sombra
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Borde decorativo superior con gradiente
      const borderGradient = ctx.createLinearGradient(0, 0, canvasWidth, 0)
      borderGradient.addColorStop(0, color)
      borderGradient.addColorStop(0.5, adjustColor(color, 20))
      borderGradient.addColorStop(1, color)
      ctx.fillStyle = borderGradient
      ctx.beginPath()
      roundedRect(ctx, containerMargin, containerMargin, 
                  canvasWidth - containerMargin * 2, 8, 
                  [containerRadius, containerRadius, 0, 0])
      ctx.fill()

      // Header con información del comercio
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(comercioNombre, canvasWidth/2, 70)

      // Código del comercio
      if (codigo) {
        ctx.fillStyle = '#6b7280'
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.fillText(`Código: ${codigo}`, canvasWidth/2, 92)
      }

      // Contenedor del QR con borde decorativo
      const qrContainer = {
        x: 50,
        y: 110,
        width: size,
        height: size
      }

      // Fondo del QR con patrón sutil
      ctx.fillStyle = '#fafafa'
      ctx.fillRect(qrContainer.x - 10, qrContainer.y - 10, 
                   qrContainer.width + 20, qrContainer.height + 20)

      // Marco decorativo del QR
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])
      ctx.strokeRect(qrContainer.x - 10, qrContainer.y - 10, 
                     qrContainer.width + 20, qrContainer.height + 20)
      ctx.setLineDash([])

      // Generar QR Code de alta calidad
      try {
        const qrCanvas = document.createElement('canvas')
        await QRCode.toCanvas(qrCanvas, url, {
          width: size - 20,
          margin: 1,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        })

        // Dibujar QR en el canvas principal
        ctx.drawImage(qrCanvas, qrContainer.x, qrContainer.y)

        // Logo central mejorado
        const logoSize = 90
        const logoX = canvasWidth/2 - logoSize/2
        const logoY = qrContainer.y + qrContainer.height/2 - logoSize/2

        // Fondo blanco circular para el logo
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(canvasWidth/2, qrContainer.y + qrContainer.height/2, logoSize/2 + 5, 0, Math.PI * 2)
        ctx.fill()

        // Borde del logo
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(canvasWidth/2, qrContainer.y + qrContainer.height/2, logoSize/2 + 5, 0, Math.PI * 2)
        ctx.stroke()

        // Dibujar logo de mascota mejorado
        drawEnhancedPetLogo(ctx, canvasWidth/2, qrContainer.y + qrContainer.height/2, logoSize/2, color)

      } catch (error) {
        console.error('Error generating QR:', error)
      }

      // Texto inferior con estilo mejorado
      const textY = qrContainer.y + qrContainer.height + 40

      // Badge "Pet Friendly"
      const badgeWidth = 180
      const badgeHeight = 35
      const badgeX = canvasWidth/2 - badgeWidth/2
      const badgeY = textY - 20

      // Fondo del badge con gradiente
      const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY)
      badgeGradient.addColorStop(0, color)
      badgeGradient.addColorStop(1, adjustColor(color, -20))
      ctx.fillStyle = badgeGradient
      ctx.beginPath()
      roundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 20)
      ctx.fill()

      // Texto del badge
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('¡Pet Friendly Atlixco!', canvasWidth/2, badgeY + 23)

      // Patitas decorativas mejoradas
      const pawsY = textY + 35
      ctx.fillStyle = color
      ctx.globalAlpha = 0.3
      for (let i = 0; i < 5; i++) {
        const pawX = (canvasWidth/5) * i + canvasWidth/10
        drawStylizedPaw(ctx, pawX, pawsY, 12, color)
      }
      ctx.globalAlpha = 1

      // Footer con instrucción
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Escanea este código para conocer más', canvasWidth/2, canvasHeight - 50)

      // Convertir a imagen
      setImageUrl(canvas.toDataURL('image/png'))
    }

    generateQR()
  }, [url, size, color, backgroundColor, comercioNombre, codigo, categoria])

  // Función auxiliar para crear rectángulos redondeados
  function roundedRect(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    radius: number | number[]
  ) {
    const radii = typeof radius === 'number' 
      ? [radius, radius, radius, radius] 
      : radius

    ctx.moveTo(x + radii[0], y)
    ctx.lineTo(x + width - radii[1], y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radii[1])
    ctx.lineTo(x + width, y + height - radii[2])
    ctx.quadraticCurveTo(x + width, y + height, x + width - radii[2], y + height)
    ctx.lineTo(x + radii[3], y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radii[3])
    ctx.lineTo(x, y + radii[0])
    ctx.quadraticCurveTo(x, y, x + radii[0], y)
    ctx.closePath()
  }

  // Función para ajustar brillo del color
  function adjustColor(color: string, amount: number): string {
    const hex = color.replace('#', '')
    const num = parseInt(hex, 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + amount))
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  // Función para dibujar logo de mascota mejorado
  function drawEnhancedPetLogo(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    color: string
  ) {
    ctx.fillStyle = color
    
    // Cabeza más detallada
    ctx.beginPath()
    ctx.ellipse(x, y - 5, size * 0.6, size * 0.55, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Orejas mejoradas
    ctx.beginPath()
    ctx.ellipse(x - size * 0.45, y - size * 0.4, size * 0.25, size * 0.35, -0.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(x + size * 0.45, y - size * 0.4, size * 0.25, size * 0.35, 0.4, 0, Math.PI * 2)
    ctx.fill()
    
    // Hocico
    ctx.beginPath()
    ctx.ellipse(x, y + size * 0.15, size * 0.35, size * 0.25, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Nariz (pequeño detalle)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(x, y + size * 0.1, size * 0.08, size * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Función para dibujar patitas estilizadas
  function drawStylizedPaw(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    size: number, 
    color: string
  ) {
    ctx.fillStyle = color
    
    // Almohadillas de los dedos con mejor distribución
    const positions = [
      { x: -0.3, y: -0.5, w: 0.25, h: 0.3 },
      { x: -0.1, y: -0.6, w: 0.25, h: 0.3 },
      { x: 0.1, y: -0.6, w: 0.25, h: 0.3 },
      { x: 0.3, y: -0.5, w: 0.25, h: 0.3 }
    ]
    
    positions.forEach(pos => {
      ctx.beginPath()
      ctx.ellipse(
        x + pos.x * size, 
        y + pos.y * size, 
        size * pos.w, 
        size * pos.h, 
        0, 0, Math.PI * 2
      )
      ctx.fill()
    })
    
    // Almohadilla principal más grande
    ctx.beginPath()
    ctx.ellipse(x, y + size * 0.2, size * 0.45, size * 0.4, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  return (
    <div style={{ 
      position: 'relative', 
      display: 'inline-block',
      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="QR Code Pet Friendly Enhanced"
          style={{ 
            width: '100%', 
            height: 'auto',
            maxWidth: `${size + 140}px`,
            borderRadius: '8px'
          }}
        />
      )}
    </div>
  )
}