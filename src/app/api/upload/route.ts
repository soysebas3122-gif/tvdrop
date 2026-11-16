import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.apk', '.apks', '.xapk', '.zip', '.m3u', '.m3u8'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No seleccionaste ningún archivo.' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Formato no válido. Usa: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    const blob = await put(`tvdrop/${code}/${sanitizedName}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    const baseUrl = request.nextUrl.origin.replace(/^https?:\/\//, '');

    return NextResponse.json({
      success: true,
      code,
      tvDisplayUrl: `${baseUrl}/${code}`,
      directUrl: blob.url,
      fileName: sanitizedName,
    });
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    return NextResponse.json(
      { error: 'Error al subir. Verifica que el almacenamiento Blob esté activado en Vercel.' },
      { status: 500 }
    );
  }
}
