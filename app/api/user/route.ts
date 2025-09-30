import { prisma } from '@/shared/lib/prisma-client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        role: true,
        login: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        telegram: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('[API_USERS] Server error', error);
  }
}
