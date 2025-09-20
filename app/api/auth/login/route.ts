import { setAccessTokenCookie } from '@/shared/lib/auth/set-access-token-cookie';
import { setRefreshTokenCookie } from '@/shared/lib/auth/set-refresh-token-cookie';
import { loginSchema } from '@/shared/schemas/login-schema';
import { loginUser } from '@/shared/services/auth/auth-service';
import { generateAccessToken } from '@/shared/services/auth/token-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Невалидные данные' }, { status: 400 });
    }

    const { login, password } = parsed.data;
    const { user, refreshToken } = await loginUser(login, password);

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshTokenMaxAge = 60 * 60 * 24 * 7;
    const accessTokenMaxAge = 60 * 15; // 15 минут

    const response = NextResponse.json({ accessToken });
    setRefreshTokenCookie(response, refreshToken, refreshTokenMaxAge);
    setAccessTokenCookie(response, accessToken, accessTokenMaxAge);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Не удалось войти в аккаунт', error);
    NextResponse.json({ error: 'Ошибка входа в аккаунт' }, { status: 401 });
  }
}
