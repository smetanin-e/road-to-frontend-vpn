import { createPayment } from '@/shared/lib/create-payment';
import { prisma } from '@/shared/lib/prisma-client';
import { PaymentFormType } from '@/shared/schemas/payment-schema';
import { getUserFromAccessToken } from '@/shared/services/auth/token-service';
import { TransactionType } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as PaymentFormType;
    if (!data) {
      return NextResponse.json({ message: 'Невалидные данные' }, { status: 500 });
    }
    const amount = Number(data.amount);

    const cookieStore = cookies();
    const token = (await cookieStore).get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Токен не найден' }, { status: 500 }); //разобраться со статусами
    }

    //Получаем пользователя по токену
    const user = await getUserFromAccessToken(token);
    console.log('USER_TRANSACTION_API', user);
    if (!user) {
      return NextResponse.json({ message: 'Не удалось найти пользователя' }, { status: 500 }); //разобраться со статусами
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        type: TransactionType.TOP_UP,
        description: `Пополнение баланса на ${amount} ₽ от ${new Date()}`,
      },
    });

    //создаем оплату
    const paymentData = await createPayment({
      amount,
      transactionId: transaction.id,
      description: 'VPN-SMET: Пополнение баланса пользователя' + user.login,
    });

    if (!paymentData) {
      throw new Error('Payment data not found');
    }

    //ссылка которая перенаправит нас на платеж
    const paymentUrl = paymentData.confirmation.confirmation_url;

    //сохраняем ссылку в БД
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentUrl,
      },
    });

    return NextResponse.json(paymentUrl);
  } catch (error) {
    console.error('[API_TRANSACTION] Server error', error);
  }
}
