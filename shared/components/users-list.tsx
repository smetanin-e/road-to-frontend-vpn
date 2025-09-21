'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Button,
  TableRow,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Switch,
} from '@/shared/components/ui';
import Link from 'next/link';
import { Send, Trash2 } from 'lucide-react';
import { useUserStore } from '../store/user';
import { LoadingBounce } from './loading-bounce';
interface Props {
  className?: string;
}

export const UsersList: React.FC<Props> = () => {
  const loading = useUserStore((state) => state.loadClients);
  const users = useUserStore((state) => state.clients);
  const getClients = useUserStore((state) => state.getClients);

  React.useEffect(() => {
    getClients();
  }, []);

  console.log(users);
  return (
    <Card className='rounded-2xl shadow relative min-h-40'>
      {loading ? (
        <LoadingBounce />
      ) : (
        <>
          <CardHeader>
            <CardTitle>Пользователи</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Телеграм</TableHead>
                  <TableHead>Логин</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className='text-right'>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Эти данные потом подтянешь из Prisma */}
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      <Link href={user.telegram} target='_blank'>
                        <Button
                          size={'sm'}
                          className='bg-blue-500 text-white rounded-full h-8 w-8 hover:bg-blue-400 hover:text-white'
                          variant={'outline'}
                        >
                          <Send />
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>{user.login}</TableCell>
                    <TableCell>
                      <Badge variant={user.status ? 'success' : 'destructive'}>
                        {' '}
                        {user.status ? 'Активен' : 'Отключен'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right space-x-4'>
                      <Switch checked={user.status} className='data-[state=checked]:bg-success' />
                      <Button size='sm' variant='destructive'>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </>
      )}
    </Card>
  );
};
