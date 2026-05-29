import { saveUser, getUserByUsername, getUserByEmail } from '../../../../lib/telegram-db'
import { hashPassword, createToken } from '../../../../lib/auth'

export async function POST(req) {
  const { username, email, password } = await req.json();
  
  if (!username || !email || !password) {
    return Response.json({ error: 'Semua field wajib diisi, kontol!' }, { status: 400 });
  }
  
  if (password.length < 4) {
    return Response.json({ error: 'Password minimal 4 karakter, babi!' }, { status: 400 });
  }
  
  // Cek username exist
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return Response.json({ error: 'Username udah dipake, goblok!' }, { status: 409 });
  }
  
  // Cek email exist
  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    return Response.json({ error: 'Email udah terdaftar, kontol!' }, { status: 409 });
  }
  
  const passwordHash = hashPassword(password);
  await saveUser(username, email, passwordHash);
  
  const token = createToken(username, username);
  
  const response = Response.json({ success: true, user: { username, email } });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  });
  
  return response;
}
