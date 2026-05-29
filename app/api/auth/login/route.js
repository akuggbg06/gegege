import { getUserByUsername } from '../../../../lib/telegram-db'
import { verifyPassword, createToken } from '../../../../lib/auth'

export async function POST(req) {
  const { username, password } = await req.json();
  
  if (!username || !password) {
    return Response.json({ error: 'Isi semua, kontol!' }, { status: 400 });
  }
  
  const user = await getUserByUsername(username);
  
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ error: 'Username/password salah, babi!' }, { status: 401 });
  }
  
  const token = createToken(username, username);
  
  const response = Response.json({ success: true, user: { username: user.username, email: user.email } });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  });
  
  return response;
}
