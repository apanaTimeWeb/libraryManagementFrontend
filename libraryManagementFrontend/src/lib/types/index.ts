export type Role = 'superadmin' | 'owner' | 'manager' | 'staff';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    branchId?: string | null; // SuperAdmin has null branchId
    permissions: string[];
    isActive: boolean;
    avatarUrl?: string;
    lastLogin?: string;
}

export interface Branch {
    id: string;
    name: string;
    city: string;
    address: string;
    managerId?: string;
    contactNumber: string;
    email: string;
    status: 'active' | 'inactive' | 'maintenance';
    capacity: number;
    occupancy: number; // calculated percentage
    revenue: number; // current month
    defaultShiftMorning: { start: string; end: string };
    defaultShiftEvening: { start: string; end: string };
}

export type ShiftType = 'morning' | 'evening' | 'hybrid';

export interface Student {
    id: string;
    smartId: string; // e.g. LIB001
    name: string;
    email?: string;
    phone: string;
    parentPhone?: string;
    photoUrl?: string;
    college?: string;
    address?: string;
    branchId: string;
    joiningDate: string;
    status: 'active' | 'expired' | 'inactive';
    currentPlanId?: string;
    seatId?: number;
    shiftType?: ShiftType;
    customSlots?: { day: string; start: string; end: string }[];
    lockerId?: number;
    trustScore?: number; // 0-5
}

export interface Seat {
    id: number;
    branchId: string;
    label: string; // e.g. A1, B2
    status: 'available' | 'occupied' | 'maintenance';
    currentStudentId?: string;
    notes?: string;
}

export interface Enquiry {
    id: string;
    branchId: string;
    name: string;
    phone: string;
    email?: string;
    source: 'walk_in' | 'google_ads' | 'facebook' | 'referral' | 'other';
    status: 'new' | 'visited' | 'interested' | 'converted' | 'lost';
    assignedTo?: string; // staff user id
    createdAt: string;
    nextFollowUp?: string;
    notes?: string;
}

export interface Payment {
    id: string;
    studentId: string;
    amount: number;
    type: 'fee' | 'deposit' | 'other';
    status: 'paid' | 'pending' | 'failed';
    method: 'cash' | 'upi' | 'card' | 'bank_transfer';
    transactionId?: string;
    date: string;
    invoiceUrl?: string;
}

export interface Stats {
    totalBranches: number;
    totalUsers: number;
    totalStudents: number;
    totalRevenue: number;
    activeServices: number;
    systemHealth: string;
}
