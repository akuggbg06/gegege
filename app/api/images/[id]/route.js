import { getSessionFromRequest } from '@/lib/auth';
import { deleteImageFromDB } from '@/lib/db';

export async function DELETE(req, { params }) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return Response.json({ error: 'Login dulu, bos!' }, { status: 401 });
  }
  const { id } = params;
  const deleted = await deleteImageFromDB(session.username, id);
  if (!deleted) {
    return Response.json({ error: 'Foto gak ditemukan, bos!' }, { status: 404 });
  }
  return Response.json({ success: true });
}
