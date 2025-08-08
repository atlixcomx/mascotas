'use client'

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../app/api/uploadthing/core";

const BaseUploadButton = generateUploadButton<OurFileRouter>();

// Wrapper con logging mejorado para debugging
export function UploadButton(props: any) {
  // Log del entorno
  if (typeof window !== 'undefined') {
    console.log("🌐 Upload environment:");
    console.log("- URL:", window.location.href);
    console.log("- Origin:", window.location.origin);
    console.log("- Protocol:", window.location.protocol);
  }

  return (
    <BaseUploadButton
      {...props}
      url={typeof window !== 'undefined' ? `${window.location.origin}/api/uploadthing` : undefined}
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
          console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
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