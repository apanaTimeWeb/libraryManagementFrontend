'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    CreditCard,
    LayoutGrid,
    TrendingUp,
    AlertCircle,
    Calendar,
    Plus,
    Search,
    MoreVertical
} from 'lucide-react';
import { RevenueChart } from '@/components/charts/revenue-chart'; // Reusing existing
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewAdmissionModal } from '@/components/modals/new-admission-modal';
import { useAuthStore } from '@/lib/stores/auth-store';

// Mock Data for Tables
const renewals = [
    { id: 1, name: 'Rahul Sharma', smartId: 'LIB001', plan: 'Monthly Premium', amount: 1200, status: 'unpaid', dueDate: 'Today' },
    { id: 2, name: 'Sneha Gupta', smartId: 'LIB045', plan: 'Quarterly', amount: 3200, status: 'partial', dueDate: 'Today' },
    { id: 3, name: 'Amit Verma', smartId: 'LIB089', plan: 'Monthly Basic', amount: 800, status: 'paid', dueDate: 'Today' },
];

const enquiries = [
    { id: 1, name: 'Priya Singh', phone: '+91 98765 43210', source: 'Google', status: 'new', daysOld: 1 },
    { id: 2, name: 'Vikram Malhotra', phone: '+91 98765 43211', source: 'Walk-in', status: 'visited', daysOld: 3 },
    { id: 3, name: 'Anjali Desai', phone: '+91 98765 43212', source: 'Referral', status: 'interested', daysOld: 5 },
];

const ptps = [
    { id: 1, name: 'Rohan Das', amount: 500, date: '2024-02-12', trustScore: 3, overdue: 4 },
    { id: 2, name: 'Kavita Krishnan', amount: 1200, date: '2024-02-14', trustScore: 5, overdue: 0 },
];

function DashboardContent() {
    const searchParams = useSearchParams();
    const branchId = searchParams.get('branch');
    const branchName = branchId ? branchId.replace('-', ' ').toUpperCase() : 'YOUR BRANCH';
    const { user } = useAuthStore();
    const [showAdmissionModal, setShowAdmissionModal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview for <span className="font-semibold text-primary">{branchName}</span>
                    </p>
                </div>
                {isMounted && user?.role !== 'superadmin' && (
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setShowAdmissionModal(true)}>
                            <Plus className="mr-2 h-4 w-4" /> New Admission
                        </Button>
                    </div>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                        <Users className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹4,56,700</div>
                        <Progress value={91} className="mt-2 h-2" />
                        <p className="text-xs text-muted-foreground mt-1">91% of target (₹5L)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                        <LayoutGrid className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87.3%</div>
                        <p className="text-xs text-muted-foreground">Morning: 92% • Evening: 78%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹25,000</div>
                        <p className="text-xs text-muted-foreground">Target: ₹30,000 (83%)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-red-500 font-medium">1 Urgent Attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Renewals Due Week</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Total Value: ₹9,600</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Seat Matrix Section */}
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Daily revenue collection for the current month.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RevenueChart />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Seat Occupancy (Mini)</CardTitle>
                        <CardDescription>Quick view of current floor plan status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Mini Seat Matrix placeholder - simple grid visualization */}
                        <div className="grid grid-cols-10 gap-1 p-2 bg-slate-50 rounded-lg">
                            {Array.from({ length: 100 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-3 w-3 rounded-sm ${i % 29 === 0 ? 'bg-orange-400' : // Maintenance
                                        i % 7 === 0 ? 'bg-red-500' : // Occupied
                                            i % 13 === 0 ? 'bg-yellow-400' : // Expiring
                                                'bg-green-500' // Available
                                        }`}
                                    title={`Seat ${i + 1}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-muted-foreground px-2">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div>Avail</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div>Occupied</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div>Expiring</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-full"></div>Maint.</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Tables Tabs */}
            <Tabs defaultValue="renewals" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="renewals">Renewals Due</TabsTrigger>
                    <TabsTrigger value="enquiries">Recent Enquiries</TabsTrigger>
                    <TabsTrigger value="ptp">Pending PTPs</TabsTrigger>
                </TabsList>

                <TabsContent value="renewals">
                    <Card>
                        <CardHeader>
                            <CardTitle>Renewals Due Today</CardTitle>
                            <CardDescription>Students with subscription expiring today.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {renewals.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.smartId}</div>
                                            </TableCell>
                                            <TableCell>{item.plan}</TableCell>
                                            <TableCell>₹{item.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.status === 'paid' ? 'default' : item.status === 'unpaid' ? 'destructive' : 'secondary'}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline">Collect</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="enquiries">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fresh Enquiries</CardTitle>
                            <CardDescription>Recent enquiries requiring follow-up.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enquiries.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.phone}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.source}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`text-xs font-medium ${item.status === 'new' ? 'text-blue-600' :
                                                    item.status === 'important' ? 'text-orange-600' : 'text-slate-600'
                                                    }`}>
                                                    {item.status.toUpperCase()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{item.daysOld} days ago</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm">Convert</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ptp">
                    <Card>
                        <CardHeader>
                            <CardTitle>Promise to Pay (PTP)</CardTitle>
                            <CardDescription>Follow up on pending payment promises.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Promised Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Trust Score</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ptps.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>₹{item.amount}</TableCell>
                                            <TableCell className={item.overdue > 3 ? 'text-red-600 font-bold' : ''}>
                                                {item.date}
                                                {item.overdue > 0 && <span className="text-xs ml-1 text-red-500">({item.overdue}d overdue)</span>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex text-yellow-500 text-xs">
                                                    {'★'.repeat(item.trustScore)}{'☆'.repeat(5 - item.trustScore)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost">Reminder</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Floating Action Button Placeholder - Implementing as fixed position button */}
            {isMounted && user?.role !== 'superadmin' && (
                <div className="fixed bottom-8 right-8 flex flex-col gap-2">
                    <Button className="h-14 w-14 rounded-full shadow-lg" size="icon" onClick={() => setShowAdmissionModal(true)}>
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            )}

            <NewAdmissionModal open={showAdmissionModal} onOpenChange={setShowAdmissionModal} />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-8">Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
