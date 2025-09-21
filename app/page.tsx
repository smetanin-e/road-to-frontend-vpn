import { LoginUser } from '@/shared/components/@modals';
import { Button } from '@/shared/components/ui/button';
import { getMe } from '@/shared/services/auth/get-me';
import Link from 'next/link';

export default async function Home() {
  const user = await getMe();
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6'>
      <h1 className='text-5xl font-bold mb-4 text-center'>Добро пожаловать в VPN-сервис</h1>

      <p className='text-lg text-gray-600 mb-8 text-center max-w-xl'>
        Безопасный доступ к интернету для ограниченного круга пользователей. Пожалуйста, войдите в
        систему, чтобы управлять своими настройками и конфигурациями WireGuard.
      </p>
      {user ? (
        <Link href={'/admin'}>
          <Button>Войти</Button>
        </Link>
      ) : (
        <LoginUser />
      )}

      <footer className='mt-20 text-gray-500 text-sm'>
        &copy; 2025 MyVPN. Все права защищены.
      </footer>
    </div>
  );
}
