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
    createdAt?: string;
}

export interface Branch {
    id: string;
    name: string;
    city: string;
    address: string;
    pincode?: string;
    managerId?: string;
    contactNumber: string;
    email: string;
    ownerName?: string;
    gstNumber?: string;
    panNumber?: string;
    status: 'active' | 'inactive' | 'maintenance';
    capacity: number;
    occupancy: number; // calculated percentage
    revenue: number; // current month
    monthlyRent?: number;
    operationalSince?: string;
    defaultShiftMorning: { start: string; end: string };
    defaultShiftEvening: { start: string; end: string };
    createdAt?: string;
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
    referredBy?: string; // student id
    familyId?: string;
}

export interface Seat {
    id: number;
    branchId: string;
    label: string; // e.g. A1, B2
    status: 'available' | 'occupied' | 'maintenance' | 'expiring';
    currentStudentId?: string;
    expiryDate?: string;
    notes?: string;
}

export interface Enquiry {
    id: string;
    branchId: string;
    name: string;
    phone: string;
    email?: string;
    source: 'walk_in' | 'google_ads' | 'facebook' | 'referral' | 'website' | 'other';
    status: 'new' | 'visited' | 'interested' | 'converted' | 'lost';
    assignedTo?: string; // staff user id
    createdAt: string;
    nextFollowUp?: string;
    notes?: string;
    preferredShift?: ShiftType | 'flexible';
    interestedIn?: string;
}

export interface Payment {
    id: string;
    studentId: string;
    branchId: string;
    amount: number;
    type: 'fee' | 'deposit' | 'fine' | 'other';
    status: 'paid' | 'pending' | 'failed' | 'partial';
    method: 'cash' | 'upi' | 'card' | 'bank_transfer';
    transactionId?: string;
    date: string;
    invoiceUrl?: string;
    collectedBy?: string; // user id
}

export interface FamilyRelation {
    id: string;
    guardianStudentId: string;
    dependentStudentId: string;
    relationship: 'brother' | 'sister' | 'cousin' | 'parent' | 'other';
    isGuardian: boolean; // for attendance
}

export interface PaymentPromise {
    id: string;
    studentId: string;
    branchId: string;
    amount: number;
    promisedDate: string;
    actualDate?: string;
    fulfilled: boolean;
    trustScore: number; // 1-5
    notes?: string;
    createdAt: string;
}

export interface Complaint {
    id: string;
    branchId: string;
    studentId?: string;
    title: string;
    description: string;
    category: 'infrastructure' | 'staff' | 'cleanliness' | 'noise' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string;
    resolution?: string;
    createdAt: string;
    resolvedAt?: string;
}

export interface Notice {
    id: string;
    branchId?: string; // null for system-wide
    title: string;
    message: string;
    type: 'info' | 'warning' | 'urgent' | 'announcement';
    targetAudience: 'all' | 'students' | 'staff' | 'specific';
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    createdBy: string; // user id
    createdAt: string;
}

export interface Coupon {
    id: string;
    code: string;
    discount: number; // amount or percentage
    discountType: 'fixed' | 'percentage';
    validFrom: string;
    validTill: string;
    maxUses: number;
    usedCount: number;
    applicablePlans?: string[];
    isActive: boolean;
}

export interface Asset {
    id: string;
    branchId: string;
    name: string;
    category: 'furniture' | 'electronics' | 'infrastructure' | 'other';
    purchaseDate: string;
    purchasePrice: number;
    currentValue: number;
    status: 'active' | 'maintenance' | 'retired';
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
    notes?: string;
}

export interface MaintenanceLog {
    id: string;
    assetId: string;
    date: string;
    type: 'routine' | 'repair' | 'replacement';
    cost: number;
    performedBy: string;
    notes: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userRole: Role;
    action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view';
    entityType: 'user' | 'student' | 'branch' | 'payment' | 'seat' | 'setting' | 'other';
    entityId?: string;
    changes?: {
        field: string;
        oldValue: any;
        newValue: any;
    }[];
    ipAddress: string;
    device: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Plan {
    id: string;
    name: string;
    duration: 'daily' | 'monthly' | 'quarterly' | 'yearly';
    price: number;
    features: string[];
    isActive: boolean;
}

export interface Subscription {
    id: string;
    studentId: string;
    planId: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'expiring' | 'expired';
    autoRenew: boolean;
}

export interface Stats {
    totalBranches: number;
    totalUsers: number;
    totalStudents: number;
    totalRevenue: number;
    activeServices: number;
    systemHealth: string;
}
