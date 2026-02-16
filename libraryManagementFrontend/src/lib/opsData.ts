import { subDays, addDays } from 'date-fns';

const today = new Date();

// Students (50+ records)
export const mockStudents = [
  {
    id: "s1",
    smartId: "LIB001",
    name: "Rahul Sharma",
    phone: "+919876543210",
    parentPhone: "+919123456789",
    email: "rahul@gmail.com",
    college: "DU",
    photoUrl: "/mock/avatar1.png",
    status: "active",
    currentSeat: "A-15",
    shift: "Morning",
    dueAmount: 500,
    lateFeeApplicable: true,
    expiryDate: addDays(today, 10).toISOString(),
    trustScore: 3,
    guardianPhone: null,
    familyLinked: false
  },
  {
    id: "s2",
    smartId: "LIB002",
    name: "Sneha Gupta",
    phone: "+919876543211",
    parentPhone: "+919123456780",
    email: "sneha@gmail.com",
    college: "JMI",
    photoUrl: "/mock/avatar2.png",
    status: "active",
    currentSeat: null,
    shift: "Evening",
    dueAmount: 0,
    lateFeeApplicable: false,
    expiryDate: addDays(today, 5).toISOString(),
    trustScore: 5,
    guardianPhone: null,
    familyLinked: false
  },
  {
    id: "s3",
    smartId: "LIB003",
    name: "Amit Kumar",
    phone: "+919876543212",
    parentPhone: "+919123456781",
    email: "amit@gmail.com",
    college: "DU",
    photoUrl: "/mock/avatar3.png",
    status: "active",
    currentSeat: "B-08",
    shift: "Morning",
    dueAmount: 0,
    lateFeeApplicable: false,
    expiryDate: addDays(today, 2).toISOString(),
    trustScore: 4,
    guardianPhone: "+919876543212",
    familyLinked: true
  },
  {
    id: "s4",
    smartId: "LIB004",
    name: "Priya Kapoor",
    phone: "+919876543213",
    parentPhone: "+919123456782",
    email: "priya@gmail.com",
    college: "Amity",
    photoUrl: "/mock/avatar4.png",
    status: "active",
    currentSeat: "B-09",
    shift: "Evening",
    dueAmount: 200,
    lateFeeApplicable: true,
    expiryDate: addDays(today, 15).toISOString(),
    trustScore: 2,
    guardianPhone: null,
    familyLinked: false
  },
  {
    id: "s5",
    smartId: "LIB005",
    name: "Rohit Mehra",
    phone: "+919876543214",
    parentPhone: "+919123456783",
    email: "rohit@gmail.com",
    college: "DU",
    photoUrl: "/mock/avatar5.png",
    status: "suspended",
    currentSeat: "C-01",
    shift: "Morning",
    dueAmount: 1000,
    lateFeeApplicable: true,
    expiryDate: subDays(today, 5).toISOString(),
    trustScore: 1,
    guardianPhone: null,
    familyLinked: false
  },
  // Additional students for comprehensive testing
  ...Array.from({ length: 45 }, (_, i) => ({
    id: `s${i + 6}`,
    smartId: `LIB${String(i + 6).padStart(3, '0')}`,
    name: `Student ${i + 6}`,
    phone: `+9198765432${String(i + 15).padStart(2, '0')}`,
    parentPhone: `+9191234567${String(i + 84).padStart(2, '0')}`,
    email: `student${i + 6}@gmail.com`,
    college: ['DU', 'JMI', 'Amity', 'IP University'][i % 4],
    photoUrl: `/mock/avatar${(i % 5) + 1}.png`,
    status: i % 10 === 0 ? 'suspended' : 'active',
    currentSeat: i % 3 === 0 ? null : `${String.fromCharCode(65 + Math.floor(i / 20))}-${String((i % 20) + 1).padStart(2, '0')}`,
    shift: i % 2 === 0 ? 'Morning' : 'Evening',
    dueAmount: i % 5 === 0 ? (i * 100) % 1000 : 0,
    lateFeeApplicable: i % 5 === 0,
    expiryDate: addDays(today, (i % 30) + 1).toISOString(),
    trustScore: (i % 5) + 1,
    guardianPhone: i % 7 === 0 ? `+9198765432${String(i + 15).padStart(2, '0')}` : null,
    familyLinked: i % 7 === 0
  }))
];

// Enquiries (leads)
export const mockEnquiries = [
  { id: "e1", name: "Neha Singh", phone: "+919988776655", source: "walk_in", status: "new", followUpDate: today.toISOString(), lastMessageSent: null, notes: "" },
  { id: "e2", name: "Arjun Reddy", phone: "+919988776656", source: "google_ads", status: "interested", followUpDate: addDays(today, 2).toISOString(), lastMessageSent: "Welcome Offer", notes: "Interested in evening shift" },
  { id: "e3", name: "Kavya Patel", phone: "+919988776657", source: "referral", status: "visited", followUpDate: today.toISOString(), lastMessageSent: null, notes: "Visited yesterday" },
  { id: "e4", name: "Vikram Singh", phone: "+919988776658", source: "facebook", status: "new", followUpDate: addDays(today, 1).toISOString(), lastMessageSent: "Welcome Offer", notes: "" },
  { id: "e5", name: "Anjali Sharma", phone: "+919988776659", source: "walk_in", status: "interested", followUpDate: today.toISOString(), lastMessageSent: null, notes: "Looking for AC seat" },
];

// Coupons
export const mockCoupons = [
  { 
    id: "c1", 
    code: "NEWYEAR50", 
    discountType: "fixed", 
    discountValue: 50, 
    validFrom: subDays(today, 10).toISOString(), 
    validTill: addDays(today, 20).toISOString(), 
    maxUses: 100, 
    usedCount: 23, 
    minOrderAmount: 500, 
    applicablePlans: "all", 
    isActive: true 
  },
  { 
    id: "c2", 
    code: "STUDENT10", 
    discountType: "percent", 
    discountValue: 10, 
    validFrom: subDays(today, 5).toISOString(), 
    validTill: addDays(today, 30).toISOString(), 
    maxUses: 50, 
    usedCount: 12, 
    minOrderAmount: 0, 
    applicablePlans: ["Monthly Premium"], 
    isActive: true 
  },
];

// Shifts
export const mockShiftTimes = {
  morning: { start: "06:00", end: "14:00" },
  evening: { start: "14:00", end: "22:00" }
};

// Seats (100)
export const mockSeats = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  number: `${String.fromCharCode(65 + Math.floor(i / 20))}-${String((i % 20) + 1).padStart(2, '0')}`,
  status: i < 70 ? "occupied" : i < 90 ? "available" : "maintenance",
  occupantId: i < 70 ? mockStudents[i % 5].id : null,
  occupantName: i < 70 ? mockStudents[i % 5].name : null,
  expiry: i < 70 ? mockStudents[i % 5].expiryDate : null,
  lastOccupant: i >= 70 ? mockStudents[(i + 3) % 5].name : null,
  availableSince: i >= 70 ? subDays(today, (i % 10) + 1).toISOString() : null,
  maintenanceReason: i >= 90 ? "Chair broken" : null,
  expectedAvailable: i >= 90 ? addDays(today, 2).toISOString() : null,
}));

// Lockers
export const mockLockers = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  number: `L-${String(i + 1).padStart(2, '0')}`,
  status: i < 20 ? "occupied" : i < 25 ? "available" : "maintenance",
  occupantId: i < 20 ? mockStudents[i % 5].id : null,
  occupantName: i < 20 ? mockStudents[i % 5].name : null,
  monthlyFee: 200,
  keyNumber: `KEY-${i + 1}`,
}));

// PTPs
export const mockPTPs = [
  { id: "p1", studentId: "s1", studentName: "Rahul Sharma", amount: 500, promisedDate: addDays(today, 3).toISOString(), trustScore: 3, daysOverdue: 0, fulfilled: false, timesChanged: 0 },
  { id: "p2", studentId: "s4", studentName: "Priya Kapoor", amount: 200, promisedDate: subDays(today, 2).toISOString(), trustScore: 2, daysOverdue: 2, fulfilled: false, timesChanged: 1 },
];

// Complaints
export const mockComplaints = [
  { id: "c1", number: "CMP-001", title: "AC not cooling", category: "infrastructure", priority: "high", studentName: "Rahul Sharma", isAnonymous: false, createdDate: subDays(today, 2).toISOString(), daysOpen: 2, status: "open", description: "AC in section A not working properly" },
  { id: "c2", number: "CMP-002", title: "Noise disturbance", category: "noise", priority: "medium", studentName: null, isAnonymous: true, createdDate: subDays(today, 1).toISOString(), daysOpen: 1, status: "in_progress", description: "Too much noise near entrance" },
  { id: "c3", number: "CMP-003", title: "WiFi connectivity issue", category: "infrastructure", priority: "high", studentName: "Amit Kumar", isAnonymous: false, createdDate: subDays(today, 3).toISOString(), daysOpen: 3, status: "open", description: "WiFi keeps disconnecting" },
];

// Expenses
export const mockExpenses = [
  { id: "e1", date: subDays(today, 1).toISOString(), category: "Maintenance", amount: 500, vendor: "Cool Care", paymentMode: "cash", receipt: "/mock/receipt1.jpg", description: "AC servicing", billNumber: "CC-001" },
  { id: "e2", date: subDays(today, 2).toISOString(), category: "Utilities", amount: 3000, vendor: "BSES", paymentMode: "bank", receipt: null, description: "Electricity bill", billNumber: "BSES-2024-01" },
  { id: "e3", date: subDays(today, 3).toISOString(), category: "Stationery", amount: 150, vendor: "Office Mart", paymentMode: "cash", receipt: "/mock/receipt2.jpg", description: "Pens and registers", billNumber: null },
];

// Recent Activity (for dashboard)
export const mockRecentActivity = [
  { id: "a1", action: "Fee collected from Rahul Sharma", amount: 500, timestamp: subDays(today, 0).toISOString(), user: "Vikram" },
  { id: "a2", action: "Seat A-15 assigned to Sneha Gupta", timestamp: subDays(today, 0).toISOString(), user: "Priya" },
  { id: "a3", action: "New admission: Amit Kumar", timestamp: subDays(today, 1).toISOString(), user: "Vikram" },
  { id: "a4", action: "Complaint resolved: CMP-005", timestamp: subDays(today, 1).toISOString(), user: "Manager" },
  { id: "a5", action: "Expense added: Utilities ₹3000", timestamp: subDays(today, 2).toISOString(), user: "Priya" },
];

// Blacklist
export const mockBlacklist = [
  { id: "b1", phone: "+919876543999", name: "Ravi Kumar", reason: "Non-payment and aggression", severity: "high", addedBy: "Vikram", addedDate: subDays(today, 30).toISOString() },
  { id: "b2", phone: "+919876543998", name: "Deepak Singh", reason: "Repeated violations", severity: "medium", addedBy: "Manager", addedDate: subDays(today, 15).toISOString() },
];

// Today's collection (for dashboard)
export let mockTodayCollection = 15000;

// Occupancy
export const mockOccupancy = { occupied: 85, total: 100 };

// Present now
export let mockPresentNow = 42;

// Plans (for admission)
export const mockPlans = [
  { id: "p1", name: "Monthly Basic", price: 800, durationDays: 30, features: ["AC", "WiFi"], isActive: true },
  { id: "p2", name: "Monthly Premium", price: 1200, durationDays: 30, features: ["AC", "Locker", "WiFi", "Printing"], isActive: true },
  { id: "p3", name: "Quarterly Basic", price: 2200, durationDays: 90, features: ["AC", "WiFi"], isActive: true },
  { id: "p4", name: "Quarterly Premium", price: 3300, durationDays: 90, features: ["AC", "Locker", "WiFi", "Printing"], isActive: true },
];

// Payment history
export const mockPayments = [
  { id: "pay1", studentId: "s1", studentName: "Rahul Sharma", amount: 800, date: subDays(today, 30).toISOString(), mode: "upi", transactionId: "UPI123456", type: "plan_fee" },
  { id: "pay2", studentId: "s2", studentName: "Sneha Gupta", amount: 1200, date: subDays(today, 25).toISOString(), mode: "cash", transactionId: null, type: "plan_fee" },
  { id: "pay3", studentId: "s3", studentName: "Amit Kumar", amount: 800, date: subDays(today, 28).toISOString(), mode: "card", transactionId: "CARD789012", type: "plan_fee" },
];

// Attendance records
export const mockAttendance = [
  { id: "att1", studentId: "s1", studentName: "Rahul Sharma", date: today.toISOString(), checkIn: "09:00", checkOut: "18:00", notifyGuardian: true },
  { id: "att2", studentId: "s2", studentName: "Sneha Gupta", date: today.toISOString(), checkIn: "14:30", checkOut: null, notifyGuardian: true },
  { id: "att3", studentId: "s3", studentName: "Amit Kumar", date: today.toISOString(), checkIn: "08:00", checkOut: "17:00", notifyGuardian: true },
];

// Assets
export const mockAssets = [
  { id: "as1", name: "AC Unit 1", category: "HVAC", status: "operational", purchaseDate: subDays(today, 365).toISOString(), nextMaintenance: addDays(today, 30).toISOString(), location: "Section A" },
  { id: "as2", name: "WiFi Router 1", category: "IT", status: "operational", purchaseDate: subDays(today, 180).toISOString(), nextMaintenance: addDays(today, 60).toISOString(), location: "Main Hall" },
  { id: "as3", name: "Chair Set A", category: "Furniture", status: "maintenance", purchaseDate: subDays(today, 730).toISOString(), nextMaintenance: today.toISOString(), location: "Section A" },
];

// EOD Settlements
export const mockSettlements = [
  { id: "eod1", date: subDays(today, 1).toISOString(), expectedCash: 5000, actualCash: 5000, variance: 0, notes: "All good", submittedBy: "Manager" },
  { id: "eod2", date: subDays(today, 2).toISOString(), expectedCash: 3500, actualCash: 3450, variance: -50, notes: "Minor shortage", submittedBy: "Manager" },
];

// Helper functions to update mock data
export const updateTodayCollection = (amount: number) => {
  mockTodayCollection += amount;
};

export const updatePresentNow = (count: number) => {
  mockPresentNow = count;
};
