import { verifyToken } from '@/lib/auth';
import { getUserMedia } from '@/lib/db';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const media = await getUserMedia(decoded.username);
    return Response.json(media);
  } catch (error) {
    console.error('Media error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
