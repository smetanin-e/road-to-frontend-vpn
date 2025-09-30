import { SubscriptionList } from '@/shared/components';

import { UsersList } from '@/shared/components/users-list';

export default function AdminPage() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Админ-панель</h1>
      <SubscriptionList />
      <UsersList />
    </div>
  );
}
