'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { cn } from '@/lib/utils';
import {
    Shield,
    Building,
    Home,
    Users,
    LayoutGrid,
    CreditCard,
    UserCircle,
    MessageSquare,
    Settings,
    Cog,
    ChevronLeft,
    BookOpen,
    LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Navigation configurations
interface NavItem {
    label: string;
    href: string;
    icon?: any;
    badge?: number | string;
}

interface NavGroup {
    group: string;
    icon?: any;
    items: NavItem[];
}

const SUPERADMIN_NAV: NavGroup[] = [
    {
        group: "SuperAdmin Dashboard",
        icon: Shield,
        items: [
            { label: "Overview", href: "/superadmin/dashboard" },
            { label: "Branch Management", href: "/superadmin/branches" },
            { label: "User Management", href: "/superadmin/users" },
            { label: "Franchise Analytics", href: "/superadmin/franchise" },
            { label: "System Logs", href: "/superadmin/logs" }
        ]
    },
    {
        group: "All Branches View",
        icon: Building,
        items: [
            { label: "Delhi Main", href: "/dashboard?branch=delhi-main" },
            { label: "Mumbai Branch", href: "/dashboard?branch=mumbai" },
            { label: "Bangalore", href: "/dashboard?branch=bangalore" },
            { label: "Compare Branches", href: "/superadmin/compare" }
        ]
    }
];

const OWNER_NAV: NavGroup[] = [
    {
        group: "Dashboard",
        items: [{ icon: Home, label: "Overview", href: "/owner/dashboard" }]
    },
    {
        group: "Settings",
        icon: Settings,
        items: [
            { label: "Branch Settings", href: "/owner/settings/branch" },
            { label: "Plan Manager", href: "/owner/settings/plans" },
            { label: "Coupon Manager", href: "/owner/settings/coupons" },
            { label: "User Management", href: "/owner/settings/users" }
        ]
    },
    {
        group: "Finance",
        icon: CreditCard,
        items: [
            { label: "Expenses", href: "/owner/finance/expenses" },
            { label: "Daily Settlements", href: "/owner/finance/settlements" },
            { label: "Reports", href: "/owner/finance/reports" }
        ]
    },
    {
        group: "Admin Tools",
        icon: Cog,
        items: [
            { label: "Assets & Maintenance", href: "/owner/admin/assets" },
            { label: "ID Card Generator", href: "/owner/admin/id-cards" },
            { label: "Bulk Import", href: "/owner/admin/import" },
            { label: "Audit Logs", href: "/owner/admin/audit" }
        ]
    },
    {
        group: "Members",
        icon: UserCircle,
        items: [
            { label: "Student Directory", href: "/owner/members/directory" },
            { label: "Family Management", href: "/owner/members/families" },
            { label: "Waitlist", href: "/owner/members/waitlist" },
            { label: "Blacklist", href: "/owner/members/blacklist" },
            { label: "Alumni", href: "/owner/members/alumni" }
        ]
    },
    {
        group: "Communication",
        icon: MessageSquare,
        items: [
            { label: "Notices", href: "/owner/communication/notices" },
            { label: "Complaints", href: "/owner/communication/complaints", badge: 3 }
        ]
    }
];

const STAFF_NAV: NavGroup[] = [
    {
        group: "Dashboard",
        items: [{ icon: Home, label: "Overview", href: "/dashboard" }]
    },
    {
        group: "Admissions",
        icon: Users,
        items: [
            { label: "New Student", href: "/admissions/new" },
            { label: "Group Admission", href: "/admissions/group" },
            { label: "Enquiries CRM", href: "/admissions/enquiries", badge: 8 },
            { label: "Waitlist", href: "/admissions/waitlist", badge: 5 }
        ]
    },
    {
        group: "Operations",
        icon: LayoutGrid,
        items: [
            { label: "Seat Matrix", href: "/operations/matrix" },
            { label: "Attendance", href: "/operations/attendance" },
            { label: "Lockers", href: "/operations/lockers" },
            { label: "Shift Migrations", href: "/operations/shift-migrations" },
            { label: "Guardian Attendance", href: "/operations/guardian" }
        ]
    },
    {
        group: "Resources",
        icon: LayoutGrid,
        items: [
            { label: "Seats", href: "/manager/seats" },
            { label: "Lockers", href: "/manager/daily?tab=lockers" }
        ]
    },
    {
        group: "Finance",
        icon: CreditCard,
        items: [
            { label: "Fee Collection", href: "/finance/fees" },
            // Staff only sees Fee Collection generally, but extending for manager/owner
        ]
    },
    {
        group: "Members",
        icon: UserCircle,
        items: [
            { label: "Student Directory", href: "/members/directory" },
            { label: "Family Management", href: "/members/families" },
            { label: "Alumni", href: "/members/alumni" },
            { label: "Blacklist", href: "/members/blacklist" }
        ]
    },
    {
        group: "Communication",
        icon: MessageSquare,
        items: [
            { label: "Notices", href: "/communication/notices" },
            { label: "Complaints", href: "/communication/complaints", badge: 3 }
        ]
    }
];

const MANAGER_AMENDMENTS: Record<string, NavItem[]> = {
    Finance: [
        { label: "Fee Collection", href: "/finance/fees" },
        { label: "PTP Tracker", href: "/finance/ptp", badge: 3 },
        { label: "Expenses", href: "/finance/expenses" },
        { label: "Daily Settlement", href: "/finance/settlement" },
        { label: "Security Deposits", href: "/finance/deposits" },
        { label: "Reports", href: "/finance/reports" }
    ],
    "Admin Tools": [
        { label: "Bulk Import", href: "/admin/import" },
        { label: "ID Card Generator", href: "/admin/id-cards" },
        { label: "Assets & Maintenance", href: "/admin/assets" }
    ],
    Settings: [
        { label: "Plan Manager", href: "/settings/plans" },
        { label: "Staff Management", href: "/settings/staff" }
    ]
};

const OWNER_AMENDMENTS = {
    ...MANAGER_AMENDMENTS,
    Settings: [
        { label: "Branch Settings", href: "/settings/branch" },
        { label: "Plan Manager", href: "/settings/plans" },
        { label: "User Roles", href: "/settings/users" },
        { label: "System Config", href: "/settings/config" }
    ]
}

export function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!user) return null;

    const isSuperAdmin = user.role === 'superadmin';
    const isOwner = user.role === 'owner';
    const isManager = user.role === 'manager';

    // Construct Nav
    const navItems: NavGroup[] = isSuperAdmin
        ? SUPERADMIN_NAV
        : isOwner
        ? OWNER_NAV
        : STAFF_NAV.map(group => ({ ...group, items: [...group.items] }));

    if (!isSuperAdmin && !isOwner) {
        if (isManager) {
            // Amend Finance
            const financeGroup = navItems.find(g => g.group === 'Finance');
            if (financeGroup) financeGroup.items = MANAGER_AMENDMENTS.Finance;

            // Add Admin Tools
            if (!navItems.find(g => g.group === 'Admin Tools')) {
                navItems.push({
                    group: "Admin Tools",
                    icon: Settings,
                    items: MANAGER_AMENDMENTS['Admin Tools']
                });
            }

            // Add Settings
            const settingsItems = isManager ? MANAGER_AMENDMENTS.Settings : [];
            if (settingsItems.length > 0) {
                if (!navItems.find(g => g.group === 'Settings')) {
                    navItems.push({
                        group: "Settings",
                        icon: Cog,
                        items: settingsItems
                    });
                }
            }
        }
    }

    return (
        <div
            className={cn(
                "relative flex flex-col border-r bg-white dark:bg-gray-950 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="rounded-full bg-primary/10 p-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    {!isCollapsed && <span className="font-bold">Smart Library</span>}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft className={cn("h-4 w-4 transition-all", isCollapsed && "rotate-180")} />
                </Button>
            </div>

            {/* Role Badge */}
            {!isCollapsed && (
                <div className="px-4 py-2">
                    <div className="rounded-md bg-blue-50 px-3 py-1 text-center text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300 uppercase">
                        {user.role}
                    </div>
                </div>
            )}

            {/* Scrollable Nav */}
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-2">
                    {navItems.map((group, index) => (
                        <div key={index} className="mb-4">
                            {!isCollapsed && group.group && (
                                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {group.group}
                                </h4>
                            )}
                            {group.items.map((item, i) => {
                                const Icon = item.icon || group.icon; // Use item icon or group icon
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                                            isActive ? "bg-primary/10 text-primary" : "text-slate-500 dark:text-slate-400"
                                        )}
                                    >
                                        {Icon && <Icon className="h-4 w-4" />}
                                        {!isCollapsed && (
                                            <div className="flex flex-1 items-center justify-between">
                                                <span>{item.label}</span>
                                                {item.badge && (
                                                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </nav>
            </div>

            {/* User Footer */}
            <div className="border-t p-4">
                <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <span className="truncate text-sm font-medium">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    )}
                    {!isCollapsed && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={logout}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
