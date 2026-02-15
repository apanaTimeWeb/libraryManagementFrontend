import { create } from 'zustand';

export type UserRole = 'manager' | 'staff';

interface RoleState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isManager: () => boolean;
  isStaff: () => boolean;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  role: 'manager', // Default to manager for demo
  setRole: (role) => set({ role }),
  isManager: () => get().role === 'manager',
  isStaff: () => get().role === 'staff',
}));
