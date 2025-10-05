import { prisma } from '@/shared/lib/prisma-client';
import { updateUserDetails } from '@/shared/lib/update-user-details';
import { CreateVPN } from '@/shared/services/dto/vpn.dto';
import { WgPeerStatus } from '@prisma/client';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

const WG_API_URL = process.env.WG_API_URL;
const WG_API_TOKEN = process.env.WG_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { name, userId } = (await req.json()) as CreateVPN;

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

    // лимит активных пиров из подписки
    const maxPeers = user.subscription.maxPeers;
    const peersCount = user.peers.length;
    if (peersCount >= maxPeers)
      return NextResponse.json(
        {
          error:
            'Достигнут лимит конфигураций, обратитесь к администратору для изменения условий подписки',
        },
        { status: 403 },
      );

    // Создаём пира через wg-rest-api
    const createRes = await axios.post(
      `${WG_API_URL}/api/clients`,
      { name },
      { headers: { Authorization: `Bearer ${WG_API_TOKEN}` } },
    );

    const peerData = createRes.data;

    // Получаем конфиг напрямую из wg-rest-api
    const configRes = await axios.get(`${WG_API_URL}/api/clients/${peerData.id}?format=conf`, {
      headers: { Authorization: `Bearer ${WG_API_TOKEN}` },
      responseType: 'text',
    });

    const config: string = configRes.data;

    // Парсим ключи и адрес из конфига
    const privateKey = config.match(/PrivateKey\s*=\s*(.+)/)?.[1] ?? '';
    const publicKey = config.match(/PublicKey\s*=\s*(.+)/)?.[1] ?? '';
    const address = config.match(/Address\s*=\s*(.+)/)?.[1] ?? '';

    if (!privateKey || !publicKey || !address) {
      console.error('Config parse error:', config);
      return NextResponse.json({ error: 'Failed to parse WireGuard config' }, { status: 500 });
    }

    //Сохраняем в БД
    const peer = await prisma.wireguardPeer.create({
      data: {
        userId,
        peerName: name,
        publicKey,
        privateKey,
        address,
        id: peerData.id,
        status: WgPeerStatus.ACTIVE,
      },
    });

    await updateUserDetails(user.id);

    // Генерируем QR-код для конфигурации
    const qrCode = await QRCode.toDataURL(config);

    return NextResponse.json({ peer, config, qrCode });
  } catch (error) {
    console.error('[API_VPN_CREATE]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
