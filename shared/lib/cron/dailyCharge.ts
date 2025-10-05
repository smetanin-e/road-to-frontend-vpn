import axios from 'axios';
import { prisma } from '../prisma-client';
import { checkPeerActivity } from '../check-peer-activity';
import { WireguardServerPeer } from '@/shared/@types/wg-rest-api';
import { OrderStatus, TransactionType } from '@prisma/client';

const WG_API_URL = process.env.WG_API_URL;
export async function dailyCharge() {
  try {
    console.log('🚀 dailyCharge started...');

    // Получаем всех активных пользователей с подпиской
    const users = await prisma.user.findMany({
      where: { status: true, subscriptionId: { not: null } },
      include: {
        subscription: true,
        peers: true,
      },
    });

    // Получаем все пиры с WG сервера
    const wgPeers = (await axios.get(`${WG_API_URL}/api/clients`)) as WireguardServerPeer[];

    // Текущая дата
    const now = new Date();

    for (const user of users) {
      const dailyPrice = user.subscription?.dailyPrice ?? 0;
      if ((dailyPrice as number) <= 0) continue;

      // Считаем количество активных пиров
      const activePeersCount = user.peers.filter((peer) =>
        checkPeerActivity(wgPeers, peer, now),
      ).length;

      if (activePeersCount === 0) continue;

      const chargeAmount = (dailyPrice as number) * activePeersCount;

      // Проверяем баланс
      if (user.balance < chargeAmount) {
        console.warn(
          `⚠️ Недостаточно средств у пользователя ${user.login}: баланс ${user.balance}, нужно ${chargeAmount}`,
        );
        continue;
      }

      // Списываем с баланса
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: chargeAmount } },
      });

      // Создаём запись в Transaction
      await prisma.transaction.create({
        data: {
          userId: user.id,
          amount: -chargeAmount,
          type: TransactionType.CHARGE,
          status: OrderStatus.SUCCEEDED,
          description: `Ежедневное списание за ${activePeersCount} активных конфигураций`,
        },
      });

      console.log(`✅ ${user.login}: списано ${chargeAmount} (${activePeersCount} активных пиров)`);
    }

    console.log('✅ dailyCharge finished successfully');
  } catch (error) {
    console.error('❌ dailyCharge error:', error);
  }
}
