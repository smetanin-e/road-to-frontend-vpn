import { prisma } from '@/shared/lib/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, dailyPrice, maxPeers, description } = await req.json();
    if (!userId || dailyPrice == null || maxPeers == null)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        dailyPrice,
        maxPeers,
        description,
        active: true,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('[API_ADMIN_SUBSCRIBE_CREATE]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
