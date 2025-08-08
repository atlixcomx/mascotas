import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Versión simplificada para debugging
export const ourFileRouter = {
  // Define route for pet images - sin autenticación temporal
  petImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      console.log("UploadThing middleware - simplified version");
      // Temporalmente sin verificación de auth para debugging
      return { userId: "test-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete - simplified");
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;