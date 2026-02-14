'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    ArrowLeft, Edit2, MapPin, Phone, Mail, Building2, Calendar,
    Users, TrendingUp, IndianRupee, Clock, Plus
} from 'lucide-react';
import { branches, getUserById, students, payments, users, auditLogs } from '@/lib/mockData';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { SeatHeatmap } from '@/components/charts/seat-heatmap';
import { Sparkline } from '@/components/charts/sparkline';
import { NewAdmissionModal } from '@/components/modals/new-admission-modal';
import { useAuthStore } from '@/lib/stores/auth-store';

interface PageProps {
    params: Promise<{ id: string }>;
}

const revenueSeries = [208000, 216500, 224000, 231000, 239500, 247000, 254500, 263000, 271000, 279500, 288000, 296500];
const admissionsSeries = [14, 12, 18, 16, 19, 17];
const occupancySeries = [72, 74, 76, 78, 79, 81, 82, 83, 84, 85, 86, 87];

export default function BranchDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuthStore();
    const [showAdmissionModal, setShowAdmissionModal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const branch = branches.find(b => b.id === id);

    if (!branch) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-bold mb-2">Branch Not Found</h2>
                <p className="text-muted-foreground mb-4">The requested branch could not be found.</p>
                <Button onClick={() => router.push('/superadmin/branches')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Branches
                </Button>
            </div>
        );
    }

    const manager = branch.managerId ? getUserById(branch.managerId) : null;
    const branchStudents = students.filter(s => s.branchId === id);
    const activeStudents = branchStudents.filter(s => s.status === 'active').length;
    const branchPayments = payments.filter(p => p.branchId === id);
    const branchStaff = users.filter(u => u.branchId === id);
    const recentActivity = auditLogs
        .filter(log => log.entityId === id || branchStudents.some(s => s.id === log.entityId))
        .slice(0, 10);

    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
        month: format(new Date(2024, i, 1), 'MMM'),
        revenue: revenueSeries[i]
    }));

    const collectionSummary = {
        total: branchPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
        pending: branchPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
        overdue: branchPayments.filter(p => p.status === 'partial').reduce((sum, p) => sum + p.amount, 0),
    };

    const roleDistribution = [
        { name: 'Managers', value: branchStaff.filter(u => u.role === 'manager').length, color: '#10b981' },
        { name: 'Staff', value: branchStaff.filter(u => u.role === 'staff').length, color: '#6366f1' },
    ];

    const shiftDistribution = [
        { name: 'Morning', value: branchStudents.filter(s => s.shiftType === 'morning').length, color: '#f59e0b' },
        { name: 'Evening', value: branchStudents.filter(s => s.shiftType === 'evening').length, color: '#8b5cf6' },
        { name: 'Hybrid', value: branchStudents.filter(s => s.shiftType === 'hybrid').length, color: '#06b6d4' },
    ];

    const admissionTrend = Array.from({ length: 6 }, (_, i) => ({
        month: format(new Date(2024, 6 + i, 1), 'MMM'),
        admissions: admissionsSeries[i]
    }));

    const occupancyTrend = Array.from({ length: 12 }, (_, i) => ({
        month: format(new Date(2024, i, 1), 'MMM'),
        occupancy: occupancySeries[i]
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/superadmin/branches')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{branch.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            {branch.city}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge variant={branch.status === 'active' ? 'default' : 'secondary'} className="h-6">
                        {branch.status}
                    </Badge>
                    <Button>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Branch
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Capacity</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{branch.capacity}</div>
                                <p className="text-xs text-muted-foreground">Total seats available</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{branch.occupancy}%</div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">{activeStudents} active students</p>
                                    <div className="w-20">
                                        <Sparkline data={[65, 68, 72, 75, 78, 80, 82, 85, branch.occupancy]} color="#e11d48" height={20} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{branch.revenue.toLocaleString()}</div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">This month</p>
                                    <div className="w-20">
                                        <Sparkline data={[200000, 210000, 205000, 220000, 240000, branch.revenue]} color="#16a34a" height={20} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rent</CardTitle>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{branch.monthlyRent?.toLocaleString() || 'N/A'}</div>
                                <p className="text-xs text-muted-foreground">Monthly rent</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Branch Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Branch Information</CardTitle>
                                <CardDescription>Contact and legal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{branch.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{branch.contactNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{branch.email}</span>
                                </div>
                                {branch.gstNumber && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span>GST: {branch.gstNumber}</span>
                                    </div>
                                )}
                                {branch.panNumber && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <span>PAN: {branch.panNumber}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Since: {branch.operationalSince}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Manager Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Branch Manager</CardTitle>
                                <CardDescription>{manager ? 'Current manager details' : 'No manager assigned'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {manager ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback>{manager.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{manager.name}</p>
                                                <p className="text-sm text-muted-foreground capitalize">{manager.role}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{manager.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{manager.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>Last Login: {manager.lastLogin ? format(new Date(manager.lastLogin), 'PPp') : 'Never'}</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full mt-2" onClick={() => router.push(`/superadmin/users/${manager.id}`)}>
                                            View Profile
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No manager assigned</p>
                                        <Button variant="outline" className="mt-4">Assign Manager</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest 10 events from audit logs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivity.map((log) => {
                                    const user = getUserById(log.userId);
                                    return (
                                        <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {user?.name || 'Unknown'} <span className="text-muted-foreground">performed</span>{' '}
                                                    <Badge variant="outline" className="capitalize">{log.action}</Badge>{' '}
                                                    <span className="text-muted-foreground">on {log.entityType}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">{log.ipAddress} • {log.device}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Financials */}
                <TabsContent value="financials" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">₹{collectionSummary.total.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">{branchPayments.filter(p => p.status === 'paid').length} payments</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">₹{collectionSummary.pending.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">{branchPayments.filter(p => p.status === 'pending').length} pending</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">₹{collectionSummary.overdue.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">{branchPayments.filter(p => p.status === 'partial').length} overdue</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                            <CardDescription>Last 12 months revenue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="revenue" fill="#6366f1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Payments</CardTitle>
                            <CardDescription>Last 50 transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {branchPayments.slice(0, 10).map((payment) => {
                                    const student = students.find(s => s.id === payment.studentId);
                                    return (
                                        <div key={payment.id} className="flex items-center justify-between py-2 border-b">
                                            <div>
                                                <p className="font-medium text-sm">{student?.name || 'Unknown'}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{payment.method} • {payment.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">₹{payment.amount}</p>
                                                <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                                                    {payment.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Users/Staff */}
                <TabsContent value="users" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Staff Members ({branchStaff.length})</CardTitle>
                                <CardDescription>Managers and staff assigned to this branch</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {branchStaff.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                                </div>
                                            </div>
                                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    ))}
                                    {branchStaff.length === 0 && (
                                        <p className="text-center py-8 text-muted-foreground">No staff assigned</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Role Distribution</CardTitle>
                                <CardDescription>Staff breakdown by role</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={roleDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {roleDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab 4: Students */}
                <TabsContent value="students" className="space-y-4">
                    {isMounted && user?.role !== 'superadmin' && (
                        <div className="flex justify-end mb-4">
                            <Button onClick={() => setShowAdmissionModal(true)}>
                                <Plus className="mr-2 h-4 w-4" /> New Admission
                            </Button>
                        </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{branchStudents.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{branchStudents.filter(s => s.status === 'active').length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-600">{branchStudents.filter(s => s.status === 'inactive').length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Expired</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{branchStudents.filter(s => s.status === 'expired').length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shift Distribution</CardTitle>
                                <CardDescription>Students by shift preference</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={shiftDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {shiftDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Admission Trends</CardTitle>
                                <CardDescription>Last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={admissionTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="admissions" stroke="#10b981" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab 5: Settings */}
                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Operating Hours</CardTitle>
                            <CardDescription>Branch shift timings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Morning Shift</label>
                                    <div className="flex items-center gap-2">
                                        <input type="time" value={branch.defaultShiftMorning?.start} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" readOnly />
                                        <span>to</span>
                                        <input type="time" value={branch.defaultShiftMorning?.end} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" readOnly />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Evening Shift</label>
                                    <div className="flex items-center gap-2">
                                        <input type="time" value={branch.defaultShiftEvening?.start} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" readOnly />
                                        <span>to</span>
                                        <input type="time" value={branch.defaultShiftEvening?.end} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" readOnly />
                                    </div>
                                </div>
                            </div>
                            {isMounted && user?.role !== 'superadmin' && (
                                <Button>Update Hours</Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Capacity Management</CardTitle>
                            <CardDescription>Seating configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium">Total Capacity</label>
                                    <input type="number" value={branch.capacity} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2" readOnly />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">AC Seats</label>
                                    <input type="number" value={Math.floor(branch.capacity * 0.6)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2" readOnly />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Non-AC Seats</label>
                                    <input type="number" value={Math.floor(branch.capacity * 0.4)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2" readOnly />
                                </div>
                            </div>
                            <Button>Update Capacity</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>Irreversible actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive">Deactivate Branch</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 6: Analytics */}
                <TabsContent value="analytics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Occupancy Trend & Real-time Status</CardTitle>
                            <CardDescription>Historical data and live seat view</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="h-[300px]">
                                    <h4 className="text-sm font-medium mb-4">12-Month Trend</h4>
                                    <ResponsiveContainer width="100%" height="90%">
                                        <AreaChart data={occupancyTrend}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="occupancy" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <SeatHeatmap data={[]} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Revenue vs Target</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{Math.floor((branch.revenue / 500000) * 100)}%</div>
                                <p className="text-xs text-muted-foreground">₹{branch.revenue.toLocaleString()} of ₹500,000</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Retention Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">87%</div>
                                <p className="text-xs text-muted-foreground">Above network avg (82%)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Student Satisfaction</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">4.5/5.0</div>
                                <p className="text-xs text-muted-foreground">Based on 48 reviews</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <NewAdmissionModal open={showAdmissionModal} onOpenChange={setShowAdmissionModal} />
        </div>
    );
}
