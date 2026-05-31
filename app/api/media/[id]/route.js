import { verifyToken } from '@/lib/auth';
import { deleteMedia } from '@/lib/db';

const BOT_TOKEN = process.env.BOT_TOKEN;
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

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
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'image';
    
    // Panggil fungsi deleteMedia dari lib/db.js (sudah include hapus dari Telegram)
    const deleted = await deleteMedia(decoded.username, id, type);
    
    if (!deleted) {
      return Response.json({ error: 'Media tidak ditemukan, Bos!' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
