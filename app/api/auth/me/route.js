import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/db';

export async function GET(req) {
  try {
    // Ambil token dari cookie
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [key, ...value] = cookie.split('=');
        return [key, value.join('=')];
      })
    );
    
    const token = cookies.token;
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await getUserById(decoded.userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    return Response.json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Me error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
