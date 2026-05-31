import { verifyToken } from '@/lib/auth';
import { saveMedia } from '@/lib/db';

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
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([buffer], { type: file.type });
    
    const uploadForm = new FormData();
    uploadForm.append('chat_id', STORAGE_GROUP_ID);
    
    // Kirim sesuai tipe (foto atau video)
    if (type === 'video') {
      uploadForm.append('video', blob, file.name);
    } else {
      uploadForm.append('photo', blob, file.name);
    }
    
    const endpoint = type === 'video' ? 'sendVideo' : 'sendPhoto';
    const response = await fetch(`${TG_API}/${endpoint}`, {
      method: 'POST',
      body: uploadForm
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      return Response.json({ error: 'Gagal upload ke Telegram, Bos!' }, { status: 500 });
    }
    
    let fileId, messageId, mediaUrl;
    
    if (type === 'video') {
      fileId = result.result.video.file_id;
      messageId = result.result.message_id;
      mediaUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileId}`;
    } else {
      fileId = result.result.photo[result.result.photo.length - 1].file_id;
      messageId = result.result.message_id;
      mediaUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileId}`;
    }
    
    await saveMedia(decoded.userId, decoded.username, fileId, messageId, mediaUrl, file.name, description, visibility, type);
    
    return Response.json({ success: true, mediaUrl, messageId });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
