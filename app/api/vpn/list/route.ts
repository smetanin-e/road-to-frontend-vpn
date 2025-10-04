import { prisma } from '@/shared/lib/prisma-client';
import { getUserFromAccessToken } from '@/shared/services/auth/token-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'токен пользователя отсутствует' }, { status: 401 });
    }
    const user = await getUserFromAccessToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Нет пользователя' }, { status: 401 });
    }

    const list = await prisma.wireguardPeer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error('[API_VPN_LIST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
