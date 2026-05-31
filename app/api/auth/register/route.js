import { saveUser, getUserByUsername, getUserByEmail } from '@/lib/db';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    
    if (!username || !email || !password) {
      return Response.json({ error: 'Semua field wajib diisi, Bos!' }, { status: 400 });
    }
    
    if (password.length < 4) {
      return Response.json({ error: 'Password minimal 4 karakter, Bos!' }, { status: 400 });
    }
    
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return Response.json({ error: 'Username udah dipake, Bos!' }, { status: 409 });
    }
    
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return Response.json({ error: 'Email udah terdaftar, Bos!' }, { status: 409 });
    }
    
    const passwordHash = hashPassword(password);
    const userId = await saveUser(username, email, passwordHash);
    
    const token = createToken(userId.toString(), username);
    
    // 🔧 KIRIM TOKEN LEWAT JSON (BUKAN COOKIE)
    return Response.json({ 
      success: true, 
      token: token,
      user: { username, email } 
    });
  } catch (error) {
    console.error('Register error:', error);
    return Response.json({ error: 'Terjadi kesalahan, coba lagi nanti, Bos!' }, { status: 500 });
  }
}
