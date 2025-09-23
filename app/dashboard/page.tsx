import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Profile } from '@/shared/components/profile';
import { Payment } from '@/shared/components/@modals/payment';

export default function DashboardPage() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Личный кабинет</h1>
      <Profile />
      <Card className='rounded-2xl shadow'>
        <CardHeader>
          <CardTitle>Моя подписка</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p className='text-muted-foreground'>Тариф: Standard</p>
          <p className='text-muted-foreground'>Истекает: 31.10.2025</p>
          <Badge variant='secondary'>Активна</Badge>
          <div>
            <Payment />
          </div>
        </CardContent>
      </Card>

      <Card className='rounded-2xl shadow'>
        <CardHeader>
          <CardTitle>Конфигурация WireGuard</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <p className='text-muted-foreground'>
            Ваш конфиг готов к использованию. Вы можете скачать файл или отсканировать QR-код.
          </p>
          <div className='flex gap-2 mt-4'>
            <Button variant='outline'>Скачать .conf</Button>
            <Button variant='outline'>Показать QR-код</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
