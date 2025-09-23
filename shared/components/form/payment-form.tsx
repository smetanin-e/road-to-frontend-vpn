'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../ui';
import { FormInput } from './form-input';
import { PaymentFormType, paymentSchema } from '@/shared/schemas/payment-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransaction } from '@/shared/services/transaction';

interface Props {
  className?: string;
  setOpen: (open: boolean) => void;
}

export const PaymentForm: React.FC<Props> = ({ setOpen }) => {
  const form = useForm<PaymentFormType>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormType) => {
    try {
      console.log(data);
      const paymentUrl = await createTransaction(data);
      if (!paymentUrl) {
        throw new Error('Не удалось получить ссылку на оплату');
      }
      // сразу редиректим пользователя на оплату
      window.location.href = paymentUrl;
      setOpen(false);
      toast.success('Переход на оплату', { icon: '✅' });
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error [PAYMENT_FORM]', error);
        return toast.error(error.message, { icon: '❌' });
      }
    }
  };
  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <FormInput
            label='Сумма'
            name='amount'
            id='amount'
            type='text'
            placeholder='Введите сумму...'
            required
          />
        </div>

        <Button disabled={form.formState.isSubmitting} className='w-full' type='submit'>
          Оплатить
        </Button>
      </form>
    </FormProvider>
  );
};
