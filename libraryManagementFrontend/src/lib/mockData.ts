import {
    User, Branch, Student, Seat, Enquiry, Payment, Role, ShiftType,
    FamilyRelation, PaymentPromise, Complaint, Notice, Coupon, Asset,
    MaintenanceLog, AuditLog, Plan, Subscription
} from './types/index';
import { subDays, addDays, format, subMonths } from 'date-fns';

// --- Constants ---
export const ROLES: Role[] = ['superadmin', 'owner', 'manager', 'staff'];

// --- Helper Functions ---
const generateId = (prefix: string, index: number) => `${prefix}-${String(index).padStart(3, '0')}`;

// --- Mock Data: Users (4 SuperAdmins, 3 Owners, 8 Managers, 15 Staff) ---
export const users: User[] = [
    // 4 SuperAdmins
    {
        id: 'usr-sa-001',
        name: 'Vikram Malhotra',
        email: 'admin@smartlibrary.com',
        phone: '+919999999999',
        role: 'superadmin',
        permissions: ['all'],
        isActive: true,
        avatarUrl: 'https://i.pravatar.cc/150?u=admin',
        lastLogin: new Date().toISOString(),
        createdAt: subMonths(new Date(), 24).toISOString(),
    },
    {
        id: 'usr-sa-002',
        name: 'Priya Sharma',
        email: 'priya.admin@smartlibrary.com',
        phone: '+919999999998',
        role: 'superadmin',
        permissions: ['all'],
        isActive: true,
        avatarUrl: 'https://i.pravatar.cc/150?u=priya',
        lastLogin: subDays(new Date(), 1).toISOString(),
        createdAt: subMonths(new Date(), 18).toISOString(),
    },
    {
        id: 'usr-sa-003',
        name: 'Rahul Verma',
        email: 'rahul.admin@smartlibrary.com',
        phone: '+919999999997',
        role: 'superadmin',
        permissions: ['all', 'system_settings', 'user_management'],
        isActive: true,
        lastLogin: subDays(new Date(), 3).toISOString(),
        createdAt: subMonths(new Date(), 12).toISOString(),
    },
    {
        id: 'usr-sa-004',
        name: 'Anjali Singh',
        email: 'anjali.admin@smartlibrary.com',
        phone: '+919999999996',
        role: 'superadmin',
        permissions: ['all', 'branch_management'],
        isActive: false, // Inactive superadmin for testing
        lastLogin: subDays(new Date(), 30).toISOString(),
        createdAt: subMonths(new Date(), 6).toISOString(),
    },
    // 3 Owners
    {
        id: 'usr-own-001',
        name: 'Rajesh Kumar',
        email: 'owner@delhi.com',
        phone: '+919876543210',
        role: 'owner',
        branchId: 'br-del-001',
        permissions: ['branch_full', 'create_managers', 'view_financials'],
        isActive: true,
        avatarUrl: 'https://i.pravatar.cc/150?u=rajesh',
        lastLogin: new Date().toISOString(),
        createdAt: subMonths(new Date(), 20).toISOString(),
    },
    {
        id: 'usr-own-002',
        name: 'Sunita Desai',
        email: 'owner@mumbai.com',
        phone: '+919876543211',
        role: 'owner',
        branchId: 'br-mum-001',
        permissions: ['branch_full', 'create_managers', 'view_financials'],
        isActive: true,
        avatarUrl: 'https://i.pravatar.cc/150?u=sunita',
        lastLogin: subDays(new Date(), 1).toISOString(),
        createdAt: subMonths(new Date(), 18).toISOString(),
    },
    {
        id: 'usr-own-003',
        name: 'Amit Patel',
        email: 'owner@bangalore.com',
        phone: '+919876543212',
        role: 'owner',
        branchId: 'br-blr-001',
        permissions: ['branch_full', 'create_managers'],
        isActive: true,
        lastLogin: subDays(new Date(), 2).toISOString(),
        createdAt: subMonths(new Date(), 15).toISOString(),
    },
    // 8 Managers
    {
        id: 'usr-mgr-001',
        name: 'Suresh Reddy',
        email: 'manager@delhi.com',
        phone: '+919876543213',
        role: 'manager',
        branchId: 'br-del-001',
        permissions: ['manage_students', 'collect_fees', 'view_reports'],
        isActive: true,
        avatarUrl: 'https://i.pravatar.cc/150?u=suresh',
        lastLogin: new Date().toISOString(),
        createdAt: subMonths(new Date(), 14).toISOString(),
    },
    {
        id: 'usr-mgr-002',
        name: 'Kavita Rao',
        email: 'manager@mumbai.com',
        phone: '+919876543214',
        role: 'manager',
        branchId: 'br-mum-001',
        permissions: ['manage_students', 'collect_fees', 'manage_attendance'],
        isActive: true,
        lastLogin: subDays(new Date(), 1).toISOString(),
        createdAt: subMonths(new Date(), 12).toISOString(),
    },
    {
        id: 'usr-mgr-003',
        name: 'Rohit Gupta',
        email: 'manager@bangalore.com',
        phone: '+919876543215',
        role: 'manager',
        branchId: 'br-blr-001',
        permissions: ['manage_students', 'collect_fees'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: subMonths(new Date(), 10).toISOString(),
    },
    {
        id: 'usr-mgr-004',
        name: 'Deepa Nair',
        email: 'manager@kolkata.com',
        phone: '+919876543216',
        role: 'manager',
        branchId: 'br-kol-001',
        permissions: ['manage_students', 'manage_attendance'],
        isActive: true,
        lastLogin: subDays(new Date(), 2).toISOString(),
        createdAt: subMonths(new Date(), 8).toISOString(),
    },
    {
        id: 'usr-mgr-005',
        name: 'Arjun Mehta',
        email: 'manager@pune.com',
        phone: '+919876543217',
        role: 'manager',
        branchId: 'br-pun-001',
        permissions: ['manage_students', 'collect_fees'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: subMonths(new Date(), 7).toISOString(),
    },
    {
        id: 'usr-mgr-006',
        name: 'Sneha Iyer',
        email: 'manager@hyderabad.com',
        phone: '+919876543218',
        role: 'manager',
        branchId: 'br-hyd-001',
        permissions: ['manage_students', 'collect_fees', 'view_reports'],
        isActive: true,
        lastLogin: subDays(new Date(), 1).toISOString(),
        createdAt: subMonths(new Date(), 6).toISOString(),
    },
    {
        id: 'usr-mgr-007',
        name: 'Karthik Pillai',
        email: 'manager@chennai.com',
        phone: '+919876543219',
        role: 'manager',
        branchId: 'br-che-001',
        permissions: ['manage_students', 'manage_attendance'],
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: subMonths(new Date(), 5).toISOString(),
    },
    {
        id: 'usr-mgr-008',
        name: 'Neha Shah',
        email: 'manager@ahmedabad.com',
        phone: '+919876543220',
        role: 'manager',
        branchId: 'br-ahm-001',
        permissions: ['manage_students', 'collect_fees'],
        isActive: true,
        lastLogin: subDays(new Date(), 1).toISOString(),
        createdAt: subMonths(new Date(), 4).toISOString(),
    },
    // 15 Staff Members
    ...Array.from({ length: 15 }, (_, i) => ({
        id: generateId('usr-stf', i + 1),
        name: `Staff Member ${i + 1}`,
        email: `staff${i + 1}@smartlibrary.com`,
        phone: `+9198765432${String(i + 21).padStart(2, '0')}`,
        role: 'staff' as Role,
        branchId: ['br-del-001', 'br-mum-001', 'br-blr-001', 'br-kol-001', 'br-pun-001'][i % 5],
        permissions: ['attendance', 'basic_ops', 'view_students'],
        isActive: i < 13, // 2 inactive staff
        lastLogin: subDays(new Date(), Math.floor(Math.random() * 7)).toISOString(),
        createdAt: subMonths(new Date(), Math.floor(Math.random() * 12) + 1).toISOString(),
    }))
];

// --- Mock Data: Branches (8 branches across different cities) ---
export const branches: Branch[] = [
    {
        id: 'br-del-001',
        name: 'Smart Library - Connaught Place',
        city: 'Delhi',
        address: '1st Floor, Connaught Place, New Delhi - 110001',
        pincode: '110001',
        managerId: 'usr-mgr-001',
        contactNumber: '+911123456789',
        email: 'delhi@smartlibrary.com',
        ownerName: 'Rajesh Kumar',
        gstNumber: '07AAACH7409R1ZN',
        panNumber: 'AAACH7409R',
        status: 'active',
        capacity: 100,
        occupancy: 87,
        revenue: 456700,
        monthlyRent: 80000,
        operationalSince: '2022-01-15',
        defaultShiftMorning: { start: '06:00', end: '14:00' },
        defaultShiftEvening: { start: '14:00', end: '22:00' },
        createdAt: subMonths(new Date(), 20).toISOString(),
    },
    {
        id: 'br-mum-001',
        name: 'Smart Library - Colaba',
        city: 'Mumbai',
        address: 'Ground Floor, Colaba Causeway, Mumbai - 400001',
        pincode: '400001',
        managerId: 'usr-mgr-002',
        contactNumber: '+912233445566',
        email: 'mumbai@smartlibrary.com',
        ownerName: 'Sunita Desai',
        gstNumber: '27AAACM1234A1Z5',
        panNumber: 'AAACM1234A',
        status: 'active',
        capacity: 150,
        occupancy: 82,
        revenue: 389200,
        monthlyRent: 120000,
        operationalSince: '2022-03-20',
        defaultShiftMorning: { start: '07:00', end: '15:00' },
        defaultShiftEvening: { start: '15:00', end: '23:00' },
        createdAt: subMonths(new Date(), 18).toISOString(),
    },
    {
        id: 'br-blr-001',
        name: 'Smart Library - Koramangala',
        city: 'Bangalore',
        address: '2nd Floor, Koramangala, Bangalore - 560095',
        pincode: '560095',
        managerId: 'usr-mgr-003',
        contactNumber: '+918033445566',
        email: 'bangalore@smartlibrary.com',
        ownerName: 'Amit Patel',
        gstNumber: '29AABCB1234C1Z6',
        panNumber: 'AABCB1234C',
        status: 'active',
        capacity: 120,
        occupancy: 78,
        revenue: 298500,
        monthlyRent: 95000,
        operationalSince: '2022-06-10',
        defaultShiftMorning: { start: '06:00', end: '14:00' },
        defaultShiftEvening: { start: '14:00', end: '22:00' },
        createdAt: subMonths(new Date(), 15).toISOString(),
    },
    {
        id: 'br-kol-001',
        name: 'Smart Library - Park Street',
        city: 'Kolkata',
        address: 'Park Street, Kolkata - 700016',
        pincode: '700016',
        managerId: 'usr-mgr-004',
        contactNumber: '+913344556677',
        email: 'kolkata@smartlibrary.com',
        status: 'active',
        capacity: 80,
        occupancy: 65,
        revenue: 156800,
        monthlyRent: 60000,
        operationalSince: '2022-09-01',
        defaultShiftMorning: { start: '07:00', end: '15:00' },
        defaultShiftEvening: { start: '15:00', end: '21:00' },
        createdAt: subMonths(new Date(), 12).toISOString(),
    },
    {
        id: 'br-pun-001',
        name: 'Smart Library - FC Road',
        city: 'Pune',
        address: 'Fergusson College Road, Pune - 411004',
        pincode: '411004',
        managerId: 'usr-mgr-005',
        contactNumber: '+912044556677',
        email: 'pune@smartlibrary.com',
        status: 'active',
        capacity: 90,
        occupancy: 72,
        revenue: 245000,
        monthlyRent: 70000,
        operationalSince: '2022-11-15',
        defaultShiftMorning: { start: '06:00', end: '14:00' },
        defaultShiftEvening: { start: '14:00', end: '22:00' },
        createdAt: subMonths(new Date(), 10).toISOString(),
    },
    {
        id: 'br-hyd-001',
        name: 'Smart Library - Hitech City',
        city: 'Hyderabad',
        address: 'Hitech City, Hyderabad - 500081',
        pincode: '500081',
        managerId: 'usr-mgr-006',
        contactNumber: '+914044556677',
        email: 'hyderabad@smartlibrary.com',
        status: 'active',
        capacity: 110,
        occupancy: 75,
        revenue: 312000,
        monthlyRent: 85000,
        operationalSince: '2023-01-20',
        defaultShiftMorning: { start: '06:00', end: '14:00' },
        defaultShiftEvening: { start: '14:00', end: '22:00' },
        createdAt: subMonths(new Date(), 8).toISOString(),
    },
    {
        id: 'br-che-001',
        name: 'Smart Library - T Nagar',
        city: 'Chennai',
        address: 'T Nagar, Chennai - 600017',
        pincode: '600017',
        managerId: 'usr-mgr-007',
        contactNumber: '+914444556677',
        email: 'chennai@smartlibrary.com',
        status: 'active',
        capacity: 100,
        occupancy: 68,
        revenue: 198000,
        monthlyRent: 75000,
        operationalSince: '2023-03-10',
        defaultShiftMorning: { start: '06:30', end: '14:30' },
        defaultShiftEvening: { start: '14:30', end: '21:30' },
        createdAt: subMonths(new Date(), 6).toISOString(),
    },
    {
        id: 'br-ahm-001',
        name: 'Smart Library - Satellite',
        city: 'Ahmedabad',
        address: 'Satellite Road, Ahmedabad - 380015',
        pincode: '380015',
        managerId: 'usr-mgr-008',
        contactNumber: '+917944556677',
        email: 'ahmedabad@smartlibrary.com',
        status: 'active',
        capacity: 85,
        occupancy: 70,
        revenue: 178500,
        monthlyRent: 65000,
        operationalSince: '2023-05-01',
        defaultShiftMorning: { start: '06:00', end: '14:00' },
        defaultShiftEvening: { start: '14:00', end: '22:00' },
        createdAt: subMonths(new Date(), 4).toISOString(),
    },
];

// --- Mock Data: 250+ Students ---
const generateStudents = (count: number): Student[] => {
    const students: Student[] = [];
    const firstNames = ['Amit', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Kavita', 'Arjun', 'Deepa', 'Karthik', 'Neha', 'Suresh', 'Pooja', 'Rajesh'];
    const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Reddy', 'Gupta', 'Nair', 'Iyer', 'Verma', 'Rao', 'Desai', 'Shah', 'Mehta', 'Pillai'];
    const colleges = ['Delhi University', 'Mumbai University', 'IIT Bombay', 'Christ University', 'Jadavpur University', 'Pune University', 'Osmania University', 'Anna University', 'Gujarat University'];
    const branchIds = branches.map(b => b.id);

    for (let i = 0; i < count; i++) {
        const branchId = branchIds[i % branchIds.length];
        const isActive = Math.random() > 0.15; // 85% active
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName} ${i}`;
        const shiftTypes: ShiftType[] = ['morning', 'evening', 'hybrid'];
        const shiftType = shiftTypes[Math.floor(Math.random() * 3)];

        students.push({
            id: generateId('stu', i + 1),
            smartId: `LIB${String(i + 1001).padStart(4, '0')}`,
            name,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
            phone: `+91${9000000000 + i}`,
            parentPhone: Math.random() > 0.3 ? `+91${8000000000 + i}` : undefined,
            photoUrl: `https://i.pravatar.cc/150?u=${name}`,
            college: colleges[Math.floor(Math.random() * colleges.length)],
            address: `House ${i + 1}, Street ${Math.floor(i / 10) + 1}, ${branches.find(b => b.id === branchId)?.city}`,
            branchId,
            joiningDate: subDays(new Date(), Math.floor(Math.random() * 365)).toISOString(),
            status: isActive ? 'active' : (Math.random() > 0.5 ? 'expired' : 'inactive'),
            shiftType,
            seatId: isActive ? (i % 150) + 1 : undefined,
            trustScore: Math.floor(Math.random() * 5) + 1,
            referredBy: i > 20 && Math.random() > 0.7 ? generateId('stu', Math.floor(Math.random() * i)) : undefined,
            familyId: i > 10 && Math.random() > 0.8 ? `fam-${Math.floor(i / 5)}` : undefined,
        });
    }
    return students;
};

export const students = generateStudents(500);

// --- Mock Data: 150 Seats ---
const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const branchIds = branches.map(b => b.id);
    let seatCounter = 1;

    branchIds.forEach((branchId, branchIndex) => {
        const branchCapacity = branches[branchIndex].capacity;
        for (let i = 0; i < branchCapacity && seatCounter <= 800; i++) {
            const row = String.fromCharCode(65 + Math.floor(i / 10)); // A, B, C...
            const col = (i % 10) + 1;
            const isOccupied = Math.random() > 0.3;
            const isMaintenance = !isOccupied && Math.random() > 0.95;
            const isExpiring = isOccupied && Math.random() > 0.9;

            seats.push({
                id: seatCounter,
                branchId,
                label: `${row}-${String(col).padStart(2, '0')}`,
                status: isMaintenance ? 'maintenance' : (isExpiring ? 'expiring' : (isOccupied ? 'occupied' : 'available')),
                currentStudentId: isOccupied ? students.find(s => s.branchId === branchId && s.seatId === seatCounter)?.id : undefined,
                expiryDate: isExpiring ? addDays(new Date(), Math.floor(Math.random() * 3)).toISOString() : undefined,
                notes: isMaintenance ? 'Under maintenance' : undefined,
            });
            seatCounter++;
        }
    });

    return seats.slice(0, 800); // Limit to 800 seats total
};

export const seats = generateSeats();

// --- Mock Data: 100+ Payments ---
const generatePayments = (count: number): Payment[] => {
    const payments: Payment[] = [];
    const methods: Payment['method'][] = ['cash', 'upi', 'card', 'bank_transfer'];
    const types: Payment['type'][] = ['fee', 'deposit', 'fine'];

    for (let i = 0; i < count; i++) {
        const student = students[Math.floor(Math.random() * students.length)];
        const method = methods[Math.floor(Math.random() * methods.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const isPaid = Math.random() > 0.15;

        payments.push({
            id: generateId('pay', i + 1),
            studentId: student.id,
            branchId: student.branchId,
            amount: type === 'deposit' ? 500 : (Math.floor(Math.random() * 1000) + 800),
            type,
            status: isPaid ? 'paid' : (Math.random() > 0.5 ? 'pending' : 'partial'),
            method,
            transactionId: method !== 'cash' ? `TXN${Date.now()}${i}` : undefined,
            date: subDays(new Date(), Math.floor(Math.random() * 60)).toISOString(),
            collectedBy: users.filter(u => u.role === 'staff' || u.role === 'manager')[Math.floor(Math.random() * 20)]?.id,
        });
    }
    return payments;
};

export const payments = generatePayments(1000);

// --- Mock Data: 50+ Enquiries ---
const generateEnquiries = (count: number): Enquiry[] => {
    const enquiries: Enquiry[] = [];
    const sources: Enquiry['source'][] = ['walk_in', 'google_ads', 'facebook', 'referral', 'website'];
    const statuses: Enquiry['status'][] = ['new', 'visited', 'interested', 'converted', 'lost'];
    const names = ['Aditya Verma', 'Ritu Singh', 'Manish Gupta', 'Shweta Patel', 'Vishal Kumar', 'Divya Reddy'];

    for (let i = 0; i < count; i++) {
        const branch = branches[Math.floor(Math.random() * branches.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        enquiries.push({
            id: generateId('enq', i + 1),
            branchId: branch.id,
            name: names[Math.floor(Math.random() * names.length)] + ` ${i}`,
            phone: `+91${9900000000 + i}`,
            email: Math.random() > 0.3 ? `enquiry${i}@gmail.com` : undefined,
            source: sources[Math.floor(Math.random() * sources.length)],
            status,
            assignedTo: users.filter(u => u.branchId === branch.id && (u.role === 'staff' || u.role === 'manager'))[0]?.id,
            createdAt: subDays(new Date(), Math.floor(Math.random() * 90)).toISOString(),
            nextFollowUp: status !== 'converted' && status !== 'lost' ? addDays(new Date(), Math.floor(Math.random() * 5)).toISOString() : undefined,
            notes: `Interested in ${['morning', 'evening', 'flexible'][Math.floor(Math.random() * 3)]} shift`,
            preferredShift: ['morning', 'evening', 'flexible'][Math.floor(Math.random() * 3)] as any,
            interestedIn: ['monthly_plan', 'quarterly_plan', 'daily_pass'][Math.floor(Math.random() * 3)],
        });
    }
    return enquiries;
};

export const enquiries = generateEnquiries(55);

// --- Mock Data: 30+ Family Relationships ---
export const familyRelations: FamilyRelation[] = Array.from({ length: 35 }, (_, i) => ({
    id: generateId('fam', i + 1),
    guardianStudentId: students[i * 2]?.id || students[0].id,
    dependentStudentId: students[i * 2 + 1]?.id || students[1].id,
    relationship: (['brother', 'sister', 'cousin'] as const)[Math.floor(Math.random() * 3)],
    isGuardian: Math.random() > 0.5,
}));

// --- Mock Data: 25+ Payment Promises (PTP) ---
export const paymentPromises: PaymentPromise[] = Array.from({ length: 28 }, (_, i) => {
    const student = students[i];
    const fulfilled = Math.random() > 0.4;
    const promisedDate = subDays(new Date(), Math.floor(Math.random() * 30));

    return {
        id: generateId('ptp', i + 1),
        studentId: student.id,
        branchId: student.branchId,
        amount: Math.floor(Math.random() * 2000) + 500,
        promisedDate: promisedDate.toISOString(),
        actualDate: fulfilled ? addDays(promisedDate, Math.floor(Math.random() * 5)).toISOString() : undefined,
        fulfilled,
        trustScore: Math.floor(Math.random() * 5) + 1,
        notes: fulfilled ? 'Paid on time' : 'Pending payment',
        createdAt: subDays(new Date(), Math.floor(Math.random() * 60)).toISOString(),
    };
});

// --- Mock Data: 20+ Complaints ---
export const complaints: Complaint[] = Array.from({ length: 24 }, (_, i) => {
    const branch = branches[i % branches.length];
    const student = students.find(s => s.branchId === branch.id);
    const isResolved = Math.random() > 0.3;

    return {
        id: generateId('cmp', i + 1),
        branchId: branch.id,
        studentId: student?.id,
        title: ['Noise issue', 'AC not working', 'Cleanliness concern', 'WiFi connectivity', 'Seat comfort'][i % 5],
        description: `Detailed description of the complaint ${i + 1}`,
        category: (['infrastructure', 'staff', 'cleanliness', 'noise'] as const)[Math.floor(Math.random() * 4)],
        priority: (['low', 'medium', 'high', 'urgent'] as const)[Math.floor(Math.random() * 4)],
        status: isResolved ? 'resolved' : (['open', 'in_progress'] as const)[Math.floor(Math.random() * 2)],
        assignedTo: users.find(u => u.branchId === branch.id && u.role === 'manager')?.id,
        resolution: isResolved ? 'Issue resolved successfully' : undefined,
        createdAt: subDays(new Date(), Math.floor(Math.random() * 45)).toISOString(),
        resolvedAt: isResolved ? subDays(new Date(), Math.floor(Math.random() * 10)).toISOString() : undefined,
    };
});

// --- Mock Data: 15+ Notices ---
export const notices: Notice[] = Array.from({ length: 18 }, (_, i) => {
    const branch = i < 10 ? branches[i % branches.length] : undefined;

    return {
        id: generateId('not', i + 1),
        branchId: branch?.id,
        title: ['Holiday Notice', 'Fee Reminder', 'New Timings', 'Maintenance Alert', 'Important Announcement'][i % 5],
        message: `This is the detailed message for notice ${i + 1}. Please take note of the information provided.`,
        type: (['info', 'warning', 'urgent', 'announcement'] as const)[Math.floor(Math.random() * 4)],
        targetAudience: (['all', 'students', 'staff'] as const)[Math.floor(Math.random() * 3)],
        sentCount: Math.floor(Math.random() * 100) + 50,
        deliveredCount: Math.floor(Math.random() * 90) + 40,
        readCount: Math.floor(Math.random() * 70) + 30,
        createdBy: users.filter(u => u.role === 'manager' || u.role === 'owner')[Math.floor(Math.random() * 10)]?.id || users[0].id,
        createdAt: subDays(new Date(), Math.floor(Math.random() * 30)).toISOString(),
    };
});

// --- Mock Data: 10+ Coupons ---
export const coupons: Coupon[] = Array.from({ length: 12 }, (_, i) => {
    const isActive = Math.random() > 0.3;

    return {
        id: generateId('cpn', i + 1),
        code: `SAVE${(i + 1) * 10}`,
        discount: i % 2 === 0 ? (i + 1) * 100 : (i + 1) * 5,
        discountType: i % 2 === 0 ? 'fixed' : 'percentage',
        validFrom: subDays(new Date(), 30).toISOString(),
        validTill: addDays(new Date(), Math.floor(Math.random() * 60) + 30).toISOString(),
        maxUses: (i + 1) * 10,
        usedCount: Math.floor(Math.random() * (i + 1) * 8),
        isActive,
    };
});

// --- Mock Data: 8+ Assets ---
export const assets: Asset[] = Array.from({ length: 12 }, (_, i) => {
    const branch = branches[i % branches.length];
    const categories: Asset['category'][] = ['furniture', 'electronics', 'infrastructure'];

    return {
        id: generateId('ast', i + 1),
        branchId: branch.id,
        name: ['Study Table', 'Chair', 'AC Unit', 'WiFi Router', 'CCTV Camera', 'Water Purifier'][i % 6],
        category: categories[Math.floor(Math.random() * categories.length)],
        purchaseDate: subMonths(new Date(), Math.floor(Math.random() * 24) + 1).toISOString(),
        purchasePrice: Math.floor(Math.random() * 50000) + 5000,
        currentValue: Math.floor(Math.random() * 30000) + 3000,
        status: (['active', 'maintenance'] as const)[Math.floor(Math.random() * 2)],
        lastMaintenanceDate: subDays(new Date(), Math.floor(Math.random() * 90)).toISOString(),
        nextMaintenanceDate: addDays(new Date(), Math.floor(Math.random() * 90) + 30).toISOString(),
        notes: `Asset condition: ${['Good', 'Fair', 'Excellent'][Math.floor(Math.random() * 3)]}`,
    };
});

// --- Mock Data: Maintenance Logs ---
export const maintenanceLogs: MaintenanceLog[] = Array.from({ length: 25 }, (_, i) => ({
    id: generateId('mnt', i + 1),
    assetId: assets[i % assets.length].id,
    date: subDays(new Date(), Math.floor(Math.random() * 180)).toISOString(),
    type: (['routine', 'repair', 'replacement'] as const)[Math.floor(Math.random() * 3)],
    cost: Math.floor(Math.random() * 5000) + 500,
    performedBy: `Technician ${i % 5 + 1}`,
    notes: `Maintenance completed successfully for item ${i + 1}`,
}));

export const auditLogs: AuditLog[] = Array.from({ length: 2000 }, (_, i) => {
    const user = users[i % users.length];
    const actions: AuditLog['action'][] = ['create', 'update', 'delete', 'login', 'logout', 'view'];
    const entityTypes: AuditLog['entityType'][] = ['user', 'student', 'branch', 'payment', 'seat', 'setting'];

    return {
        id: generateId('log', i + 1),
        timestamp: subDays(new Date(), Math.floor(Math.random() * 30)).toISOString(),
        userId: user.id,
        userRole: user.role,
        action: actions[Math.floor(Math.random() * actions.length)],
        entityType: entityTypes[Math.floor(Math.random() * entityTypes.length)],
        entityId: generateId('ent', i + 1),
        changes: i % 3 === 0 ? [
            { field: 'status', oldValue: 'inactive', newValue: 'active' },
            { field: 'amount', oldValue: 1000, newValue: 1200 },
        ] : undefined,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        device: ['Chrome/Windows', 'Safari/Mac', 'Firefox/Linux', 'Edge/Windows'][i % 4],
        severity: (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)],
    };
});

// --- Mock Data: Plans ---
export const plans: Plan[] = [
    {
        id: 'pln-001',
        name: 'Daily Pass',
        duration: 'daily',
        price: 100,
        features: ['Basic seating', 'WiFi access', '8 hours'],
        isActive: true,
    },
    {
        id: 'pln-002',
        name: 'Monthly Basic',
        duration: 'monthly',
        price: 800,
        features: ['Dedicated seat', 'WiFi access', 'All day access', 'Locker (₹100 extra)'],
        isActive: true,
    },
    {
        id: 'pln-003',
        name: 'Monthly Premium',
        duration: 'monthly',
        price: 1200,
        features: ['Dedicated seat', 'WiFi access', 'All day access', 'Free locker', 'AC seating', 'Printing credits'],
        isActive: true,
    },
    {
        id: 'pln-004',
        name: 'Quarterly',
        duration: 'quarterly',
        price: 3200,
        features: ['Dedicated seat', 'WiFi access', 'All day access', 'Free locker', 'AC seating', 'Printing credits', '10% discount'],
        isActive: true,
    },
    {
        id: 'pln-005',
        name: 'Yearly',
        duration: 'yearly',
        price: 12000,
        features: ['Dedicated seat', 'WiFi access', 'All day access', 'Free locker', 'AC seating', 'Unlimited printing', '20% discount'],
        isActive: true,
    },
];

// --- Mock Data: Subscriptions ---
export const subscriptions: Subscription[] = students
    .filter(s => s.status === 'active')
    .slice(0, 200)
    .map((student, i) => ({
        id: generateId('sub', i + 1),
        studentId: student.id,
        planId: plans[Math.floor(Math.random() * plans.length)].id,
        startDate: student.joiningDate,
        endDate: addDays(new Date(student.joiningDate), 30).toISOString(),
        status: Math.random() > 0.9 ? 'expiring' : 'active',
        autoRenew: Math.random() > 0.3,
    }));

// --- Mock Data: Expenses ---
export interface Expense {
    id: string;
    branchId: string;
    category: 'rent' | 'utilities' | 'salaries' | 'maintenance' | 'marketing' | 'other';
    amount: number;
    description?: string;
    date: string;
    vendorName?: string;
    billNumber?: string;
    gstAmount?: number;
    paymentMode: 'cash' | 'bank_transfer' | 'cheque' | 'upi';
    receiptUrl?: string;
}

export const expenses: Expense[] = Array.from({ length: 80 }, (_, i) => {
    const branch = branches[i % branches.length];
    const categories: Expense['category'][] = ['rent', 'utilities', 'salaries', 'maintenance', 'marketing', 'other'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    return {
        id: generateId('exp', i + 1),
        branchId: branch.id,
        category,
        amount: category === 'rent' ? branch.monthlyRent || 50000 : Math.floor(Math.random() * 20000) + 1000,
        description: `${category} expense for ${branch.name}`,
        date: subDays(new Date(), Math.floor(Math.random() * 60)).toISOString(),
        vendorName: `Vendor ${i % 10 + 1}`,
        billNumber: `BILL-${i + 1000}`,
        gstAmount: Math.floor(Math.random() * 2000),
        paymentMode: (['cash', 'bank_transfer', 'cheque', 'upi'] as const)[Math.floor(Math.random() * 4)],
        receiptUrl: `/receipts/exp-${i + 1}.pdf`,
    };
});

// --- Mock Data: Daily Settlements ---
export interface Settlement {
    id: string;
    branchId: string;
    date: string;
    settledBy: string;
    systemCalculated: number;
    actualCash: number;
    variance: number;
    status: 'balanced' | 'flagged' | 'reviewed';
    evidenceUrl?: string;
    notes?: string;
}

export const settlements: Settlement[] = Array.from({ length: 60 }, (_, i) => {
    const branch = branches[i % branches.length];
    const systemCalc = Math.floor(Math.random() * 15000) + 5000;
    const variance = i % 10 === 0 ? -500 : (i % 15 === 0 ? 200 : 0);
    const actualCash = systemCalc + variance;
    
    return {
        id: generateId('set', i + 1),
        branchId: branch.id,
        date: subDays(new Date(), i).toISOString(),
        settledBy: users.find(u => u.branchId === branch.id && u.role === 'manager')?.id || users[0].id,
        systemCalculated: systemCalc,
        actualCash,
        variance,
        status: variance < 0 ? 'flagged' : (variance > 0 ? 'reviewed' : 'balanced'),
        evidenceUrl: `/settlements/slip-${i + 1}.jpg`,
        notes: variance !== 0 ? `Variance of ₹${Math.abs(variance)}` : 'All balanced',
    };
});

// --- Mock Data: Waitlist ---
export interface WaitlistEntry {
    id: string;
    branchId: string;
    name: string;
    phone: string;
    preferredShift: ShiftType;
    joinedDate: string;
    status: 'waiting' | 'notified' | 'converted';
    potentialRevenue: number;
    priority: number;
    maxWaitDays?: number;
    notificationPreference?: string[];
    notes?: string;
}

export const waitlist: WaitlistEntry[] = Array.from({ length: 25 }, (_, i) => {
    const branch = branches[i % branches.length];
    
    return {
        id: generateId('wait', i + 1),
        branchId: branch.id,
        name: `Waitlist Person ${i + 1}`,
        phone: `+91${9800000000 + i}`,
        preferredShift: (['morning', 'evening', 'hybrid'] as const)[Math.floor(Math.random() * 3)],
        joinedDate: subDays(new Date(), Math.floor(Math.random() * 30)).toISOString(),
        status: (['waiting', 'notified', 'converted'] as const)[Math.floor(Math.random() * 3)],
        potentialRevenue: [800, 1200, 3200][Math.floor(Math.random() * 3)],
        priority: i + 1,
        maxWaitDays: 30,
        notificationPreference: ['whatsapp', 'sms'],
        notes: `Interested in ${['morning', 'evening'][Math.floor(Math.random() * 2)]} shift`,
    };
});

// --- Mock Data: Blacklist ---
export interface BlacklistEntry {
    id: string;
    branchId?: string;
    phone: string;
    name: string;
    reason: string;
    severity: 'low' | 'medium' | 'high';
    addedBy: string;
    date: string;
    evidenceUrls?: string[];
}

export const blacklist: BlacklistEntry[] = Array.from({ length: 15 }, (_, i) => {
    const branch = i < 10 ? branches[i % branches.length] : undefined;
    
    return {
        id: generateId('blk', i + 1),
        branchId: branch?.id,
        phone: `+91${9700000000 + i}`,
        name: `Blacklisted Person ${i + 1}`,
        reason: ['Payment fraud', 'Disruptive behavior', 'Theft', 'Repeated violations'][i % 4],
        severity: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
        addedBy: users.find(u => u.role === 'manager')?.id || users[0].id,
        date: subDays(new Date(), Math.floor(Math.random() * 180)).toISOString(),
        evidenceUrls: [`/evidence/blk-${i + 1}.jpg`],
    };
});

// --- Mock Data: Alumni ---
export interface AlumniEntry {
    id: string;
    studentId: string;
    branchId: string;
    exitDate: string;
    reason: string;
    forwardAddress?: string;
}

export const alumni: AlumniEntry[] = students
    .filter(s => s.status === 'inactive')
    .slice(0, 30)
    .map((student, i) => ({
        id: generateId('alm', i + 1),
        studentId: student.id,
        branchId: student.branchId,
        exitDate: subDays(new Date(), Math.floor(Math.random() * 365)).toISOString(),
        reason: ['Completed studies', 'Relocated', 'Financial issues', 'Dissatisfied'][i % 4],
        forwardAddress: i % 3 === 0 ? `New address ${i + 1}` : undefined,
    }));

// --- Mock Data: Daily Revenue (for charts) ---
export const dailyRevenue = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
    amount: Math.floor(Math.random() * 15000) + 5000,
    cash: Math.floor(Math.random() * 5000) + 2000,
    upi: Math.floor(Math.random() * 6000) + 2000,
    card: Math.floor(Math.random() * 4000) + 1000,
}));

// --- Mock Data: Staff Performance ---
export const staffPerformance = users
    .filter(u => u.role === 'manager' || u.role === 'staff')
    .slice(0, 10)
    .map((user, i) => ({
        userId: user.id,
        name: user.name,
        revenue: Math.floor(Math.random() * 100000) + 20000,
        conversions: Math.floor(Math.random() * 20) + 5,
        attendanceMarked: Math.floor(Math.random() * 500) + 100,
    }));

// --- Mock Data: Lockers ---
export interface Locker {
  id: string;
  branchId: string;
  number: number;
  status: 'free' | 'occupied' | 'maintenance';
  studentId?: string;
  expiryDate?: string;
  monthlyFee: number;
}

export const lockers: Locker[] = Array.from({ length: 50 }, (_, i) => {
  const isOccupied = Math.random() > 0.4;
  const isMaintenance = !isOccupied && Math.random() > 0.9;
  
  return {
    id: generateId('lck', i + 1),
    branchId: branches[0].id,
    number: i + 1,
    status: isMaintenance ? 'maintenance' : (isOccupied ? 'occupied' : 'free'),
    studentId: isOccupied ? students[i % students.length]?.id : undefined,
    expiryDate: isOccupied ? addDays(new Date(), Math.floor(Math.random() * 30)).toISOString() : undefined,
    monthlyFee: 200,
  };
});

// --- Mock Data: Marketing ROI ---
export interface MarketingSource {
  id: string;
  name: string;
  type: 'walk_in' | 'google_ads' | 'facebook' | 'referral' | 'website';
  leads: number;
  conversions: number;
  cost: number;
  revenue: number;
}

export const marketingSources: MarketingSource[] = [
  {
    id: 'mkt-001',
    name: 'Walk-in',
    type: 'walk_in',
    leads: 120,
    conversions: 72,
    cost: 0,
    revenue: 86400,
  },
  {
    id: 'mkt-002',
    name: 'Google Ads',
    type: 'google_ads',
    leads: 80,
    conversions: 24,
    cost: 15000,
    revenue: 28800,
  },
  {
    id: 'mkt-003',
    name: 'Facebook Ads',
    type: 'facebook',
    leads: 60,
    conversions: 12,
    cost: 8000,
    revenue: 14400,
  },
  {
    id: 'mkt-004',
    name: 'Referrals',
    type: 'referral',
    leads: 40,
    conversions: 20,
    cost: 2000,
    revenue: 24000,
  },
  {
    id: 'mkt-005',
    name: 'Website',
    type: 'website',
    leads: 50,
    conversions: 15,
    cost: 5000,
    revenue: 18000,
  },
];

// --- Mock Data: Staff Performance with Detailed Metrics ---
export interface StaffPerformanceDetail {
  userId: string;
  name: string;
  role: string;
  leadsAssigned: number;
  callsMade: number;
  missedFollowups: number;
  conversions: number;
  revenueCollected: number;
  conversionRate: number;
}

export const staffPerformanceDetails: StaffPerformanceDetail[] = users
  .filter(u => u.role === 'manager' || u.role === 'staff')
  .slice(0, 15)
  .map((user, i) => {
    const leadsAssigned = Math.floor(Math.random() * 50) + 20;
    const callsMade = Math.floor(Math.random() * leadsAssigned) + 10;
    const missedFollowups = Math.floor(Math.random() * 10);
    const conversions = Math.floor(Math.random() * 20) + 5;
    const revenueCollected = conversions * (Math.floor(Math.random() * 1000) + 800);
    
    return {
      userId: user.id,
      name: user.name,
      role: user.role,
      leadsAssigned,
      callsMade,
      missedFollowups,
      conversions,
      revenueCollected,
      conversionRate: Math.round((conversions / leadsAssigned) * 100),
    };
  });

// --- Mock Data: Enhanced Audit Logs with Critical Actions ---
export const criticalAuditLogs = [
  {
    id: 'log-crit-001',
    timestamp: subDays(new Date(), 1).toISOString(),
    userId: 'usr-mgr-001',
    userRole: 'manager' as const,
    action: 'DELETE_PAYMENT' as const,
    entityType: 'payment' as const,
    entityId: 'pay-500',
    changes: [
      { field: 'amount', oldValue: 500, newValue: 0 },
      { field: 'status', oldValue: 'paid', newValue: 'deleted' },
    ],
    ipAddress: '192.168.1.105',
    device: 'Chrome/Windows',
    severity: 'critical' as const,
    details: 'Deleted ₹500 cash receipt',
  },
  {
    id: 'log-crit-002',
    timestamp: subDays(new Date(), 2).toISOString(),
    userId: 'usr-mgr-002',
    userRole: 'manager' as const,
    action: 'MANUAL_DISCOUNT' as const,
    entityType: 'payment' as const,
    entityId: 'pay-501',
    changes: [
      { field: 'amount', oldValue: 1200, newValue: 900 },
    ],
    ipAddress: '192.168.1.106',
    device: 'Chrome/Windows',
    severity: 'high' as const,
    details: 'Applied manual discount of ₹300',
  },
];

// Helper to get user by id
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getBranchById = (id: string) => branches.find(b => b.id === id);
export const getStudentById = (id: string) => students.find(s => s.id === id);
export const getPlanById = (id: string) => plans.find(p => p.id === id);
