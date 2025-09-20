import { LoginFormType } from '@/shared/schemas/login-schema';
import axios from 'axios';
import { axiosInstance } from '../instance';
import { getMe } from './get-me';
import { useUserStore } from '@/shared/store/user';

export async function signIn(data: LoginFormType) {
  try {
    const res = await axiosInstance.post<LoginFormType>('/auth/login', data, {
      headers: { 'Content-Type': 'application/json' },
    });

    const user = await getMe();
    useUserStore.getState().setUser(user);

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Ошибка входа');
    }
    throw error;
  }
}
