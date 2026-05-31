import { verifyToken } from '@/lib/auth';
import { deleteImageFromDB } from '@/lib/db';

export async function DELETE(req, { params }) {
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
    
    const { id } = params;
    const deleted = await deleteImageFromDB(decoded.username, id);
    
    if (!deleted) {
      return Response.json({ error: 'Foto gak ditemukan, Bos!' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
