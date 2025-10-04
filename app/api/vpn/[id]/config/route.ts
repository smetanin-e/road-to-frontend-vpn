import { prisma } from '@/shared/lib/prisma-client';
import { getUserFromAccessToken } from '@/shared/services/auth/token-service';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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

    // Получаем конфиг напрямую из wg-rest-api
    const configRes = await axios.get(`${WG_API_URL}/api/clients/${peerId}?format=conf`, {
      headers: { Authorization: `Bearer ${WG_API_TOKEN}` },
      responseType: 'text',
    });

    let config = configRes.data;

    // Исправляем DNS и PersistentKeepalive если не установлены
    if (!config.includes('DNS')) {
      config = config.replace('[Interface]', `[Interface]\nDNS = 1.1.1.1`);
    }
    if (!config.includes('PersistentKeepalive')) {
      config = config.replace('Endpoint =', 'PersistentKeepalive = 25\nEndpoint =');
    }

    return new NextResponse(config, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${peer.peerName}.conf"`,
      },
    });
  } catch (error) {
    console.error('[API_VPN_CONFIG]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
