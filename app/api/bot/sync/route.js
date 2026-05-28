import { getSessionFromRequest } from '@/lib/auth';
import { getUserImages, deleteImageFromDB } from '@/lib/telegram-db';
import { CONSTANTS } from '@/lib/constants';

export async function POST(req) {
  const session = getSessionFromRequest(req);
  
  if (!session || session.username !== CONSTANTS.OWNER_ID.toString()) {
    return Response.json({ error: 'Bukan owner, kontol!' }, { status: 403 });
  }
  
  const { userId, imageId } = await req.json();
  
  if (imageId) {
    await deleteImageFromDB(userId, imageId);
  }
  
  return Response.json({ success: true });
}
