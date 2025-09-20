import { prisma } from '@/shared/lib/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    if (refreshToken) {
      await prisma.session.deleteMany({
        where: {
          refreshToken,
        },
      });
    }

    const response = NextResponse.json({ message: 'Вы вышли из аккаунта' });

    response.cookies.set('access_token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('[API_LOGOUT_ERROR]', error);
    return NextResponse.json({ error: '[API_LOGOUT_ERROR]' }, { status: 500 });
  }
}
