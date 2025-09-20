import { User } from '@prisma/client';
import { axiosInstance } from '@/shared/services';

export async function getMeClient(): Promise<User | null> {
  try {
    const res = await axiosInstance.get<User>('auth/me', {
      withCredentials: true,
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.data) {
      throw new Error('Ошибка при получении пользователя (client)');
    }

    return res.data;
  } catch {
    return null;
  }
}
