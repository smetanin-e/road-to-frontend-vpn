'use client';

import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';

export const Providers: React.FC<React.PropsWithChildren> = () => {
  const color = 'var(--color-primary)';
  return (
    <>
      <Toaster />
      <NextTopLoader color={color} shadow={`0 0 10px ${color},0 0 5px ${color}`} />
    </>
  );
};
