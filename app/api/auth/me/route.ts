import { generateAccessToken } from '@/shared/services/auth/token-service';
import { validateRefreshToken } from '@/shared/services/auth/validate-refresh-token';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    //Получаем refresh токен из куки
    const token = req.cookies.get('refresh_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'refresh токен отсутствует' }, { status: 401 });
    }

    const user = await validateRefreshToken(token);

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json({ success: true, accessToken });
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15, //15m
      path: '/',
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не авторизован' }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}
