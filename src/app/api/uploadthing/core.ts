import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter básico sin autenticación compleja
export const ourFileRouter = {
  petImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Middleware mínimo - solo logging
      console.log("Upload middleware triggered at:", new Date().toISOString());
      return { userId: "user" };
    })
    .onUploadComplete(async ({ file }) => {
      // Retornar solo la URL
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;