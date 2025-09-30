import { prisma } from '@/shared/lib/prisma-client';
import { WgPeerStatus } from '@prisma/client';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const WG_API_URL = process.env.WG_API_URL;
const WG_API_PASSWORD = process.env.WG_API_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    const { userId, peerId } = await req.json();
    if (!userId || !peerId)
      NextResponse.json({ error: 'userId and peerId required' }, { status: 400 });

    const peer = await prisma.wireguardPeer.findFirst({
      where: { id: peerId },
    });
    if (!peer || peer.userId !== userId)
      return NextResponse.json({ error: 'Peer not found or unauthorized' }, { status: 404 });

    await prisma.wireguardPeer.update({
      where: { id: peerId },
      data: {
        status: WgPeerStatus.INACTIVE,
      },
    });

    await axios
      .patch(
        `${WG_API_URL}/api/v1/peers/${peerId}`,
        { disabled: true },
        {
          headers: {
            Authorization: `Bearer ${WG_API_PASSWORD}`,
          },
        },
      )
      .catch(() => {});

    return NextResponse.json({ message: 'Peer deactivated' });
  } catch (error) {
    console.error('[API_VPN_DEACTIVATE]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
