import { prisma } from '@/shared/lib/prisma-client';
import { WgPeerStatus } from '@prisma/client';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

const WG_API_URL = process.env.WG_API_URL;
const WG_API_PASSWORD = process.env.WG_API_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    const { name, userId } = await req.json();

    if (!name || !userId) {
      return NextResponse.json({ error: 'Name and userId are required' }, { status: 400 });
    }

    // Получаем пользователя и его баланс/подписку
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { subscription: true, peers: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.status) return NextResponse.json({ error: 'User is deactivated' }, { status: 403 });

    if (!user.subscription?.active)
      return NextResponse.json({ error: 'No active subscription' }, { status: 403 });

    // лимит активных пиров = 5
    const activePeersCount = user.peers.filter((p) => p.status === WgPeerStatus.ACTIVE).length;
    if (activePeersCount >= 5)
      return NextResponse.json({ error: 'Max number of active peers reached' }, { status: 403 });

    // Создаём пира через wg-rest-api
    const createRes = await axios.post(
      `${WG_API_URL}/api/v1/peers`,
      { name },
      { headers: { Authorization: `Bearer ${WG_API_PASSWORD}` } },
    );

    const peerData = createRes.data;

    //Получаем конфиг
    const configRes = await axios.get(`${WG_API_URL}/api/v1/peers/${peerData.id}/config`, {
      headers: { Authorization: `Bearer ${WG_API_PASSWORD}` },
      responseType: 'text',
    });
    const config = configRes.data;

    //Сохраняем в БД
    const peer = await prisma.wireguardPeer.create({
      data: {
        userId,
        peerName: name,
        publicKey: peerData.publicKey,
        privateKey: peerData.privateKey,
        address: peerData.address,
        status: WgPeerStatus.ACTIVE,
      },
    });

    // Генерируем QR-код для конфигурации
    const qrCode = await QRCode.toDataURL(config);

    return NextResponse.json({ peer, config, qrCode });
  } catch (error) {
    console.error('[API_VPN_CREATE]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
