'use client'

import { useState } from 'react'
import { UploadButton } from '@/components/UploadButton'

export default function TestUploadPage() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test de UploadThing</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Cargar Imagen</h2>
        
        <UploadButton
          endpoint="petImageUploader"
          onClientUploadComplete={(res) => {
            console.log("✅ Upload exitoso:", res);
            if (res && res[0]) {
              setUploadedUrls(prev => [...prev, res[0].url])
              setError('')
            }
          }}
          onUploadError={(error: Error) => {
            console.error("❌ Error en upload:", error);
            setError(error.message)
          }}
          onUploadBegin={() => {
            console.log("🚀 Iniciando upload...");
            setError('')
          }}
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}
      </div>

      {uploadedUrls.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Imágenes Cargadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img 
                  src={url} 
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-600 truncate">{url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Información de Debug</h3>
        <pre className="text-xs bg-white p-3 rounded border">
{`Endpoint: petImageUploader
Max Size: 4MB
Max Files: 1
Token configurado: ${!!process.env.NEXT_PUBLIC_UPLOADTHING_TOKEN ? 'Sí' : 'No (OK - se usa en servidor)'}
URL Base: ${typeof window !== 'undefined' ? window.location.origin : 'N/A'}`}
        </pre>
      </div>
    </div>
  )
}