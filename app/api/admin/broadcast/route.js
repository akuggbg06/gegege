import { getSessionFromRequest } from '@/lib/auth'
import { getActiveBroadcast, saveBroadcast } from '@/lib/db'

const OWNER_ID = parseInt(process.env.OWNER_ID || '0');

export async function GET() {
  const broadcast = await getActiveBroadcast();
  return Response.json(broadcast || { active: false, message: null });
}

export async function POST(req) {
  const session = getSessionFromRequest(req);
  
  if (!session || session.username !== OWNER_ID.toString()) {
    return Response.json({ error: 'Bukan owner, bos!' }, { status: 403 });
  }
  
  const { message } = await req.json();
  if (!message) {
    return Response.json({ error: 'Pesan kosong, bos!' }, { status: 400 });
  }
  
  await saveBroadcast(message);
  return Response.json({ success: true });
}
