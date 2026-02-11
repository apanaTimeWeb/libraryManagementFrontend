import api from './axios-instance';
import { fetchUsers as mockFetchUsers, createUser as mockCreateUser, updateUser as mockUpdateUser, deleteUser as mockDeleteUser } from './mock-service';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false';

export const userAPI = {
  getAll: async (params: any) => {
    if (USE_MOCK) return mockFetchUsers(params);
    const { data } = await api.get('/users', { params });
    return data;
  },
  
  getById: async (id: string) => {
    if (USE_MOCK) {
      const { users } = await import('@/lib/mockData');
      return { data: users.find(u => u.id === id) };
    }
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
  
  create: async (userData: any) => {
    if (USE_MOCK) return mockCreateUser(userData);
    const { data } = await api.post('/users', userData);
    return data;
  },
  
  update: async (id: string, userData: any) => {
    if (USE_MOCK) return mockUpdateUser(id, userData);
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },
  
  delete: async (id: string) => {
    if (USE_MOCK) return mockDeleteUser(id);
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
  
  resetPassword: async (id: string, passwordData: any) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    }
    const { data } = await api.post(`/users/${id}/reset-password`, passwordData);
    return data;
  },
  
  updatePermissions: async (id: string, permissions: string[]) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, data: { permissions } };
    }
    const { data } = await api.put(`/users/${id}/permissions`, { permissions });
    return data;
  },
};
