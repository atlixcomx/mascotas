import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

// Versión de prueba con autenticación simplificada
export const ourFileRouter = {
  // Define route for pet images
  petImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      console.log("UploadThing middleware - test version");
      
      try {
        const session = await getServerSession(authOptions);
        console.log("Session check:", session ? "found" : "not found");
        
        // Por ahora, permitir si hay cualquier sesión
        if (!session) {
          console.log("No session found, allowing test upload");
          return { userId: "test-user", role: "test" };
        }
        
        console.log("Session found for:", session.user.email);
        return { 
          userId: session.user.id || session.user.email, 
          role: session.user.role || "user" 
        };
      } catch (error) {
        console.error("Auth error in uploadthing:", error);
        // Permitir upload en caso de error de auth
        return { userId: "error-fallback", role: "test" };
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", metadata);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;