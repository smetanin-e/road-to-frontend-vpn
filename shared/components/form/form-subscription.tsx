'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from './form-input';
import { Button } from '../ui';
import { FormTextarea } from './form-textarea';
import { SubscriptionFormType, subscriptionSchema } from '@/shared/schemas/subcription-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSubscribtion } from '@/shared/services/subscription';
import toast from 'react-hot-toast';

interface Props {
  className?: string;
  setOpen: (open: boolean) => void;
}

export const FormSubscription: React.FC<Props> = ({ setOpen }) => {
  const [submiting, setSubmiting] = React.useState(false);
  const form = useForm<SubscriptionFormType>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '',
      description: '',
      dailyPrice: '',
    },
  });
  const onSubmit = async (data: SubscriptionFormType) => {
    try {
      setSubmiting(true);
      await createSubscribtion(data);
      toast.success('Тарифный план успешно создан', { icon: '✅' });
      setOpen(false);
      setSubmiting(false);
    } catch (error) {
      if (error instanceof Error) {
        setSubmiting(false);
        console.log('Error [SUBSCRIPTION_FORM]', error);
        return toast.error(error.message, { icon: '❌' });
      }
    }
  };
  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <FormInput
            label='Название подписки'
            name='name'
            id='name'
            type='text'
            placeholder='Например Стандарт'
            required
          />
        </div>

        <div className='space-y-2 relative'>
          <FormInput
            label='Тариф'
            name='dailyPrice'
            id='dailyPrice'
            type='text'
            placeholder='Стоимость 1 конфига за 1 день'
            required
          />
        </div>

        <div className='space-y-2 relative'>
          <FormInput
            label='Количество конфигов для одного пользователя'
            name='maxPeers'
            id='maxPeers'
            type='text'
            placeholder='Например 5'
            required
          />
        </div>

        <div className='space-y-2'>
          <FormTextarea
            label='Описание'
            name='description'
            id='description'
            placeholder='Описание'
            required
          />
        </div>

        <Button className='w-full' type='submit' disabled={submiting}>
          {submiting ? 'Создание тарифа...' : 'Создать'}
        </Button>
      </form>
    </FormProvider>
  );
};
