import { create } from 'zustand'
import { getAllUsers } from '../../LOGIC/api.tsx'

interface UserStore {
  users: any[]
  isLoading2: boolean
  fetchUsers: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  isLoading2: false,
  fetchUsers: async () => {
    set({ isLoading2: true });
    try {
      const { success, data } = await getAllUsers();
      if (success) {
        set({ users: data });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      set({ isLoading2: false });
    }
  }
}));
