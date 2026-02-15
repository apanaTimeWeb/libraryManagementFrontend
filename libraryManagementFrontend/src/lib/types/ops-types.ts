export interface Student {
  id: string;
  smartId: string;
  name: string;
  phone: string;
  parentPhone: string | null;
  email: string | null;
  college: string | null;
  photoUrl: string | null;
  status: 'active' | 'suspended';
  currentSeat: string | null;
  shift: 'Morning' | 'Evening' | 'Hybrid';
  dueAmount: number;
  lateFeeApplicable: boolean;
  expiryDate: string;
  trustScore: number;
  guardianPhone: string | null;
  familyLinked: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  source: 'walk_in' | 'google_ads' | 'facebook' | 'referral' | 'other';
  status: 'new' | 'visited' | 'interested' | 'converted' | 'lost';
  followUpDate: string;
  lastMessageSent: string | null;
  notes: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  validFrom: string;
  validTill: string;
  maxUses: number;
  usedCount: number;
  minOrderAmount: number;
  applicablePlans: string | string[];
  isActive: boolean;
}

export interface Seat {
  id: number;
  number: string;
  status: 'occupied' | 'available' | 'maintenance';
  occupantId: string | null;
  occupantName: string | null;
  expiry: string | null;
  lastOccupant: string | null;
  availableSince: string | null;
  maintenanceReason: string | null;
  expectedAvailable: string | null;
}

export interface Locker {
  id: number;
  number: string;
  status: 'occupied' | 'available' | 'maintenance';
  occupantId: string | null;
  occupantName: string | null;
  monthlyFee: number;
  keyNumber: string;
}

export interface PTP {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  promisedDate: string;
  trustScore: number;
  daysOverdue: number;
  fulfilled: boolean;
  timesChanged: number;
}

export interface Complaint {
  id: string;
  number: string;
  title: string;
  category: 'infrastructure' | 'noise' | 'cleanliness' | 'staff' | 'other';
  priority: 'low' | 'medium' | 'high';
  studentName: string | null;
  isAnonymous: boolean;
  createdDate: string;
  daysOpen: number;
  status: 'open' | 'in_progress' | 'resolved';
  description: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  vendor: string;
  paymentMode: 'cash' | 'bank' | 'upi';
  receipt: string | null;
  description: string;
  billNumber: string | null;
}

export interface Activity {
  id: string;
  action: string;
  amount?: number;
  timestamp: string;
  user: string;
}

export interface Blacklist {
  id: string;
  phone: string;
  name: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  addedBy: string;
  addedDate: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  mode: 'cash' | 'upi' | 'card' | 'bank';
  transactionId: string | null;
  type: 'plan_fee' | 'late_fee' | 'locker_fee' | 'deposit';
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  notifyGuardian: boolean;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'operational' | 'maintenance' | 'retired';
  purchaseDate: string;
  nextMaintenance: string;
  location: string;
}

export interface Settlement {
  id: string;
  date: string;
  expectedCash: number;
  actualCash: number;
  variance: number;
  notes: string;
  submittedBy: string;
}
