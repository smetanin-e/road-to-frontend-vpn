import { prisma } from '@/shared/lib/prisma-client';
import { getUserFromAccessToken } from '@/shared/services/auth/token-service';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

const WG_API_URL = process.env.WG_API_URL;
const WG_API_TOKEN = process.env.WG_API_TOKEN;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const token = req.cookies.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'токен пользователя отсутствует' }, { status: 401 });
    }

    const user = await getUserFromAccessToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Нет пользователя' }, { status: 401 });
    }

    const peerId = Number(id);

    const peer = await prisma.wireguardPeer.findFirst({
      where: { id: peerId, userId: user.id },
    });

    if (!peer) return NextResponse.json({ error: 'Peer not found' }, { status: 404 });

    // Получаем конфиг из wg-rest-api
    const configRes = await axios.get(`${WG_API_URL}/api/clients/${peerId}?format=conf`, {
      headers: { Authorization: `Bearer ${WG_API_TOKEN}` },
      responseType: 'text',
    });

    let config = configRes.data;

    if (!config.includes('DNS')) {
      config = config.replace('[Interface]', `[Interface]\nDNS = 1.1.1.1`);
    }
    if (!config.includes('PersistentKeepalive')) {
      config = config.replace('Endpoint =', 'PersistentKeepalive = 25\nEndpoint =');
    }

    // Генерируем QR в base64 (PNG)
    const qr = await QRCode.toDataURL(config, { errorCorrectionLevel: 'L' });

    // Возвращаем как изображение
    const base64 = qr.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="${peer.peerName}.png"`,
      },
    });
  } catch (error) {
    console.error('[API_VPN_CONFIG_QR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
