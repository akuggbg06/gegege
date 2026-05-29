import { getSessionFromRequest } from '../../../../lib/auth'
import { saveImage } from '../../../../lib/telegram-db'
import { CONSTANTS } from '../../../../lib/constants'

const TG_API = `https://api.telegram.org/bot${CONSTANTS.BOT_TOKEN}`;

export async function POST(req) {
  const session = getSessionFromRequest(req);
  
  if (!session) {
    return Response.json({ error: 'Login dulu, kontol!' }, { status: 401 });
  }
  
  const formData = await req.formData();
  const file = formData.get('file');
  
  if (!file) {
    return Response.json({ error: 'Upload file dulu, babi!' }, { status: 400 });
  }
  
  // Upload ke grup Telegram storage
  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = new Blob([buffer], { type: file.type });
  
  const uploadForm = new FormData();
  uploadForm.append('chat_id', CONSTANTS.STORAGE_GROUP_ID);
  uploadForm.append('photo', blob, file.name);
  
  const response = await fetch(`${TG_API}/sendPhoto`, {
    method: 'POST',
    body: uploadForm
  });
  
  const result = await response.json();
  
  if (!result.ok) {
    return Response.json({ error: 'Gagal upload ke Telegram, kontol!' }, { status: 500 });
  }
  
  const messageId = result.result.message_id;
  const fileId = result.result.photo[result.result.photo.length - 1].file_id;
  const imageUrl = `https://api.telegram.org/file/bot${CONSTANTS.BOT_TOKEN}/${fileId}`;
  
  // Simpan referensi ke database (grup DB)
  await saveImage(session.username, session.username, fileId, messageId, imageUrl, file.name);
  
  return Response.json({ success: true, imageUrl, messageId });
}
