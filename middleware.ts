import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  console.log('🔥 Middleware is running! Pathname:', req.nextUrl.pathname);
  // Текущий URL
  const url = req.nextUrl.clone();
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const token = req.cookies.get('access_token')?.value;

  if (!token) {
    //нет токена - редирект на логин
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const { payload } = await jwtVerify(token, secret);
  if (!payload.role) {
    // Токен невалиден
    console.error('JWT verify failed');
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  //Проверяем что это admin страница
  if (url.pathname.startsWith('/admin')) {
    if (payload.role !== UserRole.ADMIN) {
      // Не админ — редиректим на dashboard
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    // Всё ок — пропускаем
    return NextResponse.next();
  }

  // Для остальных страниц — ничего не делаем
  return NextResponse.next();
}

// Ограничиваем области применения middleware
export const config = {
  matcher: ['/admin/:path*'], // только для /admin
};
