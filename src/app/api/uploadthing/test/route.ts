import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    env: {
      hasToken: !!process.env.UPLOADTHING_TOKEN,
      tokenLength: process.env.UPLOADTHING_TOKEN?.length || 0,
      tokenPrefix: process.env.UPLOADTHING_TOKEN?.substring(0, 20) || 'not-set',
      nodeEnv: process.env.NODE_ENV,
    },
    timestamp: new Date().toISOString()
  });
}