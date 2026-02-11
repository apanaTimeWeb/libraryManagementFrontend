import api from './axios-instance';
import { fetchAuditLogs as mockFetchAuditLogs } from './mock-service';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false';

export const auditAPI = {
  getAll: async (params: any) => {
    if (USE_MOCK) return mockFetchAuditLogs(params);
    const { data } = await api.get('/audit-logs', { params });
    return data;
  },
  
  getById: async (id: string) => {
    if (USE_MOCK) {
      const { auditLogs } = await import('@/lib/mockData');
      return { data: auditLogs.find(log => log.id === id) };
    }
    const { data } = await api.get(`/audit-logs/${id}`);
    return data;
  },
  
  export: async (params: any) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, url: '/exports/audit-logs.csv' };
    }
    const { data } = await api.post('/audit-logs/export', params);
    return data;
  },
};
