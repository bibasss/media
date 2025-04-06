import { create } from 'zustand'
import { getAllPosts } from '../../LOGIC/api.tsx'
interface PostStore {
  posts: any[]
  isLoading: boolean
  fetchPost: () => Promise<void>
}

export const UsePostStore = create<PostStore>((set) => ({
  posts: [],
  isLoading: false,
  fetchPost: async () => {
    set({ isLoading: true });
    try {
      const { success, data } = await getAllPosts();
      if (success) {
        set({ posts: data });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      set({ isLoading: false });
    }
  }
}));
