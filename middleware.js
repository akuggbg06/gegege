import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Cek maintenance mode via cookie/header
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  
  if (isMaintenance && !publicPaths.includes(pathname) && !pathname.startsWith('/api/admin')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  
  // Auth check
  const token = request.cookies.get('token')?.value;
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith('/api/auth'));
  
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token && !isPublicPath) {
    const decoded = verifyToken(token);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
