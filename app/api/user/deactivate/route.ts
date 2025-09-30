import { prisma } from '@/shared/lib/prisma-client';
import { WgPeerStatus } from '@prisma/client';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const WG_API_URL = process.env.WG_API_URL;
const WG_API_PASSWORD = process.env.WG_API_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: false,
      },
    });

    const peers = await prisma.wireguardPeer.findMany({ where: { userId } });
    await prisma.wireguardPeer.updateMany({
      where: { userId },
      data: { status: WgPeerStatus.INACTIVE },
    });

    // Блокируем всех пиров на wg-rest-api
    for (const peer of peers) {
      await axios
        .patch(
          `${WG_API_URL}/api/v1/peers/${peer.id}`,
          { disabled: true },
          { headers: { Authorization: `Bearer ${WG_API_PASSWORD}` } },
        )
        .catch(() => {});
    }

    return NextResponse.json({ message: 'User deactivated and peers deactivated' });
  } catch (error) {
    console.error('[API_USER_DEACTIVATE]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
