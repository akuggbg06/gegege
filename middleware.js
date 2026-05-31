import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // IZINKAN SEMUA API (biar broadcast, maintenance, dll bisa jalan)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // IZINKAN asset static
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }
  
  // IZINKAN halaman maintenance itu sendiri
  if (pathname === '/maintenance') {
    return NextResponse.next();
  }
  
  // ============ CEK MAINTENANCE MODE ============
  let isMaintenance = false;
  try {
    // Panggil API maintenance
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
  
  // KALO MAINTENANCE AKTIF, REDIRECT KE HALAMAN MAINTENANCE
  if (isMaintenance && pathname !== '/maintenance') {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  
  // ============ AUTH CHECK (ONLINE SEMUA) ============
  // Biarin semua halaman bisa diakses dulu kalo maintenance OFF
  // Nanti dashboard yang handle redirect ke login kalo gak ada token
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
