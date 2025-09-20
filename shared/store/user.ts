import { create } from 'zustand';
import { getMe } from '../services/auth/get-me';
import { refreshAccessToken } from '../services/auth/refresh-access-token';

type User = {
  id: number;
  login: string;
  role: string;
  firstName: string;
  lastName: string;
} | null;

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  initUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  initUser: async () => {
    try {
      const me = await getMe();
      if (me) {
        set({ user: me, loading: false });
      }
      await refreshAccessToken();
      const meAfterRefresh = await getMe();
      set({ user: meAfterRefresh, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));
