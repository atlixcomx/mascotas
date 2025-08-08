import { createRouteHandler } from "uploadthing/next";

// Usar el file router más simple
const f = require("uploadthing/next").createUploadthing();

const simpleFileRouter = {
  petImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => ({ userId: "test" }))
    .onUploadComplete(({ file }) => ({ url: file.url })),
};

export const { GET, POST } = createRouteHandler({
  router: simpleFileRouter,
});