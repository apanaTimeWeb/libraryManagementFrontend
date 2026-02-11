import { create } from 'zustand';

interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  status: 'active' | 'inactive';
  managerId?: string;
  [key: string]: any;
}

interface BranchFilters {
  status?: 'all' | 'active' | 'inactive';
  city?: string;
  managerId?: string;
  search?: string;
  dateRange?: [Date, Date];
}

interface BranchStore {
  branches: Branch[];
  filters: BranchFilters;
  selectedBranches: string[];
  setBranches: (branches: Branch[]) => void;
  addBranch: (branch: Branch) => void;
  updateBranch: (id: string, data: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;
  setFilters: (filters: Partial<BranchFilters>) => void;
  resetFilters: () => void;
  setSelectedBranches: (ids: string[]) => void;
  toggleBranchSelection: (id: string) => void;
  clearSelection: () => void;
}

export const useBranchStore = create<BranchStore>((set) => ({
  branches: [],
  filters: { status: 'all' },
  selectedBranches: [],
  setBranches: (branches) => set({ branches }),
  addBranch: (branch) => set((state) => ({ branches: [...state.branches, branch] })),
  updateBranch: (id, data) => set((state) => ({
    branches: state.branches.map((b) => b.id === id ? { ...b, ...data } : b)
  })),
  deleteBranch: (id) => set((state) => ({
    branches: state.branches.filter((b) => b.id !== id)
  })),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: { status: 'all' } }),
  setSelectedBranches: (ids) => set({ selectedBranches: ids }),
  toggleBranchSelection: (id) => set((state) => ({
    selectedBranches: state.selectedBranches.includes(id)
      ? state.selectedBranches.filter((i) => i !== id)
      : [...state.selectedBranches, id]
  })),
  clearSelection: () => set({ selectedBranches: [] }),
}));
