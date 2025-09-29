import { prisma } from '@/shared/lib/prisma-client';

export async function validateRefreshToken(token: string) {
  const session = await prisma.session.findFirst({
    where: { refreshToken: token },
    select: {
      id: true,
      refreshToken: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          login: true,
          role: true,
          firstName: true,
          lastName: true,
          balance: true,
        },
      },
    },
  });

  if (!session) {
    throw new Error('Недействительный refresh токен');
  }

  if (session.expiresAt.getTime() < Date.now()) {
    //удаляем просроченный токен
    await prisma.session.delete({ where: { refreshToken: token } });
    throw new Error('refresh токен истек');
  }

  return session.user;
}
