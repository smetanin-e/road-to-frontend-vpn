import { axiosInstance } from './instance';
import { UserDTO } from './dto/users.dto';

export const getUsersFromDb = async (): Promise<UserDTO[]> => {
  return (await axiosInstance.get<UserDTO[]>('/user')).data;
};
