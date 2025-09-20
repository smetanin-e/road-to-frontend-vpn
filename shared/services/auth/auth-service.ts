'use server';

import { verifyPassword } from '@/shared/lib/auth/passwordHasher';
import { prisma } from '@/shared/lib/prisma-client';
import { generateRefreshToken } from './token-service';

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;

export async function loginUser(login: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { login },
  });

  if (!user) {
    throw new Error('Неверный логин или пароль'); //'Пользователь не найден'
  }
  const isValidPassword = await verifyPassword(password, user.password, user.salt!);

  if (!isValidPassword) {
    throw new Error('Неверный логин или пароль'); //'Неверный пароль'
  }

  //удаляем сессии
  await prisma.session.deleteMany({
    where: {
      userId: user.id,
    },
  });

  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 1000 * SESSION_EXPIRATION_SECONDS);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt,
    },
  });

  return { user, refreshToken };
}
