import { getPublicMedia } from '@/lib/db';

export async function GET() {
  try {
    const publicMedia = await getPublicMedia();
    return Response.json(publicMedia);
  } catch (error) {
    console.error('Public API error:', error);
    return Response.json({ error: 'Terjadi kesalahan' }, { status: 500 });
  }
}
