'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Building2, BarChart3, Map } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { branches, students, payments } from '@/lib/mockData';
import { IndiaMap } from '@/components/charts/india-map';

export default function FranchiseAnalyticsPage() {
    // Calculate metrics for each branch
    const branchMetrics = branches.map(branch => {
        const branchStudents = students.filter(s => s.branchId === branch.id && s.status === 'active');
        const branchPayments = payments.filter(p => p.branchId === branch.id && p.status === 'paid');
        const totalRevenue = branchPayments.reduce((sum, p) => sum + p.amount, 0);

        return {
            ...branch,
            studentCount: branchStudents.length,
            totalRevenue,
            avgRevenuePerStudent: branchStudents.length > 0 ? totalRevenue / branchStudents.length : 0,
            growth: Math.floor(Math.random() * 30) - 10, // Mock growth data
        };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    const topBranches = branchMetrics.slice(0, 5);
    const bottomBranches = branchMetrics.slice(-3);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Franchise Analytics</h1>
                    <p className="text-muted-foreground">
                        Compare performance across all branches and identify growth opportunities.
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{branches.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Across {new Set(branches.map(b => b.city)).size} cities
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Network Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{branchMetrics.reduce((sum, b) => sum + b.totalRevenue, 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +15% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(branches.reduce((sum, b) => sum + b.occupancy, 0) / branches.length)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Network average
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
                        <Map className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate">{topBranches[0]?.city}</div>
                        <p className="text-xs text-muted-foreground">
                            ₹{topBranches[0]?.totalRevenue.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Leaderboard */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-600">🏆 Top Performing Branches</CardTitle>
                        <CardDescription>Highest revenue generators this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topBranches.map((branch, index) => (
                                <div key={branch.id} className="flex items-center gap-4">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-50 text-blue-600'
                                        }`}>
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{branch.name}</span>
                                            <span className="text-sm font-medium text-green-600">
                                                ₹{branch.totalRevenue.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>{branch.studentCount} students</span>
                                            <span>•</span>
                                            <span>{branch.occupancy}% occupancy</span>
                                            {branch.growth > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-green-600">+{branch.growth}% growth</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-orange-600">⚠️ Needs Attention</CardTitle>
                        <CardDescription>Branches with lower performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {bottomBranches.map((branch, index) => (
                                <div key={branch.id} className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{branch.name}</span>
                                            <span className="text-sm font-medium">
                                                ₹{branch.totalRevenue.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>{branch.studentCount} students</span>
                                            <span>•</span>
                                            <span className={branch.occupancy < 60 ? 'text-red-600' : ''}>
                                                {branch.occupancy}% occupancy
                                            </span>
                                            {branch.growth < 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-red-600">{branch.growth}% decline</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Comparison Matrix */}
            <Card>
                <CardHeader>
                    <CardTitle>Branch Comparison Matrix</CardTitle>
                    <CardDescription>Side-by-side comparison of all key metrics</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead className="text-right">Students</TableHead>
                                    <TableHead className="text-right">Capacity</TableHead>
                                    <TableHead className="text-right">Occupancy</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                    <TableHead className="text-right">Avg/Student</TableHead>
                                    <TableHead className="text-right">Growth</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branchMetrics.map((branch) => (
                                    <TableRow key={branch.id}>
                                        <TableCell className="font-medium">{branch.name}</TableCell>
                                        <TableCell>{branch.city}</TableCell>
                                        <TableCell className="text-right">{branch.studentCount}</TableCell>
                                        <TableCell className="text-right">{branch.capacity}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-medium ${branch.occupancy > 80 ? 'text-green-600' :
                                                    branch.occupancy > 60 ? 'text-yellow-600' :
                                                        'text-red-600'
                                                }`}>
                                                {branch.occupancy}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">₹{branch.totalRevenue.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₹{Math.round(branch.avgRevenuePerStudent).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-medium ${branch.growth > 0 ? 'text-green-600' : branch.growth < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                                {branch.growth > 0 ? '+' : ''}{branch.growth}%
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Geographical Distribution (Replaced with interactive India map) */}
            <IndiaMap />
        </div>
    );
}
