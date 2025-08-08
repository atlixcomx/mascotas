import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // UploadThing will use UPLOADTHING_SECRET and UPLOADTHING_APP_ID from env vars
});