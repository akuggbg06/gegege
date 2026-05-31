import { verifyToken } from '@/lib/auth';
import { getUserMedia, getPublicMedia } from '@/lib/db';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    // Cek token
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // Ambil media user yang login (termasuk publik miliknya sendiri)
        const media = await getUserMedia(decoded.username);
        return Response.json(media);
      }
    }
    
    // Kalo gak ada token atau token invalid, ambil semua media publik dari semua user
    const publicMedia = await getPublicMedia();
    return Response.json(publicMedia);
  } catch (error) {
    console.error('Media API error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
