import React from 'react';

interface Props {
  className?: string;
}

export const LoadingBounce: React.FC<Props> = () => {
  return (
    <div className='absolute inset-0 bg-white/70 z-10 rounded-md flex items-center justify-center'>
      <div className='flex space-x-2'>
        <span className='w-2 h-2 bg-primary opacity-50 rounded-full animate-bounce [animation-delay:-0.3s]' />
        <span className='w-2 h-2 bg-primary opacity-50 rounded-full animate-bounce [animation-delay:-0.15s]' />
        <span className='w-2 h-2 bg-primary opacity-50 rounded-full animate-bounce' />
      </div>
    </div>
  );
};
