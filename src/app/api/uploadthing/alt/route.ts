import { NextRequest, NextResponse } from 'next/server';

// Importación dinámica para evitar problemas de build
let UTApi: any;

async function getUTApi() {
  if (!UTApi) {
    const module = await import("uploadthing/server");
    UTApi = module.UTApi;
  }
  return new UTApi({
    token: process.env.UPLOADTHING_TOKEN,
  });
}

export async function POST(request: NextRequest) {
  console.log("=== Alternative UploadThing Handler ===");
  
  try {
    // Verificar token
    if (!process.env.UPLOADTHING_TOKEN) {
      return NextResponse.json(
        { error: "UPLOADTHING_TOKEN not configured" },
        { status: 500 }
      );
    }

    // Obtener el archivo del form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    console.log(`Uploading ${files.length} files...`);

    // Obtener instancia de UTApi
    const utapi = await getUTApi();

    // Subir archivos usando UTApi
    const responses = await Promise.all(
      files.map(async (file) => {
        try {
          const blob = new Blob([await file.arrayBuffer()], { type: file.type });
          const uploadedFile = await utapi.uploadFiles(blob);
          return uploadedFile;
        } catch (error) {
          console.error("Error uploading file:", error);
          return { error: error instanceof Error ? error.message : "Upload failed" };
        }
      })
    );

    // Filtrar respuestas exitosas
    const successful = responses.filter(r => 'url' in r);
    const failed = responses.filter(r => 'error' in r);

    if (successful.length === 0) {
      return NextResponse.json(
        { error: "All uploads failed", details: failed },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uploaded: successful,
      failed: failed.length > 0 ? failed : undefined,
    });

  } catch (error) {
    console.error("Alternative handler error:", error);
    return NextResponse.json(
      { 
        error: "Upload failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Alternative UploadThing endpoint",
    hasToken: !!process.env.UPLOADTHING_TOKEN,
    timestamp: new Date().toISOString()
  });
}