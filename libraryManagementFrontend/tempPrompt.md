# 👑 SMART LIBRARY 360 – OWNER DASHBOARD MASTER PROMPT

**Copy this entire prompt into Bolt.new, Lovable, Stitch, or v0** to generate a complete, production‑ready frontend for the **Owner** role. This prompt includes **every feature**, **every page**, **every modal**, and **every component** with **hardcoded mock data** so you can test live immediately. No backend required – all data is simulated.

---

## 📋 PROJECT OVERVIEW

**Project Name**: Smart Library 360 – Owner Dashboard  
**Role**: **Owner** (full control over one branch)  
**Target Audience**: Library owners managing a single location.  
**Purpose**: Monitor revenue, staff integrity, operational efficiency, and manage branch settings.

**Owner Permissions** (from backend Service 1):
- ✅ Full access to their branch data
- ✅ View all financials (revenue, expenses, P&L, daily settlements)
- ✅ Create/update subscription plans and coupons
- ✅ Create/update **Managers** and **Staff** (users)
- ✅ Access all operational data (students, seats, attendance – read‑only)
- ✅ View reports and analytics
- ✅ Manage branch settings (shifts, fees, rules)
- ✅ Bulk import, ID card generation, asset management
- ✅ View audit logs (for fraud detection)
- ❌ **Cannot** assign seats (Manager does this)
- ❌ **Cannot** mark daily attendance (Staff/Manager do this)
- ❌ **Cannot** create other Owners (only SuperAdmin)
- ❌ **Cannot** delete branch (only SuperAdmin)

**Design System**:
- **Colors**: Slate (900‑50), Indigo (600,500,400,300,100), White.  
  Status: `green` (success/available), `red` (danger/occupied), `orange` (warning/maintenance), `yellow` (expiring), `blue` (info), `red-600` (critical/fraud), `emerald-600` (profit/safe)
- **Typography**: Inter (system fallback)
- **Spacing**: 4px base (Tailwind spacing)
- **Border radius**: `6px` (medium), `8px` (cards)
- **Shadows**: `shadow-sm`, `shadow-md`
- **Components**: Shadcn UI (latest) + custom enterprise components
- **Icons**: Lucide React (sizes 16,20,24)
- **Tables**: TanStack Table v8 (sorting, filtering, pagination)
- **Charts**: Recharts (line, bar, pie, area)
- **Forms**: React Hook Form + Zod
- **Date handling**: date‑fns
- **Notifications**: Sonner toasts
- **Dialogs**: Shadcn Dialog

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
Axios (for future API integration, but use mock data now)
Socket.io‑client (simulated with setInterval)
date‑fns
```

---

## 🧱 MOCK DATA STORE (`lib/mockData.ts`)

Create a TypeScript file exporting all mock data. This data must be **realistic and comprehensive** to power every screen. Use arrays with at least 5‑10 items each, but for tables (students, payments) generate 50+ items using loops.

```typescript
// lib/mockData.ts
import { subDays, format } from 'date-fns';

// Helper to generate dates
const today = new Date();
const yesterday = subDays(today, 1);
const lastWeek = subDays(today, 7);

// Branch (single, owner's branch)
export const mockBranch = {
  id: "branch-1",
  name: "Smart Library - Connaught Place",
  address: "1st Floor, Connaught Place, New Delhi - 110001",
  gstNumber: "07AAACH7409R1ZN",
  panNumber: "AAACH7409R",
  contactNumber: "+911123456789",
  email: "cp@smartlibrary360.com",
  capacity: 100,
  shifts: {
    morning: { start: "06:00", end: "12:00" },
    evening: { start: "12:00", end: "22:00" }
  },
  securityDeposit: 500,
  lateFeePerDay: 50,
  gracePeriodDays: 5,
  lockerMonthlyFee: 200,
  absenteeAlertDays: 3,
  monthlyBudget: {
    rent: 45000,
    utilities: 15000,
    salaries: 35000,
    maintenance: 10000,
    marketing: 8000
  }
};

// Plans
export const mockPlans = [
  { id: "plan-1", name: "Monthly Basic", durationDays: 30, price: 800, features: ["AC", "WiFi"], planType: "basic", studentsCount: 45, isActive: true },
  { id: "plan-2", name: "Monthly Premium", durationDays: 30, price: 1200, features: ["AC", "Locker", "WiFi", "Printing"], planType: "premium", studentsCount: 78, isActive: true },
  { id: "plan-3", name: "Quarterly Premium", durationDays: 90, price: 3200, features: ["AC", "Locker", "WiFi", "Printing"], planType: "premium", studentsCount: 32, isActive: true },
  { id: "plan-4", name: "Yearly Basic", durationDays: 365, price: 8000, features: ["AC", "WiFi"], planType: "basic", studentsCount: 12, isActive: false },
];

// Coupons
export const mockCoupons = [
  { id: "coupon-1", code: "NEWYEAR50", discountType: "fixed", discountValue: 50, validFrom: "2024-01-01", validTill: "2024-01-31", maxUses: 100, usedCount: 23, minOrderAmount: 500, applicablePlans: "all", isActive: true },
  { id: "coupon-2", code: "STUDENT20", discountType: "percent", discountValue: 20, validFrom: "2024-02-01", validTill: "2024-03-01", maxUses: 50, usedCount: 12, minOrderAmount: 0, applicablePlans: ["plan-2", "plan-3"], isActive: true },
];

// Users (Managers & Staff)
export const mockUsers = [
  { id: "user-1", name: "Vikram Singh", phone: "+919876543211", email: "vikram@smartlibrary.com", role: "manager", status: "active", lastLogin: "2024-01-27T10:30:00Z", permissions: ["manage_students", "collect_fees", "view_reports"] },
  { id: "user-2", name: "Priya Sharma", phone: "+919876543212", email: "priya@smartlibrary.com", role: "staff", status: "active", lastLogin: "2024-01-27T09:15:00Z", permissions: ["collect_fees", "mark_attendance"] },
  { id: "user-3", name: "Rahul Gupta", phone: "+919876543213", email: "rahul@smartlibrary.com", role: "staff", status: "inactive", lastLogin: "2024-01-20T08:00:00Z", permissions: ["mark_attendance"] },
];

// Students (generate 50+)
export const mockStudents = Array.from({ length: 50 }, (_, i) => ({
  id: `student-${i+1}`,
  smartId: `LIB${String(i+1).padStart(3, '0')}`,
  name: `Student ${i+1}`,
  phone: `+9198765432${String(i).padStart(2, '0')}`,
  parentPhone: `+9191234567${String(i).padStart(2, '0')}`,
  email: `student${i+1}@gmail.com`,
  college: i % 3 === 0 ? "Delhi University" : i % 3 === 1 ? "Jamia Millia" : "Amity University",
  photoUrl: `/mock/avatar-${(i%5)+1}.png`,
  status: i % 10 === 0 ? "suspended" : "active",
  currentSeat: `A-${(i%20)+1}`,
  shift: i % 2 === 0 ? "Morning" : "Evening",
  dueAmount: i % 7 === 0 ? 500 : 0,
  expiryDate: i % 5 === 0 ? subDays(today, 5).toISOString() : subDays(today, -10).toISOString(),
  trustScore: i % 5, // 0-4
  family: i % 10 === 0 ? { sharedPhone: "+919876543210", relationships: [{ studentId: `student-${i+2}`, type: "brother" }] } : null,
}));

// Seats
export const mockSeats = Array.from({ length: 100 }, (_, i) => ({
  id: i+1,
  number: `A-${String(i+1).padStart(2, '0')}`,
  status: i < 70 ? "occupied" : i < 90 ? "available" : "maintenance",
  occupant: i < 70 ? mockStudents[i % 50].id : null,
  occupantName: i < 70 ? mockStudents[i % 50].name : null,
  expiry: i < 70 ? mockStudents[i % 50].expiryDate : null,
  lastOccupant: i >= 70 ? mockStudents[(i+5) % 50].name : null,
  availableSince: i >= 70 ? subDays(today, Math.floor(Math.random()*10)).toISOString() : null,
  maintenanceReason: i >= 90 ? "Chair repair" : null,
  expectedAvailable: i >= 90 ? subDays(today, -2).toISOString() : null,
}));

// Payments (100+ items)
export const mockPayments = Array.from({ length: 120 }, (_, i) => ({
  id: `pay-${i+1}`,
  studentId: mockStudents[i % 50].id,
  studentName: mockStudents[i % 50].name,
  amount: [500, 800, 1200, 3200][i % 4],
  mode: ["cash", "upi", "card"][i % 3],
  date: subDays(today, Math.floor(Math.random()*30)).toISOString(),
  receivedBy: mockUsers[i % 3].name,
}));

// Enquiries
export const mockEnquiries = [
  { id: "enq-1", name: "Priya Sharma", phone: "+919988776655", source: "walk_in", status: "interested", daysOld: 3, assignedTo: "Vikram Singh", followUpDate: subDays(today, -2).toISOString() },
  { id: "enq-2", name: "Rahul Verma", phone: "+919988776656", source: "google_ads", status: "new", daysOld: 1, assignedTo: "Priya Sharma", followUpDate: subDays(today, -1).toISOString() },
  // ... more
];

// PTPs (Promise to Pay)
export const mockPTPs = [
  { id: "ptp-1", studentId: "student-2", studentName: "Rahul Verma", amount: 450, promisedDate: subDays(today, 2).toISOString(), trustScore: 3, daysOverdue: 2, fulfilled: false, timesChanged: 1 },
  { id: "ptp-2", studentId: "student-5", studentName: "Neha Gupta", amount: 800, promisedDate: subDays(today, -3).toISOString(), trustScore: 5, daysOverdue: 0, fulfilled: true, timesChanged: 0 },
  // ... more
];

// Complaints
export const mockComplaints = [
  { id: "comp-1", number: "CMP-001", title: "AC not working", category: "infrastructure", priority: "high", student: "Amit Kumar", isAnonymous: false, createdDate: subDays(today, 2).toISOString(), daysOpen: 2, status: "open" },
  { id: "comp-2", number: "CMP-002", title: "Noisy environment", category: "noise", priority: "medium", student: null, isAnonymous: true, createdDate: subDays(today, 5).toISOString(), daysOpen: 5, status: "in_progress" },
  // ... more
];

// Notices
export const mockNotices = [
  { id: "notice-1", title: "Holiday on Holi", priority: "important", sentDate: subDays(today, 7).toISOString(), target: "all", deliveryRate: 98 },
  { id: "notice-2", title: "New WiFi password", priority: "general", sentDate: subDays(today, 2).toISOString(), target: "morning", deliveryRate: 85 },
  // ... more
];

// Assets
export const mockAssets = [
  { id: "asset-1", name: "Split AC - 1.5 Ton", category: "HVAC", model: "Voltas 183V", purchaseDate: "2023-12-01", purchaseAmount: 65000, warrantyExpiry: "2025-12-01", status: "working", nextMaintenance: "2024-06-01" },
  { id: "asset-2", name: "Office Chair", category: "Furniture", model: "ErgoPlus", purchaseDate: "2023-06-01", purchaseAmount: 5000, warrantyExpiry: "2024-06-01", status: "maintenance", nextMaintenance: "2024-02-15" },
  // ... more
];

// Daily Settlements
export const mockSettlements = [
  { id: "settle-1", date: yesterday.toISOString(), settledBy: "Vikram Singh", systemCalc: 12500, actualCash: 12500, variance: 0, status: "Balanced", evidence: "/mock/slip1.jpg", notes: "All good" },
  { id: "settle-2", date: subDays(today, 2).toISOString(), settledBy: "Priya Sharma", systemCalc: 9800, actualCash: 9300, variance: -500, status: "Flagged", evidence: "/mock/slip2.jpg", notes: "Short by 500, will check tomorrow" },
];

// Audit Logs
export const mockAuditLogs = [
  { id: "audit-1", timestamp: subDays(today, 1).toISOString(), user: "Vikram Singh", action: "DELETE_PAYMENT", entity: "Payment", details: "Deleted ₹500 cash receipt #123", severity: "Critical", ip: "192.168.1.100" },
  { id: "audit-2", timestamp: subDays(today, 2).toISOString(), user: "Priya Sharma", action: "MANUAL_DISCOUNT", entity: "Subscription", details: "Applied 10% discount to student LIB045", severity: "Medium", ip: "192.168.1.101" },
  // ... more
];

// Waitlist
export const mockWaitlist = [
  { id: "wait-1", name: "Rohit Mehra", phone: "+919876543220", preferredShift: "Morning", joinedDate: subDays(today, 5).toISOString(), status: "Waiting", potentialRevenue: 1200 },
  { id: "wait-2", name: "Anjali Kapoor", phone: "+919876543221", preferredShift: "Evening", joinedDate: subDays(today, 3).toISOString(), status: "Waiting", potentialRevenue: 800 },
  // ... more
];

// Staff Performance (for charts)
export const mockStaffPerformance = [
  { name: "Vikram Singh", revenue: 120000, conversions: 15, attendanceMarked: 450 },
  { name: "Priya Sharma", revenue: 45000, conversions: 8, attendanceMarked: 320 },
  { name: "Rahul Gupta", revenue: 23000, conversions: 4, attendanceMarked: 180 },
];

// Daily revenue for chart
export const mockDailyRevenue = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(today, 29-i), 'yyyy-MM-dd'),
  amount: Math.floor(Math.random() * 15000) + 5000,
}));
```

---

## 🧭 GLOBAL LAYOUT (OWNER-SPECIFIC)

### Sidebar (Left, collapsible)

**Logo**: Smart Library 360 + role badge "👑 OWNER" (blue background).

**Navigation groups** (all icons from Lucide React):

1. **Dashboard**  
   - `Home` – Overview (`/dashboard`)

2. **Settings**  
   - `Settings` – Branch Settings (`/settings/branch`)  
   - `Package` – Plan Manager (`/settings/plans`)  
   - `Ticket` – Coupon Manager (`/settings/coupons`)  
   - `Users` – User Management (`/settings/users`)

3. **Finance**  
   - `Receipt` – Expenses (`/finance/expenses`)  
   - `Wallet` – Daily Settlements (`/finance/settlements`)  
   - `BarChart3` – Reports (`/finance/reports`)

4. **Admin Tools**  
   - `Wrench` – Assets & Maintenance (`/admin/assets`)  
   - `IdCard` – ID Card Generator (`/admin/id-cards`)  
   - `Upload` – Bulk Import (`/admin/import`)  
   - `Shield` – Audit Logs (`/admin/audit`)

5. **Members**  
   - `UserCircle` – Student Directory (`/members/directory`)  
   - `Heart` – Family Management (`/members/families`)  
   - `Clock` – Waitlist (`/members/waitlist`)  
   - `Ban` – Blacklist (`/members/blacklist`)  
   - `GraduationCap` – Alumni (`/members/alumni`)

6. **Communication**  
   - `Megaphone` – Notices (`/communication/notices`)  
   - `MessageSquare` – Complaints (`/communication/complaints`)

**Bottom of sidebar**:  
- Current branch name + status indicator (active).  
- Collapse/expand toggle.

### Topbar (Fixed)

- **Breadcrumb** (e.g., Dashboard / Finance / Expenses)
- **Global search** (debounced) – searches students, enquiries, payments (using mock data)
- **Notifications drawer** (bell icon with badge):
  - Overdue PTPs count
  - New complaints count
  - Flagged settlements count
  - Waitlist openings count
- **User dropdown**:
  - Profile (name, email, role)
  - Settings (shortcut to `/settings/branch`)
  - Logout (simulated toast)

---

## 🏠 1. DASHBOARD (`/dashboard`)

**Layout**: 3-Row Grid.

### Row 1 – Strategic KPIs (4 cards)

| Card | Mock Data Source | Visual |
|------|------------------|--------|
| **Monthly Revenue** | Sum of `mockPayments` where date in current month | ₹125,000 (target ₹150,000) with progress bar, icon `CreditCard` |
| **Active Students** | Count of `mockStudents` with status 'active' | 85 / 100 capacity, icon `Users` |
| **Cash in Hand (Today)** | From `mockSettlements` latest entry (systemCalc) | ₹12,500, icon `Wallet` |
| **Flagged Settlements** | Count of `mockSettlements` with status 'Flagged' | 1 (red card), icon `AlertTriangle`, click opens `/finance/settlements` |

**Click Actions**:
- Click on any card → navigate to relevant page (e.g., Monthly Revenue → `/finance/reports`)

### Row 2 – Analytics (2 columns)

**Left (60%) – Revenue Trend Chart**  
- AreaChart using `mockDailyRevenue` (last 30 days).  
- X‑axis: date, Y‑axis: amount.  
- Tooltip shows date and amount.  
- Toggle between "Daily" and "Cumulative".

**Right (40%) – Staff Leaderboard**  
- BarChart using `mockStaffPerformance` (revenue per staff).  
- Click bar → opens modal with staff details (name, total collections, conversions).

### Row 3 – Operational Snapshot (3 columns)

**Left (33%) – Mini Seat Matrix (10×10 grid)**  
- Grid cells (12×12 px) with status colours:  
  - Green: available (mockSeats where status='available')  
  - Red: occupied (status='occupied')  
  - Orange: maintenance (status='maintenance')  
  - Yellow: expiring (occupant expiry < 3 days)  
- Tooltip on hover: seat number, student name (if occupied), expiry.  
- Click → navigate to read-only seat view (no assignment).

**Middle (33%) – Recent Audit Alerts**  
- List last 3 `mockAuditLogs` with severity 'Critical' or 'High'.  
- Each item: timestamp, user, action (bold), severity badge.  
- Click item → open audit log detail modal.

**Right (33%) – Waitlist Summary**  
- Card: "Potential Revenue: ₹5,000" (sum of `mockWaitlist` potentialRevenue).  
- List top 3 waitlisted names with shift.  
- "View All" link → navigate to `/members/waitlist`.

---

## ⚙️ 2. SETTINGS MODULE

### 2.1 Branch Settings (`/settings/branch`)

**Tabs**:

**Tab 1: General Information** (read‑only, from `mockBranch`)  
- Name, Address, GST, PAN, Contact, Email, Capacity.

**Tab 2: Operating Hours** (editable)  
- Morning shift: start time (06:00), end time (12:00) – time pickers.  
- Evening shift: start time (12:00), end time (22:00) – time pickers.  
- "Enable Hybrid Scheduling" toggle.

**Tab 3: Fee Rules** (editable)  
- Security deposit amount (number, default 500)  
- Late fee per day (number, default 50)  
- Grace period (days, default 5)  
- Locker monthly fee (number, default 200)  
- Absentee alert after (days, default 3)

**Tab 4: Holiday Calendar**  
- List of holidays (date, reason, annual toggle) from mock data (create a small array).  
- "Add Holiday" button → modal with date picker, reason, "Recurring annually" checkbox.

**Tab 5: Notifications**  
- Parent alert after X absences (slider, min 1 max 10)  
- Renewal reminder days before expiry (slider, default 7)  
- PTP reminder schedule (dropdown: daily, every 3 days, weekly)

**Save button** – shows toast "Settings updated successfully" and updates local state.

### 2.2 Plan Manager (`/settings/plans`)

**Table** (TanStack):
- Columns: Name, Duration (days), Price (₹), Features (icons), Students Count, Status (toggle), Actions (Edit, Deactivate).
- Sorting on Name, Price, Students.
- Filter by Status (Active/Inactive).

**"Add Plan" Modal** (Service 20.1):
- Name (text, required)
- Description (textarea, optional)
- Duration (days, number, required)
- Price (number, required)
- Features (multi‑select: "AC", "Locker", "WiFi", "Printing", "Extended Hours")
- Plan type (radio: basic, premium)
- Max students (number, optional)
- Discount percent (number, optional)
- Active (toggle, default true)
- Zod validation: name min 3 chars, price > 0, duration > 0.

**"Edit Plan" Modal** – pre-filled with existing data, same fields.

**Deactivate** – confirmation dialog, then set `isActive` to false in mock data.

### 2.3 Coupon Manager (`/settings/coupons`)

**Table**:
- Columns: Code, Discount (type + value), Valid From, Valid Till, Uses (used/max), Status (Active/Expired), Actions (Edit, Deactivate, Delete).
- Filter by Status.

**"Add Coupon" Modal** (Service 21.1):
- Code (text, auto‑generate option with button)
- Description (textarea, optional)
- Discount type (radio: percentage / fixed)
- Discount value (number, required)
- Valid from (date picker, required)
- Valid till (date picker, required, must be after from)
- Max uses (number, optional, must be > 0)
- Min order amount (number, optional, default 0)
- Applicable plans (multi‑select, or "All plans" radio)
- Active (toggle, default true)
- Zod validation.

### 2.4 User Management (`/settings/users`)

**Table** (TanStack):
- Columns: Name, Phone, Role (badge: Manager=blue, Staff=gray), Status (Active/Inactive), Last Login, Actions (Edit, Reset Password, Deactivate).
- Filter by Role, Status.

**"Add User" Modal** (Service 1.1) – Owner can create **Manager** or **Staff**:
- Name (text, required)
- Phone (E.164 format, required)
- Email (email, optional)
- Password (auto‑generate toggle, or manual with strength meter)
- Role (select: manager, staff)
- Permissions (checkboxes based on role – pre-populated, can customize)
  - For Manager: "Manage Students", "Collect Fees", "View Reports", "Mark Attendance"
  - For Staff: "Collect Fees", "Mark Attendance", "View Students"
- Send welcome email (checkbox, default true)
- Active (toggle, default true)
- Zod validation.

**"Edit User" Modal** – same fields, password optional.

**"Reset Password" Modal** – auto‑generate or manual, force change on next login checkbox.

---

## 💰 3. FINANCE MODULE

### 3.1 Expenses (`/finance/expenses`)

**Table** (TanStack):
- Columns: Date, Category, Amount, Vendor, Payment Mode, Receipt (link icon), Actions (Edit, Delete).
- Filter by Category, Date Range.
- Sorting by Date, Amount.

**"Add Expense" Modal** (Service 12.2):
- Category (select: Rent, Utilities, Salaries, Maintenance, Marketing, Other)
- Amount (number, required)
- Description (textarea, optional)
- Expense date (date picker, default today)
- Vendor name (text, optional)
- Bill number (text, optional)
- GST amount (number, auto‑calculated if category has GST, editable)
- Payment mode (select: cash, bank_transfer, cheque, UPI)
- Receipt upload (file – simulate by showing file name after upload)
- Zod validation.

**Budget Tracking Cards** (above table):
- For each category, show monthly budget (from `mockBranch.monthlyBudget`) and spent amount (sum of expenses this month).
- Progress bar: green if <80%, yellow if 80‑100%, red if >100%.

### 3.2 Daily Settlements (`/finance/settlements`) – Service 13 (CRITICAL)

**Purpose**: Anti‑theft. Verify if managers deposited correct cash.

**Table** (TanStack):
- Columns: Date, Settled By, System Calculation (₹), Actual Cash (₹), Variance (₹), Status (Badge: Balanced=green, Flagged=red), Evidence (link), Actions (View Details).
- Highlight rows where Variance < 0 (cash shortage) with light red background.

**"View Details" Modal** (click on row):
- Shows settlement details: date, staff, system vs actual.
- Displays "Bank Deposit Slip" image placeholder (simulate from evidence URL).
- Manager notes field (editable by Owner? Owner can add note).
- "Mark as Reviewed" button (updates status to "Reviewed" in mock).

**Flagged Settlement Alert** on dashboard (already implemented).

### 3.3 Reports (`/finance/reports`) – Service 15

**Tabs**:

**Tab 1: P&L Statement** (Service 12.3)
- Date range selector (default current month).
- Summary cards:
  - Total Revenue (from payments)
  - Total Expenses (from expenses)
  - Gross Profit
  - Net Profit (after tax, assume 18% tax)
  - Profit Margin %
- Bar chart: monthly comparison of revenue vs expenses.

**Tab 2: Revenue Report**
- Daily collection line chart (from `mockDailyRevenue`).
- Payment mode breakdown (pie chart: cash, UPI, card).
- Staff collection leaderboard (table with staff name, total collected, number of transactions).

**Tab 3: Occupancy Report** (Service 5.4)
- Average occupancy per shift (cards).
- Revenue per seat (table: seat number, student name, total revenue generated).
- Occupancy heatmap (calendar view with colour by % – use mock data).

**Tab 4: Student Report**
- New admissions vs exits (line chart over months).
- Retention rate (cohort table).
- Student distribution by plan (pie chart).

**Export buttons** (simulate PDF/Excel download with toast).

---

## 🛠️ 4. ADMIN TOOLS

### 4.1 Assets & Maintenance (`/admin/assets`) – Service 22

**Table** (TanStack):
- Columns: Asset Name, Category, Model, Purchase Date, Warranty Expiry, Status (badge), Next Maintenance, Actions (Edit, Log Maintenance).
- Filter by Category, Status.

**"Add Asset" Modal** (Service 22.1):
- Name (text, required)
- Category (select: HVAC, Furniture, Electronics, Other)
- Quantity (number, default 1)
- Purchase Date (date picker)
- Purchase Amount (number)
- Vendor (text, optional)
- Warranty (months, number)
- Model (text)
- Location (text)
- Photo upload (file – simulate)

**"Maintenance Log" Modal** (click on asset row):
- Service type (select: preventive, repair)
- Description (textarea)
- Cost (number)
- Vendor (text)
- Serviced Date (date picker)
- Next Due Date (date picker)
- Invoice upload (file – simulate)

**Maintenance Alerts** widget on dashboard (if any assets with nextMaintenance < 7 days).

### 4.2 ID Card Generator (`/admin/id-cards`) – Service 16

**Single Card Generation**:
- Student search (autocomplete with name, smart ID, photo) using `mockStudents`.
- Preview card with photo, name, smart ID, QR code (QR code contains student data as string).
- "Generate PDF" button – triggers toast "ID Card generated" and simulates download.

**Bulk Generation**:
- Student selector table with checkboxes (paginated).
- "Generate All" – creates a zip of PDFs (simulate with toast).
- Template Selector (dropdown: default, premium, custom).

### 4.3 Bulk Import (`/admin/import`) – Service 14

**Interface**:
- "Download Template" button (CSV/Excel) – simulates download.
- File upload area (drag & drop) – accepts .xlsx, .csv.
- Column mapping (if custom file) – show dropdowns to map columns.
- Preview of first 10 rows with validation status (green/red).

**Import Progress**:
- Show progress bar (simulated with setInterval for 3 seconds).
- After completion: success count, failure count, download error report button.
- "Rollback" button (if import was wrong) – reverts changes in mock data.

### 4.4 Audit Logs (`/admin/audit`) – Service 25 (CRITICAL)

**Purpose**: Fraud detection.

**Filters**:
- Severity (Critical, High, Medium, Low) – multi‑select.
- User (select from mockUsers)
- Date range (date pickers)

**Table** (TanStack virtualized for large datasets):
- Columns: Timestamp, User (avatar + name), Action (bold), Entity, Details (truncated), Severity (badge), IP Address.
- Red background for rows with action "DELETE" or severity "Critical".

**Click row** → opens **Audit Diff Modal**:
- Shows old vs new values in a diff viewer (side‑by‑side).
- For deleted entities, shows a red "Deleted" badge.

**Real‑time simulation**: Every 30 seconds, a new audit log appears (push via simulated socket). Update table automatically.

---

## 👥 5. MEMBERS MODULE

### 5.1 Student Directory (`/members/directory`) – Service 4

**Table** (TanStack with advanced filtering):
- Columns: Smart ID, Name, Phone, Current Seat, Shift, Plan (from subscription), Due Amount (red if >0), Expiry Date (highlight if <7 days), Trust Score (⭐ rating, 0‑5), Status (badge).
- Filters: Status, Shift, Plan, Due Payment (yes/no).
- Global search across name, phone, smart ID.

**Row actions**:
- "View Profile" – opens student profile page (see below).
- "Collect Fee" – opens fee collection modal (but Owner may not collect, so maybe just view due).
- "Send Message" – opens WhatsApp modal (simulated).

**Student Profile Page** (`/members/students/[id]`):

**Tabs**:

**Tab 1: Overview**
- Personal info card (photo, name, phone, parent phone, email, college)
- Documents (Aadhar, ID proof) – view/download links (simulate)
- Current seat & shift (read‑only)
- Trust score (⭐ rating)
- Family tree visualization (if family exists, show nodes with relationship lines, guardian icon)

**Tab 2: Subscription**
- Current plan details (name, price, start, end)
- Payment history table (date, amount, mode, received by)
- Upcoming renewals (if any)

**Tab 3: Attendance**
- Calendar view (month grid) with present/absent dots (mock data)
- Monthly attendance % (card)
- Absence pattern analysis (e.g., "Mostly absent on Mondays")

**Tab 4: Activity**
- Login history (if app access) – mock data
- Complaint history (table of complaints filed by this student)
- Referral tracking (if referred others)

**Actions**:
- Suspend/Reactivate (toggle)
- Exit (with refund calculation modal)

### 5.2 Family Management (`/members/families`)

**Family Groups Table**:
- Primary member, Phone, Members count, Guardian name

**Click row** → expand **Family Tree** visual:
- Interactive tree with nodes (student names)
- Relationship lines labelled (brother, sister, etc.)
- Guardian icon (👑) on primary
- Click node → quick popup with student details (name, phone, due amount)

**"Add to Family" button**:
- Search existing student (autocomplete)
- Select relationship (brother, sister, cousin, other)
- Set as guardian toggle
- Save → updates mock data and re-renders tree

### 5.3 Waitlist (`/members/waitlist`) – Service 17

**Top Card**: "Potential Revenue: ₹5,000" (sum of `mockWaitlist` potentialRevenue).

**Table**:
- Columns: Priority (drag handle), Name, Phone, Preferred Shift, Joined Date (days waiting), Status (Waiting, Notified, Converted), Actions (Notify, Remove).
- Drag rows to reorder priority (simulate priority change).

**"Add to Waitlist" Modal**:
- Student search (or "New Person" option)
- Preferred shift (select)
- Preferred slots (if custom, show time pickers)
- Max wait days (number, default 30)
- Notification preference (whatsapp, sms, email, all)
- Notes

**Auto‑notify simulation**: When a seat becomes available (simulate with button "Free Seat"), show toast "Notifying top 3 waitlist entries".

### 5.4 Blacklist (`/members/blacklist`) – Service 18

**Table**:
- Columns: Phone, Name, Reason, Severity (badge: high=red, medium=orange, low=yellow), Added By, Date, Actions (Remove).
- Filter by Severity.

**"Add to Blacklist" Modal** (Service 18.1):
- Phone (required, E.164)
- Name (required)
- Reason (textarea, required)
- Severity (select: high, medium, low)
- Evidence URLs (file upload, optional)
- "Share with other branches" (disabled since Owner has one branch)

**Remove** – confirmation dialog, then remove from mock data.

### 5.5 Alumni (`/members/alumni`) – Service 4.6

**Table**:
- Columns: Name, Smart ID, Exit Date, Reason, Forward Address (optional), Actions (Re‑admit).
- Filter by Exit Date.

**"Re‑admit"** – opens admission wizard (Service 4.1) pre‑filled with student data (name, phone, etc.) but with new seat selection (read‑only for Owner? Actually Owner can view but not assign seats, so maybe just view and then Manager does admission).

---

## 📢 6. COMMUNICATION MODULE

### 6.1 Notices (`/communication/notices`) – Service 11

**Table**:
- Columns: Title, Priority (badge: emergency=red, important=orange, general=blue), Sent Date, Target, Delivery Rate (%), Actions (View Report, Delete).

**"Create Notice" Modal** (Service 11.1):
- Title (text, required)
- Message (textarea, required, markdown support)
- Priority (select: general, important, emergency)
- Target audience (select: all students, morning shift, evening shift, custom)
- Channels (checkboxes: WhatsApp, SMS, Email, In‑app) – at least one.
- Schedule (toggle: immediate or date‑time picker)
- Attachments (file upload, optional)

**Delivery Report** (click on notice):
- Modal with total sent, failed, read receipts (mock data).
- List of failed deliveries with reason.

### 6.2 Complaints (`/communication/complaints`) – Service 10

**Tabs**: Open / Resolved

**Open Complaints Table**:
- Columns: Complaint Number, Title, Category (badge), Priority (badge), Student (or "Anonymous"), Created Date, Days Open, Actions (Assign, Mark In Progress, Resolve).

**"Resolve" Modal**:
- Resolution notes (textarea)
- Status (resolved, closed)
- Notify complainant (checkbox, default true)

**Resolved Complaints Table**:
- Same columns + Resolved Date, Resolution Notes.

**Add Complaint** button (for Owner to add on behalf of student) – modal with title, description, category, priority, student (optional), anonymous toggle.

---

## 🔄 7. REAL‑TIME SIMULATION

- Use `setInterval` in a React context to simulate socket events.
- Every 30 seconds, push a new notification (e.g., "New complaint filed", "Settlement flagged").
- Update notification badge in topbar.
- For audit logs, add a new entry every minute (simulate).
- For waitlist, randomly free a seat and show toast "Seat available! Notifying waitlist".

---

## 🧨 INTERACTION & BEHAVIOR RULES

1. **Buttons must work**: Every "Add", "Edit", "Delete", "Save" button must open a Shadcn Dialog or trigger a Sonner toast.
2. **Optimistic UI**: When adding/editing/deleting in mock data, the UI should update immediately (update local state).
3. **Validation**: All forms must use React Hook Form + Zod with error messages displayed inline.
4. **Responsive**: Sidebar collapses into a Sheet component on mobile. Tables scroll horizontally.
5. **Empty States**: If a table has no data, show a "No records found" illustration.
6. **Loading States**: Show skeleton loaders for initial data fetch (even with mock data, simulate a 300ms delay).

---

## ✅ EXPECTED DELIVERABLES

The AI should generate a complete Next.js project with:
- All pages listed above, with proper routing.
- All components (tables, modals, charts) in the `components` folder.
- Mock data in `lib/mockData.ts` as specified.
- Global layout with sidebar and topbar.
- Fully interactive UI (forms submit, tables filter, charts render, toasts appear).
- Simulated real‑time updates.
- No backend required – everything works with hardcoded data.

**Copy this prompt into Bolt.new or any AI UI builder and it will generate the entire Owner dashboard, ready for live testing.**