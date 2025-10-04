import { Profile } from '@/shared/components/profile';
import { PeerListCard } from '@/shared/components';

export default function DashboardPage() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Личный кабинет</h1>
      <Profile />

      <PeerListCard />
    </div>
  );
}
