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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const mocksLogs = [
    { id: 1, timestamp: '2024-02-11 10:30:00', user: 'Vikram Malware (SuperAdmin)', action: 'Logged In', entity: 'System', ip: '192.168.1.1', severity: 'low' },
    { id: 2, timestamp: '2024-02-11 11:15:23', user: 'Rajesh Owner', action: 'Created Branch', entity: 'Bangalore Central', ip: '10.0.0.45', severity: 'high' },
    { id: 3, timestamp: '2024-02-11 11:20:00', user: 'Suresh Manager', action: 'Approved Payment', entity: 'Payment #4501', ip: '172.16.0.21', severity: 'medium' },
    { id: 4, timestamp: '2024-02-11 12:05:12', user: 'System', action: 'Backup Completed', entity: 'Database', ip: 'localhost', severity: 'low' },
    { id: 5, timestamp: '2024-02-11 12:10:45', user: 'Ramesh Staff', action: 'Modified Student', entity: 'Rahul Sharma', ip: '172.16.0.25', severity: 'medium' },
    { id: 6, timestamp: '2024-02-11 12:30:00', user: 'Unknown', action: 'Failed Login', entity: 'Admin Portal', ip: '45.12.33.11', severity: 'critical' },
];

export default function SystemLogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                    <p className="text-muted-foreground">
                        Audit trail of all system activities, security events, and data changes.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Activity Feed</CardTitle>
                            <CardDescription>Real-time log of system events.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search logs..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Severity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mocksLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                    <TableCell className="font-medium text-sm">{log.user}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>{log.entity}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                log.severity === 'critical' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                                                    log.severity === 'high' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                                                        log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                                                            'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                            }
                                        >
                                            {log.severity}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
