import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public paths - bebas diakses tanpa login
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Ambil cookie dari header
  const cookieHeader = request.headers.get('cookie') || '';
  const hasToken = cookieHeader.includes('token=');
  
  // Redirect ke login kalo belum login dan bukan public path
  if (!isPublicPath && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect ke dashboard kalo udah login dan buka login/register
  if (isPublicPath && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
