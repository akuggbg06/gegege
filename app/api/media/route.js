import { verifyToken } from '@/lib/auth';
import { getUserMedia, getAllMedia } from '@/lib/db';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    // Kalo ada token, ambil media user tersebut
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const media = await getUserMedia(decoded.username);
        return Response.json(media);
      }
    }
    
    // Kalo gak ada token atau token invalid, ambil semua media publik
    const publicMedia = await getAllMedia();
    return Response.json(publicMedia);
  } catch (error) {
    console.error('Media API error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
