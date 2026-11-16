import { list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  try {
    const { blobs } = await list({ prefix: `tvdrop/${code}/` });

    if (!blobs || blobs.length === 0) {
      return new NextResponse('Código no encontrado o archivo expirado.', { status: 404 });
    }

    return NextResponse.redirect(blobs[0].url, 302);
  } catch (error) {
    return new NextResponse('Error al buscar el archivo.', { status: 500 });
  }
}
