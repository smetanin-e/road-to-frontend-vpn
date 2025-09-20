'use client';
import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui';
import { FormInput } from '@/shared/components';
import { FormProvider, useForm } from 'react-hook-form';

interface Props {
  className?: string;
}

export const RegisterUser: React.FC<Props> = () => {
  const form = useForm();
  const onSubmit = async (data: any) => {
    console.log(data);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Создать пользователя
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>
            Создание пользователя
          </DialogTitle>
          <DialogDescription className='text-center'>Регистрация пользователя</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <FormInput
                  label='Имя'
                  name='firstName'
                  id='firstName'
                  type='text'
                  placeholder='Имя'
                  required
                />
              </div>
              <div className='space-y-2'>
                <FormInput
                  label='Фамилия'
                  name='lastName'
                  id='lastName'
                  type='text'
                  placeholder='Фамилия'
                  required
                />
              </div>
            </div>
            {/* <PhoneInput /> */}
            <div className='space-y-2'>
              <FormInput label='Телефон' name='phone' id='phone' type='tel' required />
            </div>
            <div className='space-y-2'>
              <FormInput
                label='telegram'
                name='telegram'
                id='telegram'
                type='text'
                placeholder='@user'
                required
              />
            </div>
            <div className='space-y-2'>
              <FormInput
                label='Пароль'
                name='password'
                id='password'
                type='password'
                placeholder='Введите пароль'
                required
              />
            </div>
            <div className='space-y-2'>
              <FormInput
                label='Повторите пароль'
                name='confirmPassword'
                id='confirmPassword'
                type='password'
                placeholder='Повторите пароль'
                required
              />
            </div>
            <Button className='w-full' type='submit'>
              Создать
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
