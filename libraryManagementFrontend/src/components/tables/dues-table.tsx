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
import { CreditCard, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface DuesTableProps {
  students: Student[];
  onCollectFee: (student: Student) => void;
}

export function DuesTable({ students, onCollectFee }: DuesTableProps) {
  const handleSendReminder = (student: Student) => {
    toast.success(`Reminder sent to ${student.name} and guardian`);
  };

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'smartId',
        header: 'Smart ID',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.smartId}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Student Name',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-slate-500">{row.original.phone}</p>
          </div>
        ),
      },
      {
        accessorKey: 'dueAmount',
        header: 'Due Amount',
        cell: ({ row }) => (
          <span className="font-bold text-red-600">₹{row.original.dueAmount}</span>
        ),
      },
      {
        accessorKey: 'lateFeeApplicable',
        header: 'Late Fee',
        cell: ({ row }) => (
          row.original.lateFeeApplicable ? (
            <Badge variant="destructive">Applicable</Badge>
          ) : (
            <Badge variant="outline">No</Badge>
          )
        ),
      },
      {
        accessorKey: 'expiryDate',
        header: 'Expiry Date',
        cell: ({ row }) => (
          <span className="text-sm">{format(new Date(row.original.expiryDate), 'MMM dd, yyyy')}</span>
        ),
      },
      {
        accessorKey: 'parentPhone',
        header: 'Guardian',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.parentPhone || 'N/A'}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button size="sm" onClick={() => onCollectFee(row.original)}>
              <CreditCard className="h-3 w-3 mr-1" />
              Collect
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleSendReminder(row.original)}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        ),
      },
    ],
    [onCollectFee]
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
                No dues pending.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
