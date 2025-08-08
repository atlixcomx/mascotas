import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

export async function GET() {
  try {
    // Check environment variables
    const hasToken = !!process.env.UPLOADTHING_TOKEN;
    const tokenLength = process.env.UPLOADTHING_TOKEN?.length || 0;
    const tokenPrefix = process.env.UPLOADTHING_TOKEN?.substring(0, 20) || 'not-set';
    
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

    return NextResponse.json({
      status: 'ok',
      env: {
        hasToken,
        tokenLength,
        tokenPrefix,
        nodeEnv: process.env.NODE_ENV,
      },
      session: sessionInfo,
      fileRouter: fileRouterStatus,
      timestamp: new Date().toISOString(),
      headers: {
        origin: process.env.NEXTAUTH_URL || 'not-set',
      }
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