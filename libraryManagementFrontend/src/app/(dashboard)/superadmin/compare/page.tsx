'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { branches } from '@/lib/mockData';
import { ArrowLeftRight, TrendingUp, Users, CreditCard, LayoutGrid } from 'lucide-react';

export default function CompareBranchesPage() {
    const [branch1Id, setBranch1Id] = useState(branches[0]?.id || '');
    const [branch2Id, setBranch2Id] = useState(branches[1]?.id || '');

    const branch1 = branches.find(b => b.id === branch1Id);
    const branch2 = branches.find(b => b.id === branch2Id);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    if (!branch1 || !branch2) return <div>Loading...</div>;

    const metrics = [
        { label: 'Location', value1: branch1.city, value2: branch2.city, icon: null },
        { label: 'Total Capacity', value1: branch1.capacity, value2: branch2.capacity, icon: Users },
        { label: 'Current Occupancy', value1: `${branch1.occupancy}%`, value2: `${branch2.occupancy}%`, icon: LayoutGrid },
        { label: 'Monthly Revenue', value1: formatCurrency(branch1.revenue), value2: formatCurrency(branch2.revenue), icon: CreditCard },
        { label: 'Status', value1: branch1.status, value2: branch2.status, icon: null },
        // Mocking growth data as it's not in the base mock
        { label: 'MoM Growth', value1: '+12%', value2: '+8%', icon: TrendingUp },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Compare Branches</h1>
                <p className="text-muted-foreground">
                    Analyze performance metrics side-by-side to identify trends and outliers.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 p-4 sm:p-6 rounded-lg border">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Branch A</label>
                    <Select value={branch1Id} onValueChange={setBranch1Id}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map(branch => (
                                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-center md:hidden">
                    <ArrowLeftRight className="text-muted-foreground" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Branch B</label>
                    <Select value={branch2Id} onValueChange={setBranch2Id}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map(branch => (
                                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Comparison</CardTitle>
                    <CardDescription>Direct comparison of key operational and financial metrics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-6 px-6">
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Metric</TableHead>
                                <TableHead className="text-center bg-blue-50/50">{branch1.name}</TableHead>
                                <TableHead className="text-center bg-purple-50/50">{branch2.name}</TableHead>
                                <TableHead className="text-right">Difference</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metrics.map((metric, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {metric.icon && <metric.icon className="h-4 w-4 text-muted-foreground" />}
                                        {metric.label}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold bg-blue-50/30">
                                        {metric.label === 'Status' ? (
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${metric.value1 === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {metric.value1.toString().toUpperCase()}
                                            </span>
                                        ) : metric.value1}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold bg-purple-50/30">
                                        {metric.label === 'Status' ? (
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${metric.value2 === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {metric.value2.toString().toUpperCase()}
                                            </span>
                                        ) : metric.value2}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs">
                                        {/* Logic to show difference could be added here */}
                                        -
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button variant="outline">Export Comparison Report</Button>
            </div>
        </div>
    );
}
