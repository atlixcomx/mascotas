import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Verificar token antes de crear el handler
const token = process.env.UPLOADTHING_TOKEN;
console.log("=== UploadThing Route Config ===");
console.log("Token exists:", !!token);
console.log("Token length:", token?.length || 0);
console.log("Node env:", process.env.NODE_ENV);

// Crear el handler con manejo de errores mejorado
const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
    logLevel: "debug",
  },
});

// Wrapper para agregar logging y manejo de errores
export async function GET(request: NextRequest) {
  console.log("GET /api/uploadthing");
  try {
    return await handlers.GET(request);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("POST /api/uploadthing");
  console.log("Content-Type:", request.headers.get("content-type"));
  
  try {
    const response = await handlers.POST(request);
    console.log("Response status:", response.status);
    return response;
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}