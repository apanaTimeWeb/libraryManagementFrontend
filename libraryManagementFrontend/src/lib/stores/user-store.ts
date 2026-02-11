import { create } from 'zustand';
import type { User } from '@/lib/types';
import { userAPI } from '@/lib/api/users';

type UserPayload = Partial<User> & Pick<User, 'name' | 'email' | 'phone' | 'role' | 'permissions' | 'isActive'>;

interface UserFilters {
  role?: 'all' | User['role'];
  status?: 'all' | 'active' | 'inactive';
  branchId?: string;
  search?: string;
}

interface UserStore {
  users: User[];
  filters: UserFilters;
  selectedUsers: string[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: (params?: { page?: number; limit?: number }) => Promise<void>;
  createUser: (data: UserPayload) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setFilters: (filters: Partial<UserFilters>) => void;
  resetFilters: () => void;
  setSelectedUsers: (ids: string[]) => void;
  toggleUserSelection: (id: string) => void;
  clearSelection: () => void;
}

const defaultFilters: UserFilters = {
  role: 'all',
  status: 'all',
};

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  filters: defaultFilters,
  selectedUsers: [],
  isLoading: false,
  error: null,

  fetchUsers: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const { filters } = get();

      const response = await userAPI.getAll({
        page: params?.page ?? 1,
        limit: params?.limit ?? 1000,
        role: filters.role,
        status: filters.status,
        branchId: filters.branchId,
        search: filters.search,
      });

      set({ users: response.data ?? [], isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    }
  },

  createUser: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await userAPI.create(data);
      if (response?.data) {
        set((state) => ({ users: [response.data as User, ...state.users] }));
      }
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
      });
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await userAPI.update(id, data);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? ({ ...user, ...(response?.data ?? data) } as User) : user,
        ),
      }));
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update user',
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await userAPI.delete(id);
      set((state) => ({ users: state.users.filter((user) => user.id !== id) }));
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
      });
      throw error;
    }
  },

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSelectedUsers: (ids) => set({ selectedUsers: ids }),
  toggleUserSelection: (id) =>
    set((state) => ({
      selectedUsers: state.selectedUsers.includes(id)
        ? state.selectedUsers.filter((currentId) => currentId !== id)
        : [...state.selectedUsers, id],
    })),
  clearSelection: () => set({ selectedUsers: [] }),
}));
