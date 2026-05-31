import { verifyToken } from '@/lib/auth';
import { getUserImages } from '@/lib/db';

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
    
    const images = await getUserImages(decoded.username);
    return Response.json(images);
  } catch (error) {
    console.error('Images error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
