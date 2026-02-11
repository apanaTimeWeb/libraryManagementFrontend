'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowUpRight, ArrowDownRight, Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { branches } from '@/lib/mockData';

export default function FranchiseAnalyticsPage() {
    // Mocking extended analytics data based on branches
    const analyticsData = [
        { name: 'Delhi Main Branch', revenue: '₹456,700', students: 156, occupancy: '87%', growth: '+12%', margin: '72%' },
        { name: 'Mumbai South', revenue: '₹389,200', students: 128, occupancy: '82%', growth: '+8%', margin: '68%' },
        { name: 'Bangalore Central', revenue: '₹298,500', students: 98, occupancy: '78%', growth: '+5%', margin: '65%' },
        { name: 'Kolkata East', revenue: '₹156,800', students: 45, occupancy: '65%', growth: '-2%', margin: '58%' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Franchise Analytics</h1>
                    <p className="text-muted-foreground">
                        Comparative analysis and performance insights across all branches.
                    </p>
                </div>
            </div>

            {/* Comparison Matrix */}
            <Card>
                <CardHeader>
                    <CardTitle>Branch Performance Matrix</CardTitle>
                    <CardDescription>
                        Key performance indicators compared across top performing branches.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Branch Name</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Occupancy</TableHead>
                                <TableHead>Growth (MoM)</TableHead>
                                <TableHead>Profit Margin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analyticsData.map((branch, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{branch.name}</TableCell>
                                    <TableCell>{branch.revenue}</TableCell>
                                    <TableCell>{branch.students}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium">{branch.occupancy}</span>
                                            <div className="h-1.5 w-16 rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{ width: branch.occupancy }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={branch.growth.startsWith('+') ? 'text-green-600' : 'text-red-500'}>
                                            {branch.growth}
                                        </span>
                                    </TableCell>
                                    <TableCell>{branch.margin}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="bg-slate-50 font-medium">
                                <TableCell>System Average</TableCell>
                                <TableCell>₹325,300</TableCell>
                                <TableCell>107</TableCell>
                                <TableCell>78%</TableCell>
                                <TableCell className="text-green-600">+6%</TableCell>
                                <TableCell>66%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Highlights Section */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-600" />
                            <CardTitle className="text-base text-yellow-800">Top Performer</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Delhi Main Branch</div>
                        <p className="text-sm text-muted-foreground mt-1">₹4.56L Revenue • 156 Students</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-base text-green-800">Fastest Growth</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Mumbai South</div>
                        <p className="text-sm text-muted-foreground mt-1">+15% Students compared to last mo.</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-white border-red-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <CardTitle className="text-base text-red-800">Needs Attention</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Kolkata East</div>
                        <p className="text-sm text-muted-foreground mt-1">Low Occupancy (65%) • Negative Growth</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
