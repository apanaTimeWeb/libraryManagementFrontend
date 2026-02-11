import api from './axios-instance';
import { fetchBranches as mockFetchBranches, createBranch as mockCreateBranch, updateBranch as mockUpdateBranch, deleteBranch as mockDeleteBranch } from './mock-service';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false';

export const branchAPI = {
  getAll: async (params: any) => {
    if (USE_MOCK) return mockFetchBranches(params);
    const { data } = await api.get('/branches', { params });
    return data;
  },
  
  getById: async (id: string) => {
    if (USE_MOCK) {
      const { branches } = await import('@/lib/mockData');
      return { data: branches.find(b => b.id === id) };
    }
    const { data } = await api.get(`/branches/${id}`);
    return data;
  },
  
  create: async (branchData: any) => {
    if (USE_MOCK) return mockCreateBranch(branchData);
    const { data } = await api.post('/branches', branchData);
    return data;
  },
  
  update: async (id: string, branchData: any) => {
    if (USE_MOCK) return mockUpdateBranch(id, branchData);
    const { data } = await api.put(`/branches/${id}`, branchData);
    return data;
  },
  
  delete: async (id: string) => {
    if (USE_MOCK) return mockDeleteBranch(id);
    const { data } = await api.delete(`/branches/${id}`);
    return data;
  },
  
  deactivate: async (id: string, reason: any) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    }
    const { data } = await api.post(`/branches/${id}/deactivate`, reason);
    return data;
  },
};
