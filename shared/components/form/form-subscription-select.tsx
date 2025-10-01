'use client';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RequiredSymbol } from '../required-symbol';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui';
import { ErrorText } from '../error-text';
import { useSubscriptionStore } from '@/shared/store/subscription';

interface Props {
  className?: string;
  name: string;
  label?: string;
  required?: boolean;
}

export const FormSubscriptionSelect: React.FC<Props> = ({ name, label, required }) => {
  const getSubscriptions = useSubscriptionStore((state) => state.getSubscriptions);
  const subscriptions = useSubscriptionStore((state) => state.subscription);
  React.useEffect(() => {
    getSubscriptions();
  }, []);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorText = errors[name]?.message as string;
  return (
    <div className='relative'>
      {label && (
        <p className='font-medium mb-0.5 text-sm'>
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = field.value ?? '';
          return (
            <div className='relative'>
              <Select value={value} onValueChange={field.onChange}>
                <SelectTrigger className='h-12 text-md w-full'>
                  <SelectValue placeholder='Выберите...' />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((sub) => (
                    <SelectItem key={sub.id} value={String(sub.id)}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }}
      />

      {errorText && <ErrorText text={errorText} className='absolute text-[12px] right-0' />}
    </div>
  );
};
