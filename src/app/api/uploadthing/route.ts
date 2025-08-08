import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/uploadthing`,
    isDev: process.env.NODE_ENV === "development",
  },
});