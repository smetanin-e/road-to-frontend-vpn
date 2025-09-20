'use client';
import { useUserStore } from '@/shared/store/user';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';
import { Toaster } from 'react-hot-toast';

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const color = 'var(--color-primary)';
  const { initUser, loading } = useUserStore();

  React.useEffect(() => {
    initUser();
  }, [initUser]);

  if (loading) {
    return null;
  }

  return (
    <>
      {children}
      <Toaster /> <NextTopLoader color={color} shadow={`0 0 10px ${color},0 0 5px ${color}`} />
    </>
  );
};
