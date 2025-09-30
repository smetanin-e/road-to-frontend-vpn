import { OrderStatus, TransactionType, WgPeerStatus } from '@prisma/client';
import { prisma } from '../prisma-client';
import axios from 'axios';

const WG_API_URL = process.env.WG_API_URL;
const WG_API_PASSWORD = process.env.WG_API_PASSWORD;

export async function dailyCharge() {
  const users = await prisma.user.findMany({
    where: { status: true },
    include: { peers: true, subscription: true },
  });

  for (const user of users) {
    if (!user.subscription?.active) continue;

    const activePeers = user.peers.filter((peer) => peer.status === WgPeerStatus.ACTIVE);
    if (activePeers.length === 0) continue;

    const totalCharge = Number(user.subscription.dailyPrice) * activePeers.length;

    if (user.balance >= totalCharge) {
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: totalCharge } },
      });

      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: TransactionType.CHARGE,
          amount: totalCharge,
          description: `Ежедневное списание для ${activePeers.length} активных конфигураций`,
          status: OrderStatus.SUCCEEDED,
        },
      });
    } else {
      // Деактивируем все пира и блокируем на VPN
      const peerIds = activePeers.map((p) => p.id);
      await prisma.wireguardPeer.updateMany({
        where: { id: { in: peerIds } },
        data: { status: WgPeerStatus.INACTIVE },
      });

      for (const peerId of peerIds) {
        await axios
          .patch(
            `${WG_API_URL}/api/v1/peers/${peerId}`,
            { disabled: true },
            { headers: { Authorization: `Bearer ${WG_API_PASSWORD}` } },
          )
          .catch(() => {});
      }

      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: TransactionType.CHARGE,
          amount: 0,
          description: `Конфигурации VPN деактивированы - недостаточно средств!`,
          status: OrderStatus.CANCELED,
        },
      });
    }
  }
}
