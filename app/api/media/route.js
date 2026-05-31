import { verifyToken } from '@/lib/auth';
import { getUserMedia, getPublicMedia } from '@/lib/db';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    // Kalo ada token, ambil media user tersebut (termasuk publik milik sendiri)
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const media = await getUserMedia(decoded.username);
        return Response.json(media);
      }
    }
    
    // Kalo gak ada token, ambil semua media publik
    const publicMedia = await getPublicMedia();
    return Response.json(publicMedia);
  } catch (error) {
    console.error('Media API error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
