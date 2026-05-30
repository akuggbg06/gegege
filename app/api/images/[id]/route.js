import { getSessionFromRequest } from '@/lib/auth'
import { deleteImageFromDB } from '@/lib/db'

export async function DELETE(req, { params }) {
  const session = getSessionFromRequest(req);
  
  if (!session) {
    return Response.json({ error: 'Login dulu, kontol!' }, { status: 401 });
  }
  
  const imageId = params.id;
  const deleted = await deleteImageFromDB(session.username, imageId);
  
  if (!deleted) {
    return Response.json({ error: 'Foto gak ditemukan, babi!' }, { status: 404 });
  }
  
  return Response.json({ success: true });
}
