import axios from 'axios';
import { axiosInstance } from './instance';
import { CreateVPN } from './dto/vpn.dto';
import { usePeerStore } from '../store/peer';
import { useUserStore } from '../store/user';

export async function createPeer(value: CreateVPN) {
  try {
    const { data } = await axiosInstance.post('/vpn/create', value);
    usePeerStore.getState().getPeers();
    useUserStore.getState().initUser();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Ошибка создания конфигурации');
    }
    throw error;
  }
}

export async function deletePeer(id: number) {
  try {
    const { data } = await axiosInstance.delete(`/vpn/${id}/delete`);
    usePeerStore.getState().getPeers();
    useUserStore.getState().initUser();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Ошибка удаления конфигурации');
    }
    throw error;
  }
}

export async function getPeerList() {
  try {
    const { data } = await axiosInstance.get('/vpn/list');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Не удалось получить список конфигураций');
    }
    throw error;
  }
}

export async function deactivatePeer(id: number) {
  try {
    const { data } = await axiosInstance.patch(
      `/vpn/${id}/deactivate`,
      {},
      {
        withCredentials: true, // чтобы cookie с токеном передались
      },
    );
    usePeerStore.getState().getPeers();
    useUserStore.getState().initUser();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Не удалось деактивировать конфигурацию');
    }
    throw error;
  }
}

export async function activatePeer(id: number) {
  try {
    const { data } = await axiosInstance.patch(
      `/vpn/${id}/activate`,
      {},
      {
        withCredentials: true, // чтобы cookie с токеном передались
      },
    );
    usePeerStore.getState().getPeers();
    useUserStore.getState().initUser();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Не удалось активировать конфигурацию');
    }
    throw error;
  }
}
