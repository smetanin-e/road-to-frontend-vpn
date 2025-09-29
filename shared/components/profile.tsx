'use client';
import React from 'react';
import { useUserStore } from '../store/user';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from './ui';
import { signOut } from '../services/auth/sign-out';
import { Payment } from './@modals/payment';

interface Props {
  className?: string;
}

export const Profile: React.FC<Props> = () => {
  const user = useUserStore((state) => state.user);

  const logout = () => {
    signOut();
  };
  return (
    <div>
      {' '}
      <div>
        {user ? (
          <>
            <p>
              Пользователь: {user?.firstName} {user?.lastName}
            </p>
            <Button onClick={logout}>Выход</Button>{' '}
          </>
        ) : (
          ''
        )}
      </div>
      <Card className='rounded-2xl shadow'>
        <CardHeader>
          <CardTitle>Моя подписка</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p className='text-muted-foreground'>Тариф: Standard 10 ₽ в день</p>
          <p className='text-muted-foreground'>Баланс: {user?.balance}</p>

          <p className='text-muted-foreground'>Истекает: 31.10.2025</p>
          <Badge variant='success'>Активна</Badge>
          <div>
            <Payment />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
