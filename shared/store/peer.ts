import { WireguardPeer } from '@prisma/client';
import { create } from 'zustand';
import { getPeerList } from '../services/peer';
interface PeetsState {
  loading: boolean;
  error: boolean;
  peers: WireguardPeer[];
  getPeers: () => Promise<void>;
}
export const usePeerStore = create<PeetsState>((set) => ({
  loading: true,
  error: false,
  peers: [],
  getPeers: async () => {
    try {
      const data = await getPeerList();
      set({ peers: data });
    } catch (error) {
      console.error(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
