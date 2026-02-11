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
} from 'lucide-react';
import { branches } from '@/lib/mockData';

export default function SuperAdminDashboard() {
    const totalRevenue = 4567000;
    const totalUsers = 65;
    const activeStudents = 1420;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground mr-2">Last updated: Just now</span>
                    {/* Action buttons could go here */}
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all roles
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
                            +8.5% from last month
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
                                <TableRow key={branch.id}>
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
                                            Active
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* Add more rows manually if needed for demo */}
                            <TableRow>
                                <TableCell className="font-medium">Bangalore Central</TableCell>
                                <TableCell>Bangalore</TableCell>
                                <TableCell>98</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium">78%</span>
                                        <div className="h-2 w-16 rounded-full bg-slate-100">
                                            <div className="h-full rounded-full bg-yellow-500" style={{ width: '78%' }} />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">₹298,500</TableCell>
                                <TableCell className="text-right">
                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        Active
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
