import axios from 'axios';
import { axiosInstance } from './instance';
import { Subscription } from '@prisma/client';
import { SubscriptionFormType } from '../schemas/subcription-schema';
import { useSubscriptionStore } from '../store/subscription';

export async function getSubscribtions() {
  try {
    const { data } = await axiosInstance.get<Subscription[]>('/admin/subscription');

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Ошибка поплнения');
    }
    throw error;
  }
}

export async function createSubscribtion(value: SubscriptionFormType) {
  const { data } = await axiosInstance.post<SubscriptionFormType>(
    '/admin/subscription/create',
    value,
  );
  useSubscriptionStore.getState().getSubscriptions();
  return data;
}
