import { create } from 'zustand';
import type { Branch } from '@/lib/types';
import { branchAPI } from '@/lib/api/branches';

type BranchPayload = Partial<Branch> & Pick<Branch, 'name' | 'city' | 'address' | 'contactNumber' | 'email' | 'status' | 'capacity' | 'occupancy' | 'revenue' | 'defaultShiftMorning' | 'defaultShiftEvening'>;

interface BranchFilters {
  status?: 'all' | Branch['status'];
  city?: string;
  managerId?: string;
  search?: string;
  dateRange?: [Date, Date];
}

interface BranchStore {
  branches: Branch[];
  filters: BranchFilters;
  selectedBranches: string[];
  isLoading: boolean;
  error: string | null;
  fetchBranches: (params?: { page?: number; limit?: number }) => Promise<void>;
  createBranch: (data: BranchPayload) => Promise<void>;
  updateBranch: (id: string, data: Partial<Branch>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  setFilters: (filters: Partial<BranchFilters>) => void;
  resetFilters: () => void;
  setSelectedBranches: (ids: string[]) => void;
  toggleBranchSelection: (id: string) => void;
  clearSelection: () => void;
}

const defaultFilters: BranchFilters = { status: 'all' };

export const useBranchStore = create<BranchStore>((set, get) => ({
  branches: [],
  filters: defaultFilters,
  selectedBranches: [],
  isLoading: false,
  error: null,

  fetchBranches: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const { filters } = get();
      const response = await branchAPI.getAll({
        page: params?.page ?? 1,
        limit: params?.limit ?? 1000,
        status: filters.status,
        city: filters.city,
        search: filters.search,
      });

      set({ branches: response.data ?? [], isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch branches',
      });
    }
  },

  createBranch: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await branchAPI.create(data);
      if (response?.data) {
        set((state) => ({ branches: [response.data as Branch, ...state.branches] }));
      }
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create branch',
      });
      throw error;
    }
  },

  updateBranch: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await branchAPI.update(id, data);
      set((state) => ({
        branches: state.branches.map((branch) =>
          branch.id === id ? ({ ...branch, ...(response?.data ?? data) } as Branch) : branch,
        ),
      }));
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update branch',
      });
      throw error;
    }
  },

  deleteBranch: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await branchAPI.delete(id);
      set((state) => ({ branches: state.branches.filter((branch) => branch.id !== id) }));
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete branch',
      });
      throw error;
    }
  },

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSelectedBranches: (ids) => set({ selectedBranches: ids }),
  toggleBranchSelection: (id) =>
    set((state) => ({
      selectedBranches: state.selectedBranches.includes(id)
        ? state.selectedBranches.filter((currentId) => currentId !== id)
        : [...state.selectedBranches, id],
    })),
  clearSelection: () => set({ selectedBranches: [] }),
}));
