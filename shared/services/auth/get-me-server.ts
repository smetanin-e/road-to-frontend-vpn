'use server';
import { User } from '@prisma/client';
import { cookies } from 'next/headers';
import { axiosInstance } from '../instance';

export async function getMeServer(): Promise<User | null> {
  try {
    const cookieStore = cookies();

    const res = await axiosInstance.get(`${process.env.API_URL_SERVER}/api/auth/me`, {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.data) {
      throw new Error('Ошибка при получении пользователя (server)');
    }
    return res.data;
  } catch {
    return null;
  }
}
