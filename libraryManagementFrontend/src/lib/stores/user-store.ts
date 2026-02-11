import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'owner' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  branchId?: string;
  [key: string]: any;
}

interface UserFilters {
  role?: 'all' | 'superadmin' | 'owner' | 'manager' | 'staff';
  status?: 'all' | 'active' | 'inactive';
  branchId?: string;
  search?: string;
}

interface UserStore {
  users: User[];
  filters: UserFilters;
  selectedUsers: string[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  resetFilters: () => void;
  setSelectedUsers: (ids: string[]) => void;
  toggleUserSelection: (id: string) => void;
  clearSelection: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  filters: { role: 'all', status: 'all' },
  selectedUsers: [],
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, data) => set((state) => ({
    users: state.users.map((u) => u.id === id ? { ...u, ...data } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id)
  })),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: { role: 'all', status: 'all' } }),
  setSelectedUsers: (ids) => set({ selectedUsers: ids }),
  toggleUserSelection: (id) => set((state) => ({
    selectedUsers: state.selectedUsers.includes(id)
      ? state.selectedUsers.filter((i) => i !== id)
      : [...state.selectedUsers, id]
  })),
  clearSelection: () => set({ selectedUsers: [] }),
}));
