import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public paths - bebas diakses tanpa login
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);
  
  // Ambil token dari localStorage TIDAK BISA di middleware
  // Jadi middleware kita skip dulu, handle auth di frontend aja
  
  // Kalo bukan public path, biarkan akses dulu
  // Nanti dashboard yang handle cek token
  if (!isPublicPath) {
    // Jangan redirect dulu, biarkan akses
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
