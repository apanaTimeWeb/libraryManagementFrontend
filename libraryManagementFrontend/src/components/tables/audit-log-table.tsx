'use client';

import { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogTableProps {
    data: any[];
    onViewChanges?: (log: any) => void;
}

export function AuditLogTable({ data, onViewChanges }: AuditLogTableProps) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const getActionBadgeColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'updated':
                return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'deleted':
                return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'activated':
            case 'logged in':
                return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
            case 'deactivated':
            case 'logged out':
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
            default:
                return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'timestamp',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Timestamp <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{format(new Date(row.original.timestamp), 'MMM dd, yyyy')}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(row.original.timestamp), 'hh:mm a')}</span>
                </div>
            ),
        },
        {
            accessorKey: 'userName',
            header: 'User',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{row.original.userName}</span>
                    <span className="text-xs text-muted-foreground capitalize">{row.original.userRole}</span>
                </div>
            ),
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <Badge variant="secondary" className={getActionBadgeColor(row.original.action)}>
                    {row.original.action}
                </Badge>
            ),
        },
        {
            accessorKey: 'entity',
            header: 'Entity',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-sm capitalize">{row.original.entity}</span>
                    {row.original.entityName && (
                        <span className="text-xs text-muted-foreground">{row.original.entityName}</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <span className="text-sm line-clamp-2">{row.original.description}</span>
            ),
        },
        {
            accessorKey: 'ipAddress',
            header: 'IP Address',
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground font-mono">{row.original.ipAddress || 'N/A'}</span>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                row.original.changes && row.original.changes.length > 0 ? (
                    <Button variant="ghost" size="sm" onClick={() => onViewChanges?.(row.original)}>
                        <Eye className="h-4 w-4 mr-1" /> Changes
                    </Button>
                ) : null
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: { sorting, columnFilters, globalFilter },
        initialState: {
            pagination: {
                pageSize: 50, // Show more rows for audit logs
            },
        },
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Input
                    placeholder="Search audit logs..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-2">
                    <Select
                        onValueChange={(value) =>
                            table.getColumn('action')?.setFilterValue(value === 'all' ? '' : value)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="Created">Created</SelectItem>
                            <SelectItem value="Updated">Updated</SelectItem>
                            <SelectItem value="Deleted">Deleted</SelectItem>
                            <SelectItem value="Logged In">Logged In</SelectItem>
                            <SelectItem value="Logged Out">Logged Out</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) =>
                            table.getColumn('entity')?.setFilterValue(value === 'all' ? '' : value)
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by entity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Entities</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="branch">Branch</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="payment">Payment</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No audit logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getFilteredRowModel().rows.length} of {data.length} logs
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
