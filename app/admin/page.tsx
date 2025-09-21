import { RegisterUser } from '@/shared/components/@modals';
import { UsersList } from '@/shared/components/users-list';

export default function AdminPage() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex justify-between gap-4'>
        <h1 className='text-3xl font-bold'>Админ-панель</h1>
        <RegisterUser />
      </div>

      <UsersList />
    </div>
  );
}
