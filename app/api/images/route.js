import { getSessionFromRequest } from '@/lib/auth';
import { getUserImages } from '@/lib/db';

export async function GET(req) {
  const session = getSessionFromRequest(req);
  
  if (!session) {
    return Response.json({ error: 'Login dulu, bos!' }, { status: 401 });
  }
  
  const images = await getUserImages(session.username);
  return Response.json(images);
}
