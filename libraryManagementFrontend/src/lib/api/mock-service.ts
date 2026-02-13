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
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
  if (params.city) {
    filtered = filtered.filter(b => b.city === params.city);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(b =>
      b.name.toLowerCase().includes(search) ||
      b.city.toLowerCase().includes(search)
    );
  }
  
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
  if (params.branchId) {
    filtered = filtered.filter(u => u.branchId === params.branchId);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  }
  
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

// Audit Log API
export async function fetchAuditLogs(params: PaginationParams & {
  action?: string;
  userId?: string;
  search?: string;
}): Promise<PaginatedResponse<typeof auditLogs[0]>> {
  await delay(300);
  
  let filtered = [...mutableAuditLogs];
  
  if (params.action) {
    filtered = filtered.filter(log => log.action === params.action);
  }
  if (params.userId) {
    filtered = filtered.filter(log => log.userId === params.userId);
  }
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(log =>
      log.action.toLowerCase().includes(search) ||
      log.entityType.toLowerCase().includes(search)
    );
  }
  
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
