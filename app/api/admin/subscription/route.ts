import { prisma } from '@/shared/lib/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
  const subscriptions = await prisma.subscription.findMany();
  return NextResponse.json(subscriptions);
}
