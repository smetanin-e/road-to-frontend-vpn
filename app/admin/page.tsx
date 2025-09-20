import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

export default function AdminPage() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Админ-панель</h1>

      <Card className='rounded-2xl shadow'>
        <CardHeader>
          <CardTitle>Пользователи</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Тариф</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className='text-right'>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Эти данные потом подтянешь из Prisma */}
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>user@example.com</TableCell>
                <TableCell>Standard</TableCell>
                <TableCell>Активен</TableCell>
                <TableCell className='text-right space-x-2'>
                  <Button size='sm' variant='outline'>
                    Отключить
                  </Button>
                  <Button size='sm' variant='destructive'>
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
