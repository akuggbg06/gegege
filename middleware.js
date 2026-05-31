import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // IZINKAN SEMUA API BOT (biar broadcast bisa diakses tanpa login)
  if (pathname.startsWith('/api/bot/')) {
    return NextResponse.next();
  }
  
  // Skip buat api lainnya, maintenance page, dan asset static
  if (pathname.startsWith('/api/') || 
      pathname === '/maintenance' ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }
  
  // Cek maintenance mode dari API
  let isMaintenance = false;
  try {
    const url = new URL('/api/bot/maintenance', request.url);
    const res = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      isMaintenance = data.active === true;
    }
  } catch (error) {
    console.error('Gagal cek maintenance:', error);
  }
  
  // Redirect ke halaman maintenance kalo mode aktif
  if (isMaintenance && pathname !== '/maintenance') {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  
  // ============ AUTH CHECK ============
  const publicPaths = ['/login', '/register', '/maintenance'];
  const isPublicPath = publicPaths.includes(pathname);
  
  const cookieHeader = request.headers.get('cookie') || '';
  const hasToken = cookieHeader.includes('token=');
  
  if (!isPublicPath && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isPublicPath && hasToken && pathname !== '/maintenance') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
