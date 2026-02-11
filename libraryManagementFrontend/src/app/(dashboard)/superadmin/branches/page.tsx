'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { branches, getUserById } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { CreateBranchModal } from '@/components/modals/create-branch-modal';

export default function BranchManagementPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredBranches = branches.filter((branch) =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
                    <p className="text-muted-foreground">
                        Manage all library branches, view performance, and configure settings.
                    </p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Branch
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>All Branches</CardTitle>
                    <CardDescription>
                        A list of all branches including their location, manager, and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between py-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search branches..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="hidden lg:flex">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Branch Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Manager</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Students</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                    <TableHead>Occupancy</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBranches.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            No branches found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBranches.map((branch) => (
                                        <TableRow key={branch.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{branch.name}</span>
                                                    <span className="text-xs text-muted-foreground md:hidden">{branch.city}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{branch.city}</TableCell>
                                            <TableCell>
                                                <span className="text-sm">{getUserById(branch.managerId || '')?.name || 'Unassigned'}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={branch.status === 'active' ? 'default' : 'secondary'}
                                                    className={
                                                        branch.status === 'active'
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                                    }
                                                >
                                                    {branch.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{Math.floor(branch.capacity * (branch.occupancy / 100))}</TableCell>
                                            <TableCell className="text-right">₹{branch.revenue.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium w-6">{branch.occupancy}%</span>
                                                    <div className="h-2 w-16 rounded-full bg-slate-100">
                                                        <div
                                                            className={`h-full rounded-full ${branch.occupancy > 80 ? 'bg-green-500' : branch.occupancy > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${branch.occupancy}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => router.push(`/superadmin/branches/${branch.id}`)}>
                                                    Manage
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <CreateBranchModal open={showCreateModal} onOpenChange={setShowCreateModal} />
        </div>
    );
}
