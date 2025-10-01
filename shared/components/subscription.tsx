'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui';
import { CreateSubscription } from './@modals';
import { Subscription } from '@prisma/client';
import { getSubscribtions } from '../services/subscription';
import { LoadingBounce } from './loading-bounce';
import { useSubscriptionStore } from '../store/subscription';

interface Props {
  className?: string;
}

export const SubscriptionList: React.FC<Props> = () => {
  //   const [subscription, setSubscription] = React.useState<Subscription[]>([]);
  //   const [loading, setLoading] = React.useState(false);

  //   const fetchSubscriptions = async () => {
  //     setLoading(true);
  //     const data = await getSubscribtions();
  //     setSubscription(data);
  //     setLoading(false);
  //   };

  const { loading, getSubscriptions, subscription } = useSubscriptionStore();

  React.useEffect(() => {
    getSubscriptions();
  }, []);
  return (
    <Card className='rounded-2xl shadow relative min-h-40'>
      {loading ? (
        <LoadingBounce />
      ) : (
        <>
          <CardHeader>
            <div className='flex justify-between gap-4'>
              <CardTitle>Подписки</CardTitle>
              <CreateSubscription />
            </div>
          </CardHeader>
          <CardContent>
            {subscription.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>Нет подписок</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-card-foreground font-semibold'>Название</TableHead>
                    <TableHead className='text-card-foreground font-semibold'>
                      Абонентская плата ₽/день
                    </TableHead>
                    <TableHead className='text-card-foreground font-semibold'>
                      Количество конфигов
                    </TableHead>
                    <TableHead className='text-card-foreground font-semibold'>Описание</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {subscription.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className='font-medium text-card-foreground'>{sub.name}</TableCell>
                      <TableCell className='text-card-foreground'>
                        {Number(sub.dailyPrice)}
                      </TableCell>
                      <TableCell className='text-card-foreground'>{sub.maxPeers}</TableCell>
                      <TableCell className='text-card-foreground max-w-[220px] truncate whitespace-normal break-words'>
                        {sub.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>{' '}
        </>
      )}
    </Card>
  );
};
