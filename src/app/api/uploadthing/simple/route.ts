import { createRouteHandler, createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";

const f = createUploadthing();

const simpleFileRouter = {
  petImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => ({ userId: "test" }))
    .onUploadComplete(({ file }) => ({ url: file.url })),
} satisfies FileRouter;

export const { GET, POST } = createRouteHandler({
  router: simpleFileRouter,
});