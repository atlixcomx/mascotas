'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface QRPetFriendlyProps {
  url: string
  size?: number
  color?: string
  backgroundColor?: string
  comercioNombre?: string
}

export default function QRPetFriendly({ 
  url, 
  size = 400, 
  color = '#af1731',
  backgroundColor = '#fff7ed',
  comercioNombre = 'Pet Friendly'
}: QRPetFriendlyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Configurar canvas
      canvas.width = size + 100
      canvas.height = size + 180

      // Fondo blanco
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar patrón de huellas de fondo
      ctx.fillStyle = backgroundColor
      ctx.globalAlpha = 0.3
      
      // Patrón de huellas
      for (let x = 0; x < canvas.width; x += 80) {
        for (let y = 0; y < canvas.height; y += 80) {
          drawPaw(ctx, x + 20, y + 20, 15, backgroundColor)
        }
      }
      ctx.globalAlpha = 1

      // Marco decorativo
      ctx.strokeStyle = color
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Marco con esquinas redondeadas
      const margin = 20
      const radius = 30
      ctx.beginPath()
      ctx.moveTo(margin + radius, margin)
      ctx.lineTo(canvas.width - margin - radius, margin)
      ctx.arcTo(canvas.width - margin, margin, canvas.width - margin, margin + radius, radius)
      ctx.lineTo(canvas.width - margin, size + 60 - radius)
      ctx.arcTo(canvas.width - margin, size + 60, canvas.width - margin - radius, size + 60, radius)
      ctx.lineTo(margin + radius, size + 60)
      ctx.arcTo(margin, size + 60, margin, size + 60 - radius, radius)
      ctx.lineTo(margin, margin + radius)
      ctx.arcTo(margin, margin, margin + radius, margin, radius)
      ctx.closePath()
      ctx.stroke()

      // Generar QR Code
      try {
        const qrCanvas = document.createElement('canvas')
        await QRCode.toCanvas(qrCanvas, url, {
          width: size - 40,
          margin: 2,
          color: {
            dark: color,
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        })

        // Dibujar QR en el canvas principal
        ctx.drawImage(qrCanvas, 50, 50)
      } catch (error) {
        console.error('Error generating QR:', error)
      }

      // Agregar logo de perrito en el centro
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(canvas.width/2 - 40, canvas.height/2 - 60, 80, 80)
      
      // Dibujar silueta de perrito
      ctx.fillStyle = color
      ctx.beginPath()
      // Cabeza
      ctx.arc(canvas.width/2, canvas.height/2 - 30, 25, 0, Math.PI * 2)
      ctx.fill()
      // Orejas
      ctx.beginPath()
      ctx.ellipse(canvas.width/2 - 20, canvas.height/2 - 45, 12, 18, -0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(canvas.width/2 + 20, canvas.height/2 - 45, 12, 18, 0.3, 0, Math.PI * 2)
      ctx.fill()
      // Hocico
      ctx.beginPath()
      ctx.ellipse(canvas.width/2, canvas.height/2 - 20, 15, 12, 0, 0, Math.PI * 2)
      ctx.fill()

      // Texto inferior
      ctx.fillStyle = color
      ctx.font = 'bold 22px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(comercioNombre, canvas.width/2, size + 95)
      
      ctx.font = '16px Arial'
      ctx.fillStyle = '#6b7280'
      ctx.fillText('¡Pet Friendly Atlixco!', canvas.width/2, size + 120)

      // Patitas decorativas en la parte inferior
      ctx.fillStyle = color
      const pawY = size + 140
      for (let i = 0; i < 5; i++) {
        drawPaw(ctx, 80 + i * 60, pawY, 8, color)
      }

      // Convertir a imagen
      setImageUrl(canvas.toDataURL('image/png'))
    }

    generateQR()
  }, [url, size, color, backgroundColor, comercioNombre])

  // Función para dibujar una huella
  function drawPaw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.fillStyle = color
    
    // Almohadillas de los dedos
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2.5 - Math.PI / 3
      const padX = x + Math.cos(angle) * size
      const padY = y + Math.sin(angle) * size - size/2
      ctx.beginPath()
      ctx.ellipse(padX, padY, size/3, size/2.5, angle, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Almohadilla principal
    ctx.beginPath()
    ctx.ellipse(x, y + size/3, size/1.5, size/1.8, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="QR Code Pet Friendly"
          style={{ 
            width: '100%', 
            height: 'auto',
            maxWidth: `${size + 100}px`
          }}
        />
      )}
    </div>
  )
}