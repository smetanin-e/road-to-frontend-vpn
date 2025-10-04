import { axiosInstance } from '@/shared/services';
import { CurrentUser } from '../dto/users.dto';

export async function getMeClient(): Promise<CurrentUser | null> {
  try {
    const res = await axiosInstance.get<CurrentUser>('auth/me', {
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
