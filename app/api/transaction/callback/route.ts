import { PaymentCallbackData } from '@/shared/@types/youkassa';
import { prisma } from '@/shared/lib/prisma-client';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    //получаем запрос от Юкасса
    const body = (await req.json()) as PaymentCallbackData;
    console.log('ПРИШЕЛ ОТВЕТ ОТ ЮКАССА', body);

    //Ищем транзакцию по transactionId, который пришел с ответом Юкассы
    const transaction = await prisma.transaction.findFirst({
      where: { id: Number(body.object.metadata.transactionId) },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' });
    }

    //Сохраняем ответ статуса транзакции
    const isSucceeded = body.object.status === 'succeeded';

    //обновляем статус транзакции
    await prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELED,
        paymentId: body.object.id,
      },
    });

    //Обновляем баланс пользователю
    if (isSucceeded) {
      const user = await prisma.user.findFirst({
        where: { id: transaction.userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' });
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          balance: { increment: transaction.amount },
        },
      });
      return NextResponse.json({ status: 'ok' });
    }
  } catch (error) {
    console.log('[API_TRANSACTION_CALLBACK] Server error', error);
    return NextResponse.json({ error: 'Server error' });
  }
}
