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
import { FormSubscription } from '../form';

interface Props {
  className?: string;
}

export const CreateSubscription: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant='outline' size='sm'>
          Добавить подписку
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>Создание подписки</DialogTitle>
          <DialogDescription className='text-center'>
            Добавление нового тарифного плана
          </DialogDescription>
        </DialogHeader>
        <FormSubscription setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
