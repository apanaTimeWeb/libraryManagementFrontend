'use client';

import { useMemo, useState } from 'react';
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
  RowSelectionState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, MoreHorizontal, Edit, Eye, Trash2, Power, Download } from 'lucide-react';
import type { Branch } from '@/lib/types';
import { globalTextFilter } from '@/lib/table-utils';

export type BranchTableRow = Branch & { managerName?: string };

interface BranchTableProps {
  data: BranchTableRow[];
  onEdit?: (branch: BranchTableRow) => void;
  onView?: (branch: BranchTableRow) => void;
  onDelete?: (branch: BranchTableRow) => void;
  onDeactivate?: (branch: BranchTableRow) => void;
}

export function BranchTable({ data, onEdit, onView, onDelete, onDeactivate }: BranchTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  const cities = useMemo(() => Array.from(new Set(data.map((branch) => branch.city))).sort(), [data]);

  const columns = useMemo<ColumnDef<BranchTableRow>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all branches on page"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select branch ${row.original.name}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Branch Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
    },
    {
      accessorKey: 'managerName',
      header: 'Manager',
      cell: ({ row }) => row.original.managerName || 'Unassigned',
    },
    {
      id: 'capacity',
      header: 'Capacity',
      cell: ({ row }) => {
        const occupiedSeats = Math.round((row.original.capacity * row.original.occupancy) / 100);
        return `${occupiedSeats}/${row.original.capacity}`;
      },
    },
    {
      accessorKey: 'revenue',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Revenue <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => `Rs ${row.original.revenue.toLocaleString()}`,
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
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" aria-label={`Actions for ${row.original.name}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(row.original)}>
              <Eye className="mr-2 h-4 w-4" />View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
              <Edit className="mr-2 h-4 w-4" />Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeactivate?.(row.original)}>
              <Power className="mr-2 h-4 w-4" />Deactivate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(row.original)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onDelete, onDeactivate, onEdit, onView]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      globalText: globalTextFilter,
    },
    globalFilterFn: 'globalText',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, rowSelection, globalFilter },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search branches..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Select onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => table.getColumn('city')?.setFilterValue(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="25">25 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
              <SelectItem value="100">100 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between rounded-md bg-muted px-4 py-3">
          <p className="text-sm font-medium">{selectedRows.length} branch(es) selected</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => table.resetRowSelection()}>
              <Power className="mr-2 h-4 w-4" /> Clear Selection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const csv = [
                  ['Name', 'City', 'Status', 'Capacity', 'Occupancy', 'Revenue'].join(','),
                  ...selectedRows.map((row) => {
                    const b = row.original;
                    return [b.name, b.city, b.status, b.capacity, b.occupancy, b.revenue].join(',');
                  }),
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `branches_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                table.resetRowSelection();
              }}
            >
              <Download className="mr-2 h-4 w-4" /> Export
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
          {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
