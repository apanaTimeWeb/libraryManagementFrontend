'use client';

import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Student } from '@/lib/types/ops-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, MapPin, FileText } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onViewProfile: (student: Student) => void;
  onAssignSeat: (student: Student) => void;
  onCollectFee: (student: Student) => void;
}

export function StudentTable({ students, onViewProfile, onAssignSeat, onCollectFee }: StudentTableProps) {
  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'smartId',
        header: 'Smart ID',
        cell: ({ row }) => (
          <button
            onClick={() => onViewProfile(row.original)}
            className="font-medium text-blue-600 hover:underline"
          >
            {row.original.smartId}
          </button>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-slate-500">{row.original.phone}</p>
          </div>
        ),
      },
      {
        accessorKey: 'currentSeat',
        header: 'Seat',
        cell: ({ row }) => (
          row.original.currentSeat ? (
            <Badge variant="outline">{row.original.currentSeat}</Badge>
          ) : (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">Unallocated</Badge>
          )
        ),
      },
      {
        accessorKey: 'shift',
        header: 'Shift',
        cell: ({ row }) => <span className="text-sm">{row.original.shift}</span>,
      },
      {
        accessorKey: 'dueAmount',
        header: 'Due Amount',
        cell: ({ row }) => (
          row.original.dueAmount > 0 ? (
            <span className="font-medium text-red-600">₹{row.original.dueAmount}</span>
          ) : (
            <span className="text-slate-500">₹0</span>
          )
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.status === 'active' ? 'default' : 'destructive'}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-1">
            {row.original.dueAmount > 0 && (
              <Button size="sm" variant="outline" onClick={() => onCollectFee(row.original)}>
                <CreditCard className="h-3 w-3 mr-1" />
                Collect
              </Button>
            )}
            {!row.original.currentSeat && (
              <Button size="sm" variant="outline" onClick={() => onAssignSeat(row.original)}>
                <MapPin className="h-3 w-3 mr-1" />
                Assign
              </Button>
            )}
            <Button size="sm" variant="ghost">
              <FileText className="h-3 w-3" />
            </Button>
          </div>
        ),
      },
    ],
    [onViewProfile, onAssignSeat, onCollectFee]
  );

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
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
                No students found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
