import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user: any) => set({ user }),
}));

export default useStore;
