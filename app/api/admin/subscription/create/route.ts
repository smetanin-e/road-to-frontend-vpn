import { prisma } from '@/shared/lib/prisma-client';
import { SubscriptionFormType } from '@/shared/schemas/subcription-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as SubscriptionFormType;

    if (!data) {
      return NextResponse.json({ error: 'Невалидные данные' }, { status: 400 });
    }

    const subscription = await prisma.subscription.create({
      data: {
        name: data.name,
        dailyPrice: data.dailyPrice,
        maxPeers: Number(data.maxPeers),
        description: data.description,
        active: true,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('[API_ADMIN_SUBSCRIBE_CREATE]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
