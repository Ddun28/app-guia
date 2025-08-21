import { NextResponse } from "next/server";

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/verify',
  '/auth/forgot',
  '/auth/reset-password',
  '/auth/lock',
  '/auth/create-password',
];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('access_token')?.value;

  // 1. Si es ruta pública, permitir acceso
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Para rutas protegidas:
  if (!token) {
    // Redirigir a login si no hay token
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.).*)',
  ],
};