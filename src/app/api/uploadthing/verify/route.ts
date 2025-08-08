import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar token
    const token = process.env.UPLOADTHING_TOKEN;
    if (!token) {
      return NextResponse.json({ 
        error: 'UPLOADTHING_TOKEN not configured',
        status: 'error' 
      }, { status: 500 });
    }

    // Decodificar token para obtener información
    let tokenData;
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      tokenData = JSON.parse(decoded);
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid token format',
        status: 'error' 
      }, { status: 500 });
    }

    // Hacer una petición de prueba a UploadThing
    const testResponse = await fetch('https://api.uploadthing.com/v6/getSignedURL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-uploadthing-api-key': tokenData.apiKey,
      },
      body: JSON.stringify({
        appId: tokenData.appId,
        apiKey: tokenData.apiKey,
        // Este es un test, no vamos a subir nada realmente
        files: []
      })
    });

    const responseText = await testResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return NextResponse.json({
      status: testResponse.ok ? 'connected' : 'error',
      tokenInfo: {
        hasApiKey: !!tokenData.apiKey,
        appId: tokenData.appId,
        regions: tokenData.regions,
        apiKeyPrefix: tokenData.apiKey?.substring(0, 15) + '...'
      },
      apiResponse: {
        status: testResponse.status,
        statusText: testResponse.statusText,
        data: responseData
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('UploadThing verification error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}