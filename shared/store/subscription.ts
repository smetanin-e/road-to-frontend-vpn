import { Subscription } from '@prisma/client';
import { create } from 'zustand';
import { getSubscribtions } from '../services/subscription';

interface SubscriptionState {
  loading: boolean;
  error: boolean;
  subscription: Subscription[];
  getSubscriptions: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  loading: true,
  error: false,
  subscription: [],
  getSubscriptions: async () => {
    try {
      const data = await getSubscribtions();
      set({ subscription: data });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
