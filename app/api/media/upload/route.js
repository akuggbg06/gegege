import { verifyToken } from '@/lib/auth';
import { saveMedia } from '@/lib/db';

const BOT_TOKEN = process.env.BOT_TOKEN;
const STORAGE_GROUP_ID = process.env.STORAGE_GROUP_ID;
const OWNER_ID = process.env.OWNER_ID; // ID Telegram BOS buat pribadi
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
    
    // TENTUKAN TUJUAN PENGIRIMAN
    let targetChatId;
    if (visibility === 'private') {
      // PRIVATE: kirim ke chat pribadi BOS
      targetChatId = OWNER_ID;
      uploadForm.append('chat_id', OWNER_ID);
    } else {
      // PUBLIC: kirim ke grup storage
      targetChatId = STORAGE_GROUP_ID;
      uploadForm.append('chat_id', STORAGE_GROUP_ID);
    }
    
    // Buat caption yang informatif
    const caption = `📸 *Upload oleh:* @${decoded.username}\n📝 *Deskripsi:* ${description || '-'}\n🔒 *Visibilitas:* ${visibility === 'public' ? '🌍 Publik' : '🔒 Pribadi (Owner Only)'}\n📅 *Tanggal:* ${new Date().toLocaleString('id-ID')}`;
    uploadForm.append('caption', caption);
    uploadForm.append('parse_mode', 'Markdown');
    
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
      console.error('Telegram API error:', result);
      return Response.json({ error: 'Gagal upload ke Telegram, Bos!' }, { status: 500 });
    }
    
    let fileId, messageId, mediaUrl;
    
    if (type === 'video') {
      fileId = result.result.video.file_id;
      messageId = result.result.message_id;
      const getFileRes = await fetch(`${TG_API}/getFile?file_id=${fileId}`);
      const getFileResult = await getFileRes.json();
      const filePath = getFileResult.result.file_path;
      mediaUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    } else {
      fileId = result.result.photo[result.result.photo.length - 1].file_id;
      messageId = result.result.message_id;
      const getFileRes = await fetch(`${TG_API}/getFile?file_id=${fileId}`);
      const getFileResult = await getFileRes.json();
      const filePath = getFileResult.result.file_path;
      mediaUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    }
    
    await saveMedia(decoded.userId, decoded.username, fileId, messageId, mediaUrl, file.name, description, visibility, type, targetChatId);
    
    return Response.json({ success: true, mediaUrl, messageId });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
