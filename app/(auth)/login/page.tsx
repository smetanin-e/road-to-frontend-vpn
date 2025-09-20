import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';

import { LoginForm } from '@/shared/components';

export default function LoginPage() {
  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <Card>
        <CardContent className='min-w-sm'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-bold text-center'>Добро пожаловать</CardTitle>
            <CardDescription className='text-center'>
              Введите логин и пароль для входа в аккаунт
            </CardDescription>
          </CardHeader>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
