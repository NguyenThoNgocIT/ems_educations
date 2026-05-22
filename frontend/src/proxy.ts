// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route công khai (không cần đăng nhập)
const publicRoutes = ['/dashboard/admin/signin', '/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check xem có phải route admin không
  const isAdminRoute = pathname.startsWith('/dashboard/admin');
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  
  // Lấy token từ cookie
  const token = request.cookies.get('access_token')?.value;
  
  // Nếu là route admin, không phải public, và không có token -> redirect về login
  if (isAdminRoute && !isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/dashboard/admin/signin', request.url));
  }
  
  // Nếu có token và đang ở trang login -> redirect về dashboard
  if (token && pathname === '/dashboard/admin/signin') {
    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/admin/:path*',
};