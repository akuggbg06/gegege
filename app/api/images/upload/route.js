import { getSessionFromRequest } from '@/lib/auth';
import { saveImage } from '@/lib/db';

const BOT_TOKEN = process.env.BOT_TOKEN;
const STORAGE_GROUP_ID = process.env.STORAGE_GROUP_ID;
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function POST(req) {
  const session = getSessionFromRequest(req);
  
  if (!session) {
    return Response.json({ error: 'Login dulu, bos!' }, { status: 401 });
  }
  
  const formData = await req.formData();
  const file = formData.get('file');
  
  if (!file) {
    return Response.json({ error: 'Upload file dulu, bos!' }, { status: 400 });
  }
  
  // Upload ke grup Telegram storage
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
    return Response.json({ error: 'Gagal upload ke Telegram, bos!' }, { status: 500 });
  }
  
  const messageId = result.result.message_id;
  const fileId = result.result.photo[result.result.photo.length - 1].file_id;
  const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileId}`;
  
  // Simpan ke MongoDB (bukan ke grup DB lagi)
  await saveImage(session.username, session.username, fileId, messageId, imageUrl, file.name);
  
  return Response.json({ success: true, imageUrl, messageId });
}
