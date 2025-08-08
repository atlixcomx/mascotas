import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

const f = createUploadthing();

// Verificar configuración al iniciar
const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN;
if (!UPLOADTHING_TOKEN) {
  console.error("❌ UPLOADTHING_TOKEN no está configurado!");
} else {
  console.log("✅ UPLOADTHING_TOKEN configurado, longitud:", UPLOADTHING_TOKEN.length);
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define route for pet images
  petImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      console.log("=== UploadThing Middleware ===");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Method:", req.method);
      console.log("URL:", req.url);
      console.log("Headers:", Object.fromEntries(req.headers.entries()));
      
      // Verificar token nuevamente
      if (!process.env.UPLOADTHING_TOKEN) {
        console.error("❌ Token no disponible en middleware!");
        throw new Error("UploadThing token not configured");
      }
      
      // Simplificar autenticación al máximo
      try {
        const session = await getServerSession(authOptions);
        if (session?.user) {
          console.log("✅ Usuario autenticado:", session.user.email);
          return { 
            userId: session.user.email || "user",
          };
        }
      } catch (error) {
        console.log("⚠️ Error obteniendo sesión:", error);
      }

      // Permitir upload sin sesión
      console.log("✅ Permitiendo upload como invitado");
      return { 
        userId: "guest",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("=== Upload Complete ===");
      console.log("File:", file);
      console.log("Metadata:", metadata);

      // Return minimal data
      return { 
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;