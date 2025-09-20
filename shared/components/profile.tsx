'use client';
import React from 'react';
import { useUserStore } from '../store/user';
import { Button } from './ui';
import { signOut } from '../services/auth/sign-out';

interface Props {
  className?: string;
}

export const Profile: React.FC<Props> = () => {
  const user = useUserStore((state) => state.user);
  console.log(user);

  const logout = () => {
    signOut();
  };
  return (
    <div>
      {user ? (
        <>
          <p>
            Пользователь: {user?.firstName} {user?.lastName}
          </p>
          <Button onClick={logout}>Выход</Button>{' '}
        </>
      ) : (
        ''
      )}
    </div>
  );
};
