import { verifyToken } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';

const BOT_TOKEN = process.env.BOT_TOKEN;
const STORAGE_GROUP_ID = process.env.STORAGE_GROUP_ID;
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function POST(req) {
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
    
    const formData = await req.formData();
    const file = formData.get('file');
    const description = formData.get('description') || '';
    const visibility = formData.get('visibility') || 'public';
    const type = formData.get('type') || 'image';
    
    if (!file) {
      return Response.json({ error: 'Upload file dulu, Bos!' }, { status: 400 });
    }
    
    // Upload ke Telegram
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([buffer], { type: file.type });
    
    const uploadForm = new FormData();
    uploadForm.append('chat_id', STORAGE_GROUP_ID);
    uploadForm.append('photo', blob, file.name);
    
    const response = await fetch(`${TG_API}/sendPhoto`, {
      method: 'POST',
      body: uploadForm
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      console.error('Telegram API error:', result);
      return Response.json({ error: 'Gagal upload ke Telegram, Bos!' }, { status: 500 });
    }
    
    const messageId = result.result.message_id;
    const fileId = result.result.photo[result.result.photo.length - 1].file_id;
    const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileId}`;
    
    // Simpan ke MongoDB
    const images = await getCollection('images');
    await images.insertOne({
      username: decoded.username,
      user_id: decoded.userId,
      image_url: imageUrl,
      media_url: imageUrl,
      file_id: fileId,
      telegram_message_id: messageId,
      description: description,
      visibility: visibility,
      type: 'image',
      uploaded_at: new Date(),
      is_deleted: false
    });
    
    return Response.json({ success: true, imageUrl, messageId });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
