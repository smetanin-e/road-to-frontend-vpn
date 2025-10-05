import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { getUserFromAccessToken } from './shared/services/auth/token-service';

export async function middleware(req: NextRequest) {
  console.log('🔥 Middleware is running! Pathname:', req.nextUrl.pathname);
  // Текущий URL
  const url = req.nextUrl.clone();
  //const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    //нет токена - редирект на логин
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const user = await getUserFromAccessToken(token);

  if (!user) {
    //нет токена - редирект на логин
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/dashboard') && !user) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  //Проверяем что это admin страница
  if (url.pathname.startsWith('/admin')) {
    if (user.role !== UserRole.ADMIN) {
      // Не админ — редиректим на dashboard
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Для остальных страниц — ничего не делаем
  return NextResponse.next();
}

// Ограничиваем области применения middleware
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
  runtime: 'nodejs',
};
