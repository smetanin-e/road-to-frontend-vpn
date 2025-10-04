import { Subscription, User } from '@prisma/client';

export type UserDTO = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'login' | 'role' | 'phone' | 'telegram' | 'status'
> & { subscription: Subscription };

export type UserSubscription = {
  name: string;
  dailyPrice: number;
  description: string;
  maxPeers: number;
};
export type CurrentUser = {
  id: number;
  login: string;
  role: string;
  firstName: string;
  lastName: string;
  balance: number;
  subsEnd: Date;
  subscription: UserSubscription;
} | null;
