import axios from 'axios';
import { PaymentFormType } from '../schemas/payment-schema';
import { axiosInstance } from './instance';

type TransactionResponse = string;

export async function createTransaction(value: PaymentFormType) {
  try {
    const { data } = await axiosInstance.post<TransactionResponse>('/transaction', value);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Ошибка поплнения');
    }
    throw error;
  }
}
