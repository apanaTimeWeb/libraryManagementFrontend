'use client';

import { useState } from 'react';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { UserDistributionChart } from '@/components/charts/user-distribution';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Activity,
    Building,
    CreditCard,
    Target,
    Users,
    LifeBuoy,
    Plus,
    UserPlus,
    Bell,
    Database,
    FileText,
} from 'lucide-react';
import { branches, users, students } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreateBranchModal } from '@/components/modals/create-branch-modal';
import { CreateUserModal } from '@/components/modals/create-user-modal';

export default function SuperAdminDashboard() {
    const router = useRouter();
    const [showCreateBranch, setShowCreateBranch] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(false);

    const totalRevenue = 4567000;
    const totalUsers = users.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const activeBranches = branches.filter(b => b.status === 'active').length;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground mr-2">Last updated: Just now</span>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/superadmin/branches')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{branches.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Active: {activeBranches}, Inactive: {branches.length - activeBranches}
                        </p>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/superadmin/users')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            SA: {users.filter(u => u.role === 'superadmin').length}, Owner: {users.filter(u => u.role === 'owner').length}, Mgr: {users.filter(u => u.role === 'manager').length}, Staff: {users.filter(u => u.role === 'staff').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% monthly growth
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Avg per branch: ₹{Math.floor(totalRevenue / branches.length).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">99.8%</div>
                        <p className="text-xs text-muted-foreground">
                            All 26 services active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                        <LifeBuoy className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            1 urgent ticket pending
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Panel */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Frequently used administrative actions</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    <Button variant="outline" className="justify-start" onClick={() => setShowCreateBranch(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Branch
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setShowCreateUser(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New User
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => alert('System Announcement feature - Coming soon!')}>
                        <Bell className="mr-2 h-4 w-4" />
                        Send Announcement
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => alert('System backup initiated successfully!')}>
                        <Database className="mr-2 h-4 w-4" />
                        Run System Backup
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => router.push('/superadmin/logs')}>
                        <FileText className="mr-2 h-4 w-4" />
                        View Audit Logs
                    </Button>
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                            Monthly revenue across all branches for the current year.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RevenueChart />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                        <CardDescription>
                            Breakdown of system users by role.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserDistributionChart />
                    </CardContent>
                </Card>
            </div>

            {/* Branch Performance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Branch Performance</CardTitle>
                    <CardDescription>Real-time metrics from top performing branches.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Branch Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Occupancy</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branches.map((branch) => (
                                <TableRow key={branch.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/superadmin/branches/${branch.id}`)}>
                                    <TableCell className="font-medium">{branch.name}</TableCell>
                                    <TableCell>{branch.city}</TableCell>
                                    <TableCell>{Math.floor(branch.capacity * (branch.occupancy / 100))}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium">{branch.occupancy}%</span>
                                            <div className="h-2 w-16 rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full ${branch.occupancy > 80 ? 'bg-green-500' : branch.occupancy > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${branch.occupancy}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">₹{branch.revenue.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            {branch.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modals */}
            <CreateBranchModal open={showCreateBranch} onOpenChange={setShowCreateBranch} />
            <CreateUserModal open={showCreateUser} onOpenChange={setShowCreateUser} />
        </div>
    );
}
