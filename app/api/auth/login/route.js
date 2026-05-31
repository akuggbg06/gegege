import { getUserByUsername } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return Response.json({ error: 'Isi semua, Bos!' }, { status: 400 });
    }
    
    const user = await getUserByUsername(username);
    
    if (!user) {
      return Response.json({ error: 'Username/password salah, Bos!' }, { status: 401 });
    }
    
    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return Response.json({ error: 'Username/password salah, Bos!' }, { status: 401 });
    }
    
    const token = createToken(user._id.toString(), username);
    
    // Buat response dengan cookie manual
    const response = new Response(
      JSON.stringify({ success: true, user: { username: user.username, email: user.email } }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Terjadi kesalahan, coba lagi nanti, Bos!' }, { status: 500 });
  }
}
