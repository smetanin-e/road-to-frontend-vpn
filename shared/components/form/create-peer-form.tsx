'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../ui';
import { FormInput } from './form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPeerSchema, CreatePeerType } from '@/shared/schemas/create-peer-schema';
import { useUserStore } from '@/shared/store/user';
import { createPeer } from '@/shared/services/peer';

interface Props {
  className?: string;
  setOpen: (open: boolean) => void;
}

export const CreatePeerForm: React.FC<Props> = ({ setOpen }) => {
  const user = useUserStore((state) => state.user);
  const form = useForm<CreatePeerType>({
    resolver: zodResolver(createPeerSchema),
  });

  const onSubmit = async (data: CreatePeerType) => {
    try {
      const payload = { userId: user!.id, name: data.name };
      console.log(payload);
      await createPeer(payload);
      setOpen(false);
      toast.success('Файл конфигурации успешно создан', { icon: '✅' });
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error [CREATE_PEER_FORM]', error);
        return toast.error(error.message, { icon: '❌' });
      }
    }
  };
  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <FormInput
            label='name'
            name='name'
            id='name'
            type='text'
            placeholder='Введите название файла конфигурации...'
            required
          />
        </div>

        <Button disabled={form.formState.isSubmitting} className='w-full' type='submit'>
          Создать
        </Button>
      </form>
    </FormProvider>
  );
};
