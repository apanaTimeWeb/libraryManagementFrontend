import { User, Branch, Student, Seat, Enquiry, Payment, Role, ShiftType } from './types/index';
import { addDays, subDays, format } from 'date-fns';

// --- Constants ---
export const ROLES: Role[] = ['superadmin', 'owner', 'manager', 'staff'];

// --- Mock Data: Users ---
export const users: User[] = [
    {
        id: 'usr-sa-001',
        name: 'Vikram Malware',
        email: 'admin@smartlibrary.com',
        phone: '+919999999999',
        role: 'superadmin',
        permissions: ['all'],
        isActive: true,
        avatarUrl: 'https://i.pravatar.cc/150?u=admin',
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'usr-own-001',
        name: 'Rajesh Owner',
        email: 'owner@delhi.com',
        phone: '+919876543210',
        role: 'owner',
        branchId: 'br-del-001',
        permissions: ['branch_full'],
        isActive: true,
    },
    {
        id: 'usr-mgr-001',
        name: 'Suresh Manager',
        email: 'manager@delhi.com',
        phone: '+919876543211',
        role: 'manager',
        branchId: 'br-del-001',
        permissions: ['manage_students', 'collect_fees'],
        isActive: true,
    },
    {
        id: 'usr-stf-001',
        name: 'Ramesh Staff',
        email: 'staff@delhi.com',
        phone: '+919876543212',
        role: 'staff',
        branchId: 'br-del-001',
        permissions: ['attendance', 'basic_ops'],
        isActive: true,
    }
];

// --- Mock Data: Branches ---
export const branches: Branch[] = [
    {
        id: 'br-del-001',
        name: 'Delhi Main Branch',
        city: 'Delhi',
        address: 'Cp, New Delhi',
        managerId: 'usr-mgr-001',
        contactNumber: '+911122334455',
        email: 'delhi@smartlibrary.com',
        status: 'active',
        capacity: 100,
        occupancy: 85,
        revenue: 450000,
        defaultShiftMorning: { start: '08:00', end: '14:00' },
        defaultShiftEvening: { start: '14:00', end: '20:00' },
    },
    {
        id: 'br-mum-001',
        name: 'Mumbai South',
        city: 'Mumbai',
        address: 'Colaba, Mumbai',
        contactNumber: '+912233445566',
        email: 'mumbai@smartlibrary.com',
        status: 'active',
        capacity: 150,
        occupancy: 70,
        revenue: 600000,
        defaultShiftMorning: { start: '07:00', end: '15:00' },
        defaultShiftEvening: { start: '15:00', end: '22:00' },
    },
    // ... more branches would be here
];

// --- Generators ---

const generateStudents = (count: number): Student[] => {
    const students: Student[] = [];
    for (let i = 0; i < count; i++) {
        const id = `stu-${i + 1}`;
        const isActive = Math.random() > 0.1;
        students.push({
            id,
            smartId: `LIB${1000 + i}`,
            name: `Student ${i + 1}`,
            email: `student${i + 1}@example.com`,
            phone: `+9190000${10000 + i}`,
            branchId: 'br-del-001',
            joiningDate: subDays(new Date(), Math.floor(Math.random() * 365)).toISOString(),
            status: isActive ? 'active' : 'inactive',
            shiftType: Math.random() > 0.5 ? 'morning' : 'evening',
            seatId: isActive ? i + 1 : undefined,
            trustScore: Math.floor(Math.random() * 5) + 1,
        });
    }
    return students;
};

export const students = generateStudents(200);

const generateSeats = (count: number): Seat[] => {
    const seats: Seat[] = [];
    for (let i = 0; i < count; i++) {
        const isOccupied = Math.random() > 0.3;
        seats.push({
            id: i + 1,
            branchId: 'br-del-001',
            label: `S-${i + 1}`,
            status: isOccupied ? 'occupied' : 'available',
            currentStudentId: isOccupied ? `stu-${i + 1}` : undefined,
        });
    }
    return seats;
};

export const seats = generateSeats(150);

const generatePayments = (count: number): Payment[] => {
    const payments: Payment[] = [];
    for (let i = 0; i < count; i++) {
        payments.push({
            id: `pay-${i + 1}`,
            studentId: `stu-${Math.floor(Math.random() * 200) + 1}`,
            amount: Math.floor(Math.random() * 1000) + 500,
            type: 'fee',
            status: Math.random() > 0.1 ? 'paid' : 'pending',
            method: 'upi',
            date: subDays(new Date(), Math.floor(Math.random() * 30)).toISOString(),
        });
    }
    return payments;
};

export const payments = generatePayments(100);

// --- Mock Enquiries ---
export const enquiries: Enquiry[] = [
    {
        id: 'enq-001',
        branchId: 'br-del-001',
        name: 'New Enquiry User',
        phone: '+919988776655',
        source: 'walk_in',
        status: 'new',
        createdAt: new Date().toISOString(),
        notes: 'Looking for a quiet seat.',
    },
    // Add more as needed
];
