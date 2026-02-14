import { branches, users, students, payments, auditLogs } from '@/lib/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create mutable copies that persist during the session
let mutableBranches = [...branches];
let mutableUsers = [...users];
let mutableStudents = [...students];
let mutablePayments = [...payments];
let mutableAuditLogs = [...auditLogs];

interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Generic sort function
function sortData<T>(data: T[], sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): T[] {
  if (!sortBy) return data;
  
  return [...data].sort((a, b) => {
    const aVal = (a as any)[sortBy];
    const bVal = (b as any)[sortBy];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal > bVal ? 1 : -1;
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

// Branch API
export async function fetchBranches(params: PaginationParams & {
  status?: string;
  city?: string;
  search?: string;
}): Promise<PaginatedResponse<typeof branches[0]>> {
  await delay(300);
  
  let filtered = [...mutableBranches];
  
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(b => b.status === params.status);
  }
  if (params.city && params.city !== 'all') {
    filtered = filtered.filter(b => b.city === params.city);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(b =>
      b.name.toLowerCase().includes(search) ||
      b.city.toLowerCase().includes(search) ||
      b.address.toLowerCase().includes(search)
    );
  }
  
  // Apply sorting
  filtered = sortData(filtered, params.sortBy, params.sortOrder);
  
  const total = filtered.length;
  const start = (params.page - 1) * params.limit;
  const data = filtered.slice(start, start + params.limit);
  
  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}

export async function createBranch(data: any) {
  await delay(500);
  const newBranch = { 
    ...data, 
    id: `br-${Date.now()}`,
    operationalSince: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
  mutableBranches = [newBranch, ...mutableBranches];
  return { success: true, data: newBranch };
}

export async function updateBranch(id: string, data: any) {
  await delay(400);
  const index = mutableBranches.findIndex(b => b.id === id);
  if (index !== -1) {
    mutableBranches[index] = { ...mutableBranches[index], ...data };
  }
  return { success: true, data: { ...data, id } };
}

export async function deleteBranch(id: string) {
  await delay(300);
  mutableBranches = mutableBranches.filter(b => b.id !== id);
  return { success: true };
}

export async function bulkUpdateBranches(ids: string[], updates: Partial<typeof branches[0]>) {
  await delay(500);
  ids.forEach(id => {
    const index = mutableBranches.findIndex(b => b.id === id);
    if (index !== -1) {
      mutableBranches[index] = { ...mutableBranches[index], ...updates };
    }
  });
  return { success: true, count: ids.length };
}

export async function bulkDeleteBranches(ids: string[]) {
  await delay(500);
  mutableBranches = mutableBranches.filter(b => !ids.includes(b.id));
  return { success: true, count: ids.length };
}

// User API
export async function fetchUsers(params: PaginationParams & {
  role?: string;
  status?: string;
  branchId?: string;
  search?: string;
}): Promise<PaginatedResponse<typeof users[0]>> {
  await delay(300);
  
  let filtered = [...mutableUsers];
  
  if (params.role && params.role !== 'all') {
    filtered = filtered.filter(u => u.role === params.role);
  }
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(u => u.isActive === (params.status === 'active'));
  }
  if (params.branchId && params.branchId !== 'all') {
    filtered = filtered.filter(u => u.branchId === params.branchId);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.phone.toLowerCase().includes(search)
    );
  }
  
  // Apply sorting
  filtered = sortData(filtered, params.sortBy, params.sortOrder);
  
  const total = filtered.length;
  const start = (params.page - 1) * params.limit;
  const data = filtered.slice(start, start + params.limit);
  
  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}

export async function createUser(data: any) {
  await delay(500);
  const newUser = {
    ...data,
    id: `usr-${Date.now()}`,
    avatarUrl: `https://i.pravatar.cc/150?u=${data.email}`,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  mutableUsers = [newUser, ...mutableUsers];
  return { success: true, data: newUser };
}

export async function updateUser(id: string, data: any) {
  await delay(400);
  const index = mutableUsers.findIndex(u => u.id === id);
  if (index !== -1) {
    mutableUsers[index] = { ...mutableUsers[index], ...data };
  }
  return { success: true, data: { ...data, id } };
}

export async function deleteUser(id: string) {
  await delay(300);
  mutableUsers = mutableUsers.filter(u => u.id !== id);
  return { success: true };
}

export async function bulkUpdateUsers(ids: string[], updates: Partial<typeof users[0]>) {
  await delay(500);
  ids.forEach(id => {
    const index = mutableUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mutableUsers[index] = { ...mutableUsers[index], ...updates };
    }
  });
  return { success: true, count: ids.length };
}

export async function bulkDeleteUsers(ids: string[]) {
  await delay(500);
  mutableUsers = mutableUsers.filter(u => !ids.includes(u.id));
  return { success: true, count: ids.length };
}

// Audit Log API
export async function fetchAuditLogs(params: PaginationParams & {
  action?: string;
  userId?: string;
  entityType?: string;
  severity?: string;
  search?: string;
}): Promise<PaginatedResponse<typeof auditLogs[0]>> {
  await delay(300);
  
  let filtered = [...mutableAuditLogs];
  
  if (params.action && params.action !== 'all') {
    filtered = filtered.filter(log => log.action === params.action);
  }
  if (params.userId && params.userId !== 'all') {
    filtered = filtered.filter(log => log.userId === params.userId);
  }
  if (params.entityType && params.entityType !== 'all') {
    filtered = filtered.filter(log => log.entityType === params.entityType);
  }
  if (params.severity && params.severity !== 'all') {
    filtered = filtered.filter(log => log.severity === params.severity);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(log =>
      log.action.toLowerCase().includes(search) ||
      log.entityType.toLowerCase().includes(search) ||
      log.ipAddress.toLowerCase().includes(search)
    );
  }
  
  // Apply sorting (default by timestamp desc)
  filtered = sortData(filtered, params.sortBy || 'timestamp', params.sortOrder || 'desc');
  
  const total = filtered.length;
  const start = (params.page - 1) * params.limit;
  const data = filtered.slice(start, start + params.limit);
  
  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}
