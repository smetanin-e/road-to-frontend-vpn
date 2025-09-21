'use client';
import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui';
import { FormInput } from '@/shared/components';
import { FormProvider, useForm } from 'react-hook-form';
import { AtSign } from 'lucide-react';
import { createUserSchema, CreateUserType } from '@/shared/schemas/create-user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { createUser } from '@/shared/services/auth/auth-service';
import { useUserStore } from '@/shared/store/user';

interface Props {
  className?: string;
}

export const RegisterUser: React.FC<Props> = () => {
  const [submiting, setSubmiting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateUserType>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '+7',
      login: '',
      password: '',
      confirmPassword: '',
      telegram: '',
    },
  });

  const onSubmit = async (data: CreateUserType) => {
    try {
      setSubmiting(true);
      await createUser(data);
      useUserStore.getState().getClients();
      toast.success('Аккаунт успешно создан!!!', { icon: '✅' });
      setOpen(false);
      setSubmiting(false);
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        setSubmiting(false);
        console.log('Error [REGISTER_FORM]', error);
        return toast.error(error.message, { icon: '❌' });
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant='outline' size='sm'>
          Создать пользователя
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>
            Создание пользователя
          </DialogTitle>
          <DialogDescription className='text-center'>
            Добавление нового пользователя
          </DialogDescription>
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
            <div className='space-y-2 relative'>
              <FormInput
                label='telegram'
                name='telegram'
                id='telegram'
                type='text'
                placeholder='user' // https://t.me/user
                required
              >
                <AtSign className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              </FormInput>
            </div>
            {/* <PhoneInput /> */}
            <div className='space-y-2'>
              <FormInput label='Телефон' name='phone' id='phone' type='tel' required />
            </div>

            <div className='space-y-2'>
              <FormInput
                label='Логин'
                name='login'
                id='login'
                type='text'
                placeholder='Логин'
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
            <Button className='w-full' type='submit' disabled={submiting}>
              {submiting ? 'Загрузка...' : 'Создать'}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
