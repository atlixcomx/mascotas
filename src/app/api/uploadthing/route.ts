import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Verificar token antes de crear el handler
const token = process.env.UPLOADTHING_TOKEN;
if (!token) {
  console.error("❌ UPLOADTHING_TOKEN no está configurado en route.ts!");
} else {
  console.log("✅ Token disponible en route.ts, longitud:", token.length);
}

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
    logLevel: "debug", // Activar logs de debug
  },
});