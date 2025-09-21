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
import { LoginForm } from '../form';

interface Props {
  className?: string;
}

export const LoginUser: React.FC<Props> = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='lg' className='px-8 py-4'>
          Войти
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-sm'>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>Добро пожаловать</DialogTitle>
          <DialogDescription className='text-center'>
            Введите логин и пароль для входа в аккаунт
          </DialogDescription>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
};
