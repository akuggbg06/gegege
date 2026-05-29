import { getSessionFromRequest } from '../../../../lib/auth'
import { getUserByUsername } from '../../../../lib/telegram-db'
export async function GET(req) {
  const session = getSessionFromRequest(req);
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await getUserByUsername(session.username);
  
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }
  
  return Response.json({ user: { username: user.username, email: user.email } });
}
