import { getSessionFromRequest } from '@/lib/auth';
import { getActiveBroadcast, saveBroadcast } from '@/lib/telegram-db';
import { CONSTANTS } from '@/lib/constants';

export async function GET() {
  const broadcast = await getActiveBroadcast();
  return Response.json(broadcast || { active: false, message: null });
}

export async function POST(req) {
  const session = getSessionFromRequest(req);
  
  if (!session || session.username !== CONSTANTS.OWNER_ID.toString()) {
    return Response.json({ error: 'Bukan owner, kontol!' }, { status: 403 });
  }
  
  const { message } = await req.json();
  if (!message) {
    return Response.json({ error: 'Pesan kosong, babi!' }, { status: 400 });
  }
  
  await saveBroadcast(message);
  return Response.json({ success: true });
}
