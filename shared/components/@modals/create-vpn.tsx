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
import { CreatePeerForm } from '../form';

interface Props {
  className?: string;
}

export const CreateVpn: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='lg' className='px-8 py-4'>
          Добавить конфигурацию
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-sm'>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>
            Создание конфигурации VPN
          </DialogTitle>
          <DialogDescription className='text-center'>
            Введите название своего файла конфигурации
          </DialogDescription>
        </DialogHeader>
        <CreatePeerForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
