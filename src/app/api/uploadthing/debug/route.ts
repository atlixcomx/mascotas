import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "../core";

// Handler personalizado con logging
async function debugHandler(req: NextRequest) {
  console.log("=== UploadThing Debug Handler ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  try {
    // Verificar token
    const token = process.env.UPLOADTHING_TOKEN;
    if (!token) {
      console.error("❌ NO TOKEN!");
      return NextResponse.json({ 
        error: "UPLOADTHING_TOKEN not configured" 
      }, { status: 500 });
    }
    
    // Crear handler normal
    const { GET, POST } = createRouteHandler({
      router: ourFileRouter,
      config: {
        token: process.env.UPLOADTHING_TOKEN,
        logLevel: "debug",
      },
    });
    
    // Delegar según método
    if (req.method === "GET") {
      return GET(req);
    } else if (req.method === "POST") {
      return POST(req);
    }
    
    return NextResponse.json({ 
      error: "Method not allowed" 
    }, { status: 405 });
    
  } catch (error) {
    console.error("❌ Error in debug handler:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export const GET = debugHandler;
export const POST = debugHandler;