import { User } from '@prisma/client';

export type UserDTO = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'login' | 'role' | 'phone' | 'telegram' | 'status'
>;
