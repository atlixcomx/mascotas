'use client'

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../app/api/uploadthing/core";

const BaseUploadButton = generateUploadButton<OurFileRouter>();

// Wrapper con logging mejorado para debugging
export function UploadButton(props: any) {
  return (
    <BaseUploadButton
      {...props}
      onUploadBegin={() => {
        console.log("🚀 Upload beginning...");
        console.log("Timestamp:", new Date().toISOString());
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
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error object:", error);
        
        // Intentar extraer más información del error
        if (error && typeof error === 'object') {
          console.error("Error properties:", Object.keys(error));
          console.error("Error as JSON:", JSON.stringify(error, null, 2));
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