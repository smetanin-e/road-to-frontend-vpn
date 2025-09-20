import { generateAccessToken } from '@/shared/services/auth/token-service';
import { validateRefreshToken } from '@/shared/services/auth/validate-refresh-token';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('refresh_token')?.value;
    console.log('API_REFRESH_TOKEN', token);
    if (!token) {
      return NextResponse.json({ error: 'refresh токен отсутствует' }, { status: 401 });
    }

    const user = await validateRefreshToken(token);

    console.log('API_REFRESH_USERR', user);
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json({ success: true, accessToken, user });

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',

      sameSite: 'strict',
      maxAge: 60 * 15, // 15 минут
      path: '/',
    });
    return response;
  } catch (error) {
    //console.error('Ошибка при обновлении access token:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}
