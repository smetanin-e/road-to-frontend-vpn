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
import { PaymentForm } from '../form/payment-form';

interface Props {
  className?: string;
}

export const Payment: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='lg' className='px-8 py-4'>
          Пополнить баланс
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-sm'>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>Добро пожаловать</DialogTitle>
          <DialogDescription className='text-center'>
            Введите логин и пароль для входа в аккаунт
          </DialogDescription>
        </DialogHeader>
        <PaymentForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
