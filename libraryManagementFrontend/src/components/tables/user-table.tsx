'use client';

import { useState } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, ColumnDef, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpDown, MoreHorizontal, Edit, Eye, Trash2, Key, Download, Power } from 'lucide-react';

interface UserTableProps {
  data: any[];
  onEdit?: (user: any) => void;
  onView?: (user: any) => void;
  onDelete?: (user: any) => void;
  onResetPassword?: (user: any) => void;
}

export function UserTable({ data, onEdit, onView, onDelete, onResetPassword }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">{row.original.role}</Badge>
      ),
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
      cell: ({ row }) => row.original.branch || 'Global',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'lastLogin',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Last Login <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(row.original)}>
              <Eye className="mr-2 h-4 w-4" />View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
              <Edit className="mr-2 h-4 w-4" />Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResetPassword?.(row.original)}>
              <Key className="mr-2 h-4 w-4" />Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(row.original)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, rowSelection, globalFilter },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Bulk Actions Toolbar */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center justify-between rounded-md bg-muted px-4 py-3">
          <p className="text-sm font-medium">
            {table.getFilteredSelectedRowModel().rows.length} row(s) selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              const selectedUsers = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              selectedUsers.forEach(user => console.log('Activating:', user.name));
              table.resetRowSelection();
            }}>
              <Power className="mr-2 h-4 w-4" /> Activate
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              const selectedUsers = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              selectedUsers.forEach(user => console.log('Deactivating:', user.name));
              table.resetRowSelection();
            }}>
              <Power className="mr-2 h-4 w-4" /> Deactivate
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              const selectedUsers = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              if (confirm(`Reset password for ${selectedUsers.length} user(s)?`)) {
                selectedUsers.forEach(user => {
                  if (onResetPassword) onResetPassword(user);
                });
                table.resetRowSelection();
              }
            }}>
              <Key className="mr-2 h-4 w-4" /> Reset Passwords
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              const selectedUsers = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              const csv = [
                ['Name', 'Email', 'Phone', 'Role', 'Status', 'Last Login'].join(','),
                ...selectedUsers.map(u => [u.name, u.email, u.phone, u.role, u.isActive ? 'Active' : 'Inactive', u.lastLogin].join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              table.resetRowSelection();
            }}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="destructive" size="sm" onClick={() => {
              const selectedUsers = table.getFilteredSelectedRowModel().rows.map(row => row.original);
              if (confirm(`Delete ${selectedUsers.length} user(s)? This cannot be undone.`)) {
                selectedUsers.forEach(user => {
                  if (onDelete) onDelete(user);
                });
                table.resetRowSelection();
              }
            }}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          </div>
        </div>
      )}

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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
