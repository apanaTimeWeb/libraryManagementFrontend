'use client';

import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Enquiry } from '@/lib/types/ops-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, MessageSquare, UserPlus, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface LeadsTableProps {
  leads: Enquiry[];
  onLogInteraction: (lead: Enquiry) => void;
  onSendMessage: (lead: Enquiry) => void;
  onConvert: (lead: Enquiry) => void;
}

const sourceIcons: Record<string, string> = {
  walk_in: '🚶',
  google_ads: '🔍',
  facebook: '📘',
  referral: '👥',
  other: '📌'
};

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  new: 'default',
  visited: 'secondary',
  interested: 'default',
  converted: 'outline',
  lost: 'destructive'
};

export function LeadsTable({ leads, onLogInteraction, onSendMessage, onConvert }: LeadsTableProps) {
  const columns = useMemo<ColumnDef<Enquiry>[]>(
    () => [
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
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span>{sourceIcons[row.original.source]}</span>
            <span className="text-sm capitalize">{row.original.source.replace('_', ' ')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusColors[row.original.status]}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'lastMessageSent',
        header: 'Last Message',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.lastMessageSent || 'None'}</span>
        ),
      },
      {
        accessorKey: 'followUpDate',
        header: 'Follow-up',
        cell: ({ row }) => {
          const isToday = format(new Date(row.original.followUpDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          return (
            <span className={`text-sm ${isToday ? 'font-bold text-red-600' : ''}`}>
              {format(new Date(row.original.followUpDate), 'MMM dd')}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => onLogInteraction(row.original)} title="Log Interaction">
              <FileText className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onSendMessage(row.original)} title="Send Message">
              <MessageSquare className="h-3 w-3" />
            </Button>
            {row.original.status !== 'converted' && (
              <Button size="sm" onClick={() => onConvert(row.original)} title="Convert to Student">
                <UserPlus className="h-3 w-3" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onLogInteraction, onSendMessage, onConvert]
  );

  const table = useReactTable({
    data: leads,
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
                No leads found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
