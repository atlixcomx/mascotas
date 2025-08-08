'use client'

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../app/api/uploadthing/core";
import { useEffect } from "react";

const BaseUploadButton = generateUploadButton<OurFileRouter>();

// Wrapper con logging mejorado para debugging
export function UploadButton(props: any) {
  // Debug al montar el componente
  useEffect(() => {
    console.log("🔧 UploadButton mounted");
    console.log("Props:", props);
    console.log("Environment:", {
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      origin: typeof window !== 'undefined' ? window.location.origin : 'server',
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'server',
    });
    
    // Verificar si hay algún problema con la configuración
    if (typeof window !== 'undefined') {
      // Hacer una petición de prueba al endpoint
      fetch('/api/uploadthing')
        .then(res => {
          console.log("Test fetch status:", res.status);
          return res.text();
        })
        .then(text => {
          console.log("Test fetch response:", text.substring(0, 100));
        })
        .catch(err => {
          console.error("Test fetch error:", err);
        });
    }
  }, []);

  return (
    <BaseUploadButton
      {...props}
      onBeforeUploadBegin={(files) => {
        console.log("📁 Files to upload:", files);
        console.log("Number of files:", files.length);
        files.forEach((file, index) => {
          console.log(`File ${index + 1}:`, {
            name: file.name,
            size: file.size,
            type: file.type
          });
        });
        return files;
      }}
      onUploadBegin={() => {
        console.log("🚀 Upload beginning...");
        console.log("Timestamp:", new Date().toISOString());
        console.log("Endpoint:", props.endpoint || "default");
        props.onUploadBegin?.();
      }}
      onClientUploadComplete={(res) => {
        console.log("✅ Client upload complete:", res);
        if (res && res.length > 0) {
          console.log("File URL:", res[0].url);
          console.log("File name:", res[0].name);
          console.log("File size:", res[0].size);
        }
        props.onClientUploadComplete?.(res);
      }}
      onUploadError={(error: Error) => {
        console.error("❌ Upload error details:");
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Intentar extraer más información del error
        if (error && typeof error === 'object') {
          const errorObj = error as any;
          if (errorObj.data) {
            console.error("Error data:", errorObj.data);
          }
          if (errorObj.cause) {
            console.error("Error cause:", errorObj.cause);
          }
          if (errorObj.code) {
            console.error("Error code:", errorObj.code);
          }
          console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        }
        
        // Log adicional para el error específico de "Failed to parse response"
        if (error.message.includes("Failed to parse response")) {
          console.error("⚠️ This is a parsing error. The server responded but with unexpected format.");
          console.error("Common causes:");
          console.error("1. Token not configured in production");
          console.error("2. CORS or middleware issues");
          console.error("3. Server returning HTML instead of JSON");
          console.error("4. Timeout en Vercel (check vercel.json configuration)");
        }
        
        // Mejorar mensaje de error para el usuario
        if (error.message.includes("Failed to parse response")) {
          error.message = "Error de conexión con el servidor. Por favor intenta de nuevo en unos segundos.";
        } else if (error.message.includes("timeout")) {
          error.message = "La carga tomó demasiado tiempo. Por favor intenta con una imagen más pequeña.";
        }
        
        props.onUploadError?.(error);
      }}
      onUploadProgress={(progress) => {
        console.log(`📊 Upload progress: ${progress}%`);
        props.onUploadProgress?.(progress);
      }}
    />
  );
}