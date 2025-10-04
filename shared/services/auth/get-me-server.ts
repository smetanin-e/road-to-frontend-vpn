'use server';

import { cookies } from 'next/headers';
import { axiosInstance } from '../instance';
import { CurrentUser } from '../dto/users.dto';

export async function getMeServer(): Promise<CurrentUser | null> {
  try {
    const cookieStore = cookies();

    const res = await axiosInstance.get(`${process.env.API_URL_SERVER}/auth/me`, {
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
