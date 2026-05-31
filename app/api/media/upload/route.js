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

    if (!file) {
      return Response.json({ error: 'Upload file dulu, Bos!' }, { status: 400 });
    }
    
    // 1. Upload foto ke grup Telegram
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([buffer], { type: file.type });
    
    const uploadForm = new FormData();
    uploadForm.append('chat_id', STORAGE_GROUP_ID);
    uploadForm.append('photo', blob, file.name);
    
    const sendPhotoRes = await fetch(`${TG_API}/sendPhoto`, {
      method: 'POST',
      body: uploadForm
    });
    
    const sendPhotoResult = await sendPhotoRes.json();
    
    if (!sendPhotoResult.ok) {
      console.error('Telegram API error:', sendPhotoResult);
      return Response.json({ error: 'Gagal upload ke Telegram, Bos!' }, { status: 500 });
    }
    
    // 2. Dapatkan file_id dari foto yang baru diupload
    const fileId = sendPhotoResult.result.photo[sendPhotoResult.result.photo.length - 1].file_id;
    
    // 3. Minta path download file yang benar dari Telegram
    const getFileRes = await fetch(`${TG_API}/getFile?file_id=${fileId}`);
    const getFileResult = await getFileRes.json();
    
    if (!getFileResult.ok) {
      console.error('Gagal mendapat file path:', getFileResult);
      return Response.json({ error: 'Gagal memproses file, coba lagi.' }, { status: 500 });
    }
    
    // 4. Buat URL download yang benar
    const filePath = getFileResult.result.file_path;
    const correctImageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    
    // 5. Simpan URL yang benar ke database
    const images = await getCollection('images');
    await images.insertOne({
      username: decoded.username,
      user_id: decoded.userId,
      image_url: correctImageUrl,
      media_url: correctImageUrl,
      file_id: fileId,
      telegram_message_id: sendPhotoResult.result.message_id,
      description: description,
      visibility: visibility,
      type: 'image',
      uploaded_at: new Date(),
      is_deleted: false
    });
    
    return Response.json({ success: true, imageUrl: correctImageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
