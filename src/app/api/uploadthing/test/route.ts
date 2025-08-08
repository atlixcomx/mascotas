import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

export async function GET(request: Request) {
  try {
    // Check environment variables
    const hasToken = !!process.env.UPLOADTHING_TOKEN;
    const tokenLength = process.env.UPLOADTHING_TOKEN?.length || 0;
    const tokenPrefix = process.env.UPLOADTHING_TOKEN?.substring(0, 20) || 'not-set';
    
    // Decode token to check structure
    let tokenInfo = { valid: false, appId: null, hasApiKey: false };
    if (process.env.UPLOADTHING_TOKEN) {
      try {
        const decoded = Buffer.from(process.env.UPLOADTHING_TOKEN, 'base64').toString('utf-8');
        const tokenData = JSON.parse(decoded);
        tokenInfo = {
          valid: true,
          appId: tokenData.appId,
          hasApiKey: !!tokenData.apiKey,
        };
      } catch (e) {
        tokenInfo.valid = false;
      }
    }
    
    // Check session
    let sessionInfo = { hasSession: false, user: null };
    try {
      const session = await getServerSession(authOptions);
      sessionInfo = {
        hasSession: !!session,
        user: session?.user?.email || null
      };
    } catch (error) {
      console.error("Session error in test:", error);
    }

    // Check if we can import the file router
    let fileRouterStatus = 'unknown';
    try {
      const { ourFileRouter } = await import('../core');
      fileRouterStatus = ourFileRouter ? 'loaded' : 'error';
    } catch (error) {
      fileRouterStatus = 'import-error';
      console.error("FileRouter import error:", error);
    }

    // Get request info
    const url = new URL(request.url);

    return NextResponse.json({
      status: 'ok',
      env: {
        hasToken,
        tokenLength,
        tokenPrefix,
        tokenInfo,
        nodeEnv: process.env.NODE_ENV,
        uploadthingUrl: process.env.UPLOADTHING_URL || 'not-set',
      },
      session: sessionInfo,
      fileRouter: fileRouterStatus,
      request: {
        url: url.href,
        origin: url.origin,
        pathname: url.pathname,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}