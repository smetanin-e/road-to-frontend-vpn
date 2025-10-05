import { prisma } from '@/shared/lib/prisma-client';
import { updateUserDetails } from '@/shared/lib/update-user-details';
import { getUserFromAccessToken } from '@/shared/services/auth/token-service';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const WG_API_URL = process.env.WG_API_URL;
const WG_API_TOKEN = process.env.WG_API_TOKEN;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(req.json());
    const token = req.cookies.get('access_token')?.value;

    if (!token) return NextResponse.json({ error: 'Нет токена' }, { status: 401 });

    const user = await getUserFromAccessToken(token);

    if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });

    const peerId = Number(params.id);

    const peer = await prisma.wireguardPeer.findFirst({
      where: { id: peerId, userId: user.id },
    });

    if (!peer) return NextResponse.json({ error: 'Peer не найден' }, { status: 404 });

    // Удаляем на сервере WireGuard через wg-rest-api
    await axios.delete(
      `${WG_API_URL}/api/clients/${peerId}`,

      { headers: { Authorization: `Bearer ${WG_API_TOKEN}` } },
    );

    // Удаляем из базы данных
    const updatedPeer = await prisma.wireguardPeer.delete({
      where: { id: peerId },
    });

    await updateUserDetails(user.id);

    return NextResponse.json({ peer: updatedPeer });
  } catch (error) {
    console.error('[API_VPN_DELETE]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
