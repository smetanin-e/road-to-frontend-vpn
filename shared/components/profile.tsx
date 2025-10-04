'use client';
import React from 'react';
import { useUserStore } from '../store/user';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from './ui';
import { signOut } from '../services/auth/sign-out';
import { Payment } from './@modals/payment';
import { cn } from '../lib/utils';

interface Props {
  className?: string;
}

export const Profile: React.FC<Props> = () => {
  const user = useUserStore((state) => state.user);
  console.log(user);
  const subsEnd = user?.subsEnd
    ? new Date(user.subsEnd).toLocaleDateString('ru-RU')
    : 'Дата не определена';

  const logout = () => {
    signOut();
  };
  return (
    <div>
      {' '}
      <div>
        {user ? (
          <>
            <div className='flex items-center justify-between mb-6'>
              <p>
                {user?.firstName} {user?.lastName}
              </p>
              <Button variant={'secondary'} size={'sm'} onClick={logout}>
                Выход
              </Button>{' '}
            </div>

            <Card className='rounded-2xl shadow'>
              <CardHeader className='flex items-center justify-between'>
                <CardTitle>Моя подписка</CardTitle>
                <Badge variant='success'>Активна</Badge>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p>
                  Тариф:{' '}
                  <span className='text-muted-foreground'>
                    {user?.subscription.name} {user?.subscription.dailyPrice} ₽ в день за одну
                    активную конфигурацию
                  </span>
                </p>
                <p>
                  Описание:{' '}
                  <span className='text-muted-foreground'>{user?.subscription.description}</span>
                </p>
                <div className='flex items-center gap-10'>
                  <p>
                    Баланс:{' '}
                    <strong className={cn(user?.balance > 0 ? 'text-success' : 'text-destructive')}>
                      {user?.balance} ₽
                    </strong>
                  </p>
                  <div>
                    <Payment />
                  </div>
                </div>

                <p className='text-muted-foreground'>Действие подписки до: {subsEnd}</p>
              </CardContent>
            </Card>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
