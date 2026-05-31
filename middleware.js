import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip buat api, maintenance page, dan asset static
  if (pathname.startsWith('/api/') || 
      pathname === '/maintenance' ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }
  
  // Cek maintenance mode dari API
  let isMaintenance = false;
  try {
    // Panggil API maintenance dari internal (pake fetch ke origin)
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
    // Jika error, lanjutkan akses (biar gak error total)
  }
  
  // Redirect ke halaman maintenance kalo mode aktif dan bukan maintenance page
  if (isMaintenance && pathname !== '/maintenance') {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  
  // ============ AUTH CHECK (PROTEKSI HALAMAN) ============
  const publicPaths = ['/login', '/register', '/maintenance'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Ambil token dari cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const hasToken = cookieHeader.includes('token=');
  
  // Redirect ke login kalo belum login dan bukan public path
  if (!isPublicPath && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect ke dashboard kalo udah login dan buka login/register
  if (isPublicPath && hasToken && pathname !== '/maintenance') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Konfigurasi matcher - middleware hanya jalan di path tertentu
export const config = {
  matcher: [
    // Middleware jalan di semua path kecuali:
    // - _next/static (file statis)
    // - _next/image (optimasi gambar)
    // - favicon.ico
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
