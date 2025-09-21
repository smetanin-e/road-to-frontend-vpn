import { User } from '@prisma/client';
import { axiosInstance } from './instance';

export const getUsersFromDb = async (): Promise<User[]> => {
  return (await axiosInstance.get<User[]>('/users')).data;
};
