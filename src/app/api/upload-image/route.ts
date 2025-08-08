import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no válido' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const extension = file.name.split('.').pop();
    const fileName = `pet-${timestamp}-${randomId}.${extension}`;

    // En producción, usar un servicio externo
    if (process.env.NODE_ENV === 'production') {
      // Opción 1: Convertir a base64 y devolver data URL
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      return NextResponse.json({
        success: true,
        data: {
          url: dataUrl,
          name: fileName,
          size: file.size,
          type: file.type
        }
      });
    } else {
      // En desarrollo, guardar localmente
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Crear directorio si no existe
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      // Guardar archivo
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      // Devolver URL relativa
      const url = `/uploads/${fileName}`;
      
      return NextResponse.json({
        success: true,
        data: {
          url,
          name: fileName,
          size: file.size,
          type: file.type
        }
      });
    }
  } catch (error) {
    console.error('Error en upload-image:', error);
    return NextResponse.json(
      { error: 'Error al procesar la imagen' },
      { status: 500 }
    );
  }
}