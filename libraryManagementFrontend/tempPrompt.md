# 👔 SMART LIBRARY 360 – OPERATIONS CONSOLE (MANAGER & STAFF) MASTER PROMPT

**Copy this entire prompt into Bolt.new, Lovable, or v0** to generate a complete, production‑ready frontend for **Managers & Staff**. This prompt includes **every operational feature**, **every page**, **every modal**, and **every component** with **hardcoded mock data** so you can test live immediately. No backend required – all data is simulated.

---

## 📋 PROJECT OVERVIEW

**Project Name**: Smart Library 360 – Operations Console  
**Target Users**:  
- **Manager**: Full operational control (can override late fees, handle refunds, perform EOD settlement)  
- **Staff**: Daily operations (collect fees, mark attendance, add leads, manage complaints)  
- **Role-Based UI**: A toggle in the topbar switches between Manager and Staff views (for demo purposes)

**Backend Services Covered**: 3,4,5,6,7,8,9,10,11,12,13,16,17,18,19,20,21,22,24,26 (Admissions, Fees, Attendance, CRM, Daily Ops, etc.)

**Design System**:
- **Colors**: Slate-50 background, White cards. Primary: Blue-600. Alert colors: Red (dues/absent/occupied), Orange (unallocated/PTP/maintenance), Green (paid/present/available).
- **Typography**: Inter (system fallback)
- **Spacing**: 4px base (Tailwind spacing)
- **Border radius**: 6px (medium), 8px (cards)
- **Components**: Shadcn UI (latest) – Cards, Dialogs, Tables, Toasts, Badges, Switch, Select, Tabs, Sheet
- **Icons**: Lucide React
- **Tables**: TanStack Table v8
- **Charts**: Recharts (for dashboard)
- **Forms**: React Hook Form + Zod
- **Date handling**: date‑fns
- **Notifications**: Sonner toasts

**Tech Stack** (mandatory):
```
Next.js 14 (App Router)
React 18 + TypeScript
Tailwind CSS 3.4 + @tailwindcss/forms
Shadcn UI (latest)
TanStack Table v8
Recharts
React Hook Form + Zod
Lucide React
Axios (mock for now)
date‑fns
```

---

## 🧠 MOCK DATA STORE (`lib/opsData.ts`)

Create a TypeScript file exporting all mock data. This data must cover all operational edge cases.

```typescript
// lib/opsData.ts
import { subDays, addDays, format } from 'date-fns';

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
  // ... more (generate 50+ with variations)
];

// Enquiries (leads)
export const mockEnquiries = [
  { id: "e1", name: "Neha Singh", phone: "+919988776655", source: "walk_in", status: "new", followUpDate: today.toISOString(), lastMessageSent: null },
  { id: "e2", name: "Arjun Reddy", phone: "+919988776656", source: "google_ads", status: "interested", followUpDate: addDays(today, 2).toISOString(), lastMessageSent: "Welcome Offer" },
  // ...
];

// Coupons
export const mockCoupons = [
  { id: "c1", code: "NEWYEAR50", discountType: "fixed", discountValue: 50, validFrom: subDays(today, 10).toISOString(), validTill: addDays(today, 20).toISOString(), maxUses: 100, usedCount: 23, minOrderAmount: 500, applicablePlans: "all", isActive: true },
  { id: "c2", code: "STUDENT10", discountType: "percent", discountValue: 10, validFrom: subDays(today, 5).toISOString(), validTill: addDays(today, 30).toISOString(), maxUses: 50, usedCount: 12, minOrderAmount: 0, applicablePlans: ["Monthly Premium"], isActive: true },
];

// Shifts
export const mockShiftTimes = {
  morning: { start: "06:00", end: "14:00" },
  evening: { start: "14:00", end: "22:00" }
};

// Seats (100)
export const mockSeats = Array.from({ length: 100 }, (_, i) => ({
  id: i+1,
  number: `${String.fromCharCode(65 + Math.floor(i/20))}-${String(i%20+1).padStart(2,'0')}`,
  status: i < 70 ? "occupied" : i < 90 ? "available" : "maintenance",
  occupantId: i < 70 ? mockStudents[i % 5].id : null,
  occupantName: i < 70 ? mockStudents[i % 5].name : null,
  expiry: i < 70 ? mockStudents[i % 5].expiryDate : null,
  lastOccupant: i >= 70 ? mockStudents[(i+3) % 5].name : null,
  availableSince: i >= 70 ? subDays(today, Math.floor(Math.random()*10)).toISOString() : null,
  maintenanceReason: i >= 90 ? "Chair broken" : null,
  expectedAvailable: i >= 90 ? addDays(today, 2).toISOString() : null,
}));

// Lockers
export const mockLockers = Array.from({ length: 30 }, (_, i) => ({
  id: i+1,
  number: `L-${String(i+1).padStart(2,'0')}`,
  status: i < 20 ? "occupied" : i < 25 ? "available" : "maintenance",
  occupantId: i < 20 ? mockStudents[i % 5].id : null,
  occupantName: i < 20 ? mockStudents[i % 5].name : null,
  monthlyFee: 200,
  keyNumber: `KEY-${i+1}`,
}));

// PTPs
export const mockPTPs = [
  { id: "p1", studentId: "s1", studentName: "Rahul Sharma", amount: 500, promisedDate: addDays(today, 3).toISOString(), trustScore: 3, daysOverdue: 0, fulfilled: false, timesChanged: 0 },
  { id: "p2", studentId: "s4", studentName: "Priya Kapoor", amount: 200, promisedDate: subDays(today, 2).toISOString(), trustScore: 2, daysOverdue: 2, fulfilled: false, timesChanged: 1 },
];

// Complaints
export const mockComplaints = [
  { id: "c1", number: "CMP-001", title: "AC not cooling", category: "infrastructure", priority: "high", studentName: "Rahul Sharma", isAnonymous: false, createdDate: subDays(today, 2).toISOString(), daysOpen: 2, status: "open" },
  { id: "c2", number: "CMP-002", title: "Noise disturbance", category: "noise", priority: "medium", studentName: null, isAnonymous: true, createdDate: subDays(today, 1).toISOString(), daysOpen: 1, status: "in_progress" },
];

// Expenses
export const mockExpenses = [
  { id: "e1", date: subDays(today, 1).toISOString(), category: "Maintenance", amount: 500, vendor: "Cool Care", paymentMode: "cash", receipt: "/mock/receipt1.jpg" },
  { id: "e2", date: subDays(today, 2).toISOString(), category: "Utilities", amount: 3000, vendor: "BSES", paymentMode: "bank", receipt: null },
];

// Recent Activity (for dashboard)
export const mockRecentActivity = [
  { id: "a1", action: "Fee collected from Rahul Sharma", amount: 500, timestamp: subDays(today, 1).toISOString(), user: "Vikram" },
  { id: "a2", action: "Seat A-15 assigned to Sneha Gupta", timestamp: subDays(today, 1).toISOString(), user: "Priya" },
];

// Blacklist
export const mockBlacklist = [
  { id: "b1", phone: "+919876543999", name: "Ravi Kumar", reason: "Non-payment and aggression", severity: "high", addedBy: "Vikram", addedDate: subDays(today, 30).toISOString() },
];

// Today's collection (for dashboard)
export const mockTodayCollection = 15000;

// Occupancy
export const mockOccupancy = { occupied: 85, total: 100 };

// Present now
export const mockPresentNow = 42;

// Plans (for admission)
export const mockPlans = [
  { id: "p1", name: "Monthly Basic", price: 800, durationDays: 30, features: ["AC", "WiFi"], isActive: true },
  { id: "p2", name: "Monthly Premium", price: 1200, durationDays: 30, features: ["AC", "Locker", "WiFi", "Printing"], isActive: true },
];
```

---

## 🧭 NAVIGATION & LAYOUT

### Global Layout (Ops Console)

- **Sidebar** (Left, collapsible) – same as Owner but with operational modules:
  - Dashboard (`/`)
  - Admissions (`/students`) – Student Directory & New Admission
  - Fees (`/fees`) – Fee Collection & Dues Manager
  - Attendance (`/attendance`) – Mark In/Out & Absentee List
  - CRM (`/crm`) – Leads & Messaging
  - Daily Ops (`/ops`) – Lockers, Complaints, Expenses, Assets, EOD Settlement (Manager only)
- **Topbar**:
  - Role toggle (Manager/Staff) – changes available actions
  - Notifications bell (simulated)
  - User dropdown (Profile, Logout)
- **Main Content Area**: p-6, bg-slate-50

---

## ⚡ 1. DASHBOARD (`/`)

**Purpose**: Immediate visibility of pending tasks and quick stats.

### Top Row – Critical Lists (Actionable Cards)

| Card | Data Source | Actions |
|------|-------------|---------|
| **⚠️ Dues Pending** | Students with `dueAmount > 0` | List each with name, amount, "Collect Fee" button (opens fee modal) |
| **🪑 Unallocated Students** | Students with `status='active'` and `currentSeat = null` | List each with name, "Assign Seat" button (opens seat assignment modal) |
| **📞 Leads to Call** | Enquiries where `followUpDate == today` | List each with name, phone, "Call" (simulate call), "Message" (open WhatsApp template) |

### Middle Row – Quick Stats (3 cards)

- **Today's Collection**: ₹15,000 (from `mockTodayCollection`) – updates when fee collected.
- **Occupancy**: 85/100 – progress bar.
- **Present Now**: 42 students – live (can be updated via attendance).

### Bottom Row – Recent Activity Feed

- List of last 5 actions from `mockRecentActivity` (timestamp, action, user).
- Auto‑refresh on new actions.

### Quick Actions FAB (Floating Action Button)

- `+ New Admission` – opens Admission Wizard.
- `📷 Mark In/Out` – opens scanner modal (quick ID input).

---

## 🎓 2. ADMISSIONS & STUDENT MANAGEMENT (`/students`)

### A. Student Directory (Table – TanStack)

**Columns**:
- Smart ID (with gap‑filled badge if applicable)
- Name (click to open profile drawer)
- Seat Number (or "Unallocated" badge)
- Shift (Morning/Evening)
- Due Amount (red if >0)
- Status (badge: active/suspended)
- Actions: "Collect Fee", "Assign Seat", "Generate ID Card"

**Filters** (above table):
- "Has Dues"
- "No Seat Assigned"
- "Shift" (Morning/Evening)
- "Status" (Active/Suspended)

**Row Click**: Opens **Student Profile Drawer** with tabs:
- **Info**: Personal details, photo, documents (view links)
- **Family Tree**: If family linked, show tree with guardian icon; else show "Add to Family" button.
- **Payment History**: Table of past payments.
- **Attendance Log**: Calendar view of attendance.

**Actions in Profile**:
- "Generate ID Card" (Service 16) – single PDF download.
- "Suspend/Reactivate" – toggle status.
- "Exit" – opens refund modal (Service 24) – Manager only.

### B. Admission Wizard (Modal)

**Step 1: Personal Details**
- Name (text, required)
- Phone (E.164, real‑time duplicate check)
- Parent Phone (optional)
- Email (optional)
- College (optional)
- Photo upload (file)
- Documents upload (Aadhar, ID proof)
- **On phone blur**: Check against `mockBlacklist` – if found, block with message "Phone blacklisted".

**Step 2: Seat & Shift**
- Shift selection (radio: Morning, Evening, Hybrid)
- If Hybrid, show custom slot builder (day checkboxes, time pickers)
- Seat matrix (visual grid, colour‑coded) – click to select
- Conflict detection: show warning if seat occupied for selected time

**Step 3: Plan & Discount**
- Plan selection (cards with price, features)
- Coupon input + "Validate" button (check against `mockCoupons`)
- Group discount toggle (if multiple admissions, but wizard is single; can note for future)

**Step 4: Family Link**
- "Add Sibling?" toggle
- If yes, search existing student to link (relationship dropdown)
- "Set as Guardian" checkbox (auto‑mark dependents)

**Step 5: Payment**
- Security deposit amount (from branch settings, editable)
- Total calculation: plan price + deposit – discount
- Payment mode (cash, UPI, card)
- Transaction ID (if digital)
- "Collect & Complete" button

**On Confirm**: Generate Smart ID using gap‑filling logic (simulate: find smallest missing number). Update mock data.

### C. Seat Assignment (Modal)

- Triggered from "Assign Seat" button (on unallocated student)
- Show seat matrix with available seats highlighted
- Select seat → confirm → updates student's `currentSeat` and seat occupant

### D. Shift Migration (Modal) – Manager only

- In student profile, "Change Shift" button
- Select new shift
- Show fee adjustment (pro‑rated difference)
- Confirm → updates student's shift and seat (if needed)

---

## 💰 3. FEE COLLECTION (`/fees`)

### A. Collect Fee Modal (CRITICAL)

**How to open**:
- From Dashboard "Dues Pending" card
- From Student Directory "Collect Fee" action
- From Fees page search

**Modal content**:
- Student search (autocomplete) – pre‑filled if coming from context
- Invoice card:
  - Base fee (from plan)
  - Due amount (from student)
  - **Late Fee toggle**:
    - If student `lateFeeApplicable` is true, show a switch "Apply Late Fee (₹50)"
    - Manager can toggle on/off; Staff sees it but cannot override (if late fee is auto‑calculated, maybe Staff cannot disable)
  - **Coupon input**: optional, apply if valid
- Payment details:
  - Amount to pay (auto‑filled with due amount, editable but cannot exceed due)
  - Payment mode (cash, UPI, card)
  - Transaction ID (if digital)
- **PTP Option**: Button "Can't pay now? Record Promise" – opens PTP modal (Service 8) with promised amount and date.

**On Submit**:
- Reduce student's due amount
- Add payment to mockPayments
- Update today's collection
- Show toast "Receipt sent via WhatsApp" (simulate)

### B. Dues Manager (Table)

**Table Columns**:
- Student Name, Smart ID, Due Amount, Late Fee Applicable (badge), Last Payment Date, Actions (Collect, Send Reminder)

**Bulk Action**: "Send Reminder" – simulates sending WhatsApp to student's phone (and guardian phone if exists).

---

## 📝 4. ATTENDANCE (`/attendance`)

### A. Mark In/Out Scanner

**Input**: Smart ID (text field or scan simulation)

**On submit**:
- Fetch student from mock
- If student found:
  - Show current status (already checked in? out?)
  - Toggle: **"Notify Guardian?"** (default ON if `parentPhone` exists)
  - Button "Mark In" / "Mark Out"
- **Guardian Logic**: If student is linked as guardian, after marking, show prompt: "Mark attendance for sibling Priya too?" (with checkboxes for dependents). If checked, mark all with same in/out time.
- **Simulation**: Show toast "Message sent to parent: Amit checked in at 10:00 AM"

### B. Absentee List

**Table**:
- Students with attendance missing for >3 consecutive days (simulated)
- Columns: Name, Phone, Parent Phone, Consecutive Absent Days, Actions ("Send Warning" – WhatsApp template)

---

## 📞 5. CRM & LEADS (`/crm`)

### A. Lead Management (Table)

**Columns**:
- Name, Phone, Source (icon), Status (badge), Last Message Sent, Follow‑up Date (highlight if today)
- Actions: "Log Interaction", "Convert to Student", "Send Message"

**"Log Interaction" Modal**:
- Interaction type (call, visit, WhatsApp)
- Notes
- Next follow‑up date (optional)
- Status update (new → visited → interested → converted/lost)

**"Send Message" Modal**:
- Template dropdown (Welcome Offer, Seat Availability Alert)
- Preview message
- Send button → updates `lastMessageSent` and logs interaction

### B. Conversion to Student
- Click "Convert" – opens Admission Wizard pre‑filled with lead's name, phone

---

## 🛠️ 6. DAILY OPS (`/ops`)

### A. Lockers (Service 19)

- **Locker Grid**: Visual matrix (clickable cells)
  - Green: available
  - Red: occupied (shows occupant name on hover)
  - Orange: maintenance
- **Click Green Locker**: Opens "Assign Locker" modal:
  - Student search
  - Monthly fee (from settings, editable)
  - Confirm → updates locker occupant, adds fee to student's dues

### B. Complaints (Service 10)

**Tabs**: Open / Resolved

**Open Complaints Table**:
- Columns: Number, Title, Category, Priority (badge), Student (or "Anonymous"), Created Date, Days Open, Actions
- **Actions**:
  - Staff: "Escalate" (changes priority or flags for manager)
  - Manager: "Assign to me", "Mark In Progress", "Resolve"
- **Resolve Modal**: Resolution notes, "Notify Complainant" checkbox

### C. Expenses (Service 12) – Staff can add, Manager can approve/edit

**Table**:
- Date, Category, Amount, Vendor, Payment Mode, Receipt (link), Actions (Edit, Delete)

**"Add Expense" Modal**:
- Category (select)
- Amount
- Description
- Expense date
- Vendor (optional)
- Bill number (optional)
- GST amount (optional)
- Payment mode
- Receipt upload (file)

### D. Assets (Service 22) – View only for Staff; Manager can add maintenance

**Table**:
- Asset Name, Category, Status, Next Maintenance, Actions ("Request Maintenance" for Staff, "Log Maintenance" for Manager)

**"Maintenance Log" Modal (Manager)**:
- Description, Cost, Vendor, Serviced Date, Next Due Date, Invoice upload

### E. EOD Settlement (Service 13) – Manager Only

**View**:
- Today's cash collections (from payments mode='cash')
- Cash expenses (from expenses mode='cash')
- Expected cash in hand
- Input field: Actual cash in hand
- Variance (actual - expected)
- Notes field
- "Submit Settlement" button

**On Submit**: Add to mock settlements, if variance ≠ 0, flag as "Flagged" and show toast.

---

## 🔐 ROLE-BASED ACCESS CONTROL (RBAC)

- **Staff**:
  - Can collect fees, but cannot override late fee toggle (if late fee auto‑applies, they can't disable)
  - Can mark attendance, add leads, log interactions, add expenses, view lockers, escalate complaints
  - Cannot perform EOD settlement, cannot delete expenses, cannot handle refunds, cannot override late fees
- **Manager**:
  - Can do everything Staff can
  - Plus: toggle late fee on/off, apply refunds (from student exit), perform EOD settlement, delete expenses, resolve complaints, add maintenance logs

Implement a **role toggle in topbar** (for demo) to switch between Manager and Staff views, disabling/enabling actions accordingly.

---

## 🧨 INTERACTIVITY & VALIDATION RULES

1. **Blacklist Check**: On admission phone blur, if phone in `mockBlacklist`, show error and block form submission.
2. **Seat Maintenance Warning**: If assigning a seat marked "maintenance", show warning before proceeding.
3. **PTP Date Validation**: Promised date must be future.
4. **Fee Collection**:
   - Amount cannot exceed due amount.
   - If payment mode is digital, transaction ID required.
5. **Attendance**:
   - Cannot mark future dates.
   - If marking in and student already marked in, ask to mark out.
6. **Guardian Attendance**: When guardian is marked, show prompt to mark dependents.
7. **Optimistic UI**: All updates (fee collection, seat assignment) should immediately reflect in lists (remove from pending, update counts).
8. **Toast Notifications**: For every action (success, error, warning).

---

## ✅ EXPECTED DELIVERABLES

The AI should generate a complete Next.js project with:
- All pages: Dashboard, Students, Fees, Attendance, CRM, Ops.
- All components (modals, tables, charts) in `components` folder.
- Mock data in `lib/opsData.ts` as specified.
- Global layout with role toggle.
- Fully interactive UI with validation and real‑time updates (simulated).
- RBAC implemented – certain buttons disabled for Staff.

**Copy this prompt into Bolt.new or any AI UI builder and it will generate the entire Operations Console, ready for live testing.**