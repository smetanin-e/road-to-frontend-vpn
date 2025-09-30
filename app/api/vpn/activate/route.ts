import { prisma } from '@/shared/lib/prisma-client';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const WG_API_URL = process.env.WG_API_URL;
const WG_API_PASSWORD = process.env.WG_API_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    const { userId, peerId } = await req.json();
    if (!userId || !peerId)
      return NextResponse.json({ error: 'userId and peerId required' }, { status: 400 });

    // Получаем пользователя и его баланс/подписку
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user || !user.status)
      return NextResponse.json({ error: 'User is deactivated' }, { status: 403 });

    const peer = await prisma.wireguardPeer.findUnique({ where: { id: peerId } });
    if (!peer || peer.userId !== userId)
      return NextResponse.json({ error: 'Peer not found or unauthorized' }, { status: 404 });

    // Активация пира
    await prisma.wireguardPeer.update({ where: { id: peerId }, data: { status: 'ACTIVE' } });

    // Разблокируем на WG
    await axios
      .patch(
        `${WG_API_URL}/api/v1/peers/${peerId}`,
        { disabled: false },
        { headers: { Authorization: `Bearer ${WG_API_PASSWORD}` } },
      )
      .catch(() => {});

    return NextResponse.json({ message: 'Peer activated' });
  } catch (error) {
    console.error('[API_VPN_ACTIVATE]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
