'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, FileText, Download, AlertTriangle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { auditLogs, getUserById } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';

export default function SystemLogsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch = log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.entityType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
        return matchesSearch && matchesSeverity;
    });

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'high': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
            case 'medium': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            case 'low': return 'bg-green-100 text-green-700 hover:bg-green-100';
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'delete': return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'create': return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'update': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'login': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
            case 'logout': return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
            default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
        }
    };

    const criticalLogs = auditLogs.filter(log => log.severity === 'critical' || log.severity === 'high');

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Logs & Audit Trail</h1>
                    <p className="text-muted-foreground">
                        Monitor system activities, security events, and changes across all modules.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => alert('Exporting audit logs to CSV...')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Logs
                    </Button>
                </div>
            </div>

            {/* Suspicious Activity Alerts */}
            {criticalLogs.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-700">
                            <AlertTriangle className="h-5 w-5" />
                            Critical Activity Alerts ({criticalLogs.length})
                        </CardTitle>
                        <CardDescription className="text-orange-600">
                            Recent high-severity events requiring attention
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {criticalLogs.slice(0, 5).map(log => (
                                <div key={log.id} className="flex items-center justify-between p-2 bg-white rounded-md">
                                    <div>
                                        <span className="font-medium">{getUserById(log.userId)?.name || 'Unknown User'}</span>
                                        <span className="text-sm text-muted-foreground"> performed </span>
                                        <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                                        <span className="text-sm text-muted-foreground"> on {log.entityType}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search and Filter */}
            <Card>
                <CardHeader>
                    <CardTitle>Advanced Search & Filters</CardTitle>
                    <CardDescription>Filter logs by user, action, entity type, or severity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by user, action, or entity..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={selectedSeverity === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedSeverity('all')}
                            >
                                All
                            </Button>
                            <Button
                                variant={selectedSeverity === 'critical' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedSeverity('critical')}
                            >
                                Critical
                            </Button>
                            <Button
                                variant={selectedSeverity === 'high' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedSeverity('high')}
                            >
                                High
                            </Button>
                            <Button
                                variant={selectedSeverity === 'medium' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedSeverity('medium')}
                            >
                                Medium
                            </Button>
                            <Button
                                variant={selectedSeverity === 'low' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedSeverity('low')}
                            >
                                Low
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Audit Logs ({filteredLogs.length} records)</CardTitle>
                    <CardDescription>Complete activity history with change tracking</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Entity</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Device</TableHead>
                                    <TableHead className="text-right">Severity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.slice(0, 50).map((log) => (
                                    <TableRow key={log.id} className="cursor-pointer hover:bg-slate-50">
                                        <TableCell className="text-xs">
                                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{getUserById(log.userId)?.name || 'System'}</div>
                                                <div className="text-xs text-muted-foreground capitalize">{log.userRole}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getActionColor(log.action)}>
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="capitalize font-medium">{log.entityType}</div>
                                                {log.entityId && (
                                                    <div className="text-xs text-muted-foreground">{log.entityId}</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs">{log.ipAddress}</TableCell>
                                        <TableCell className="text-xs">{log.device}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge className={getSeverityColor(log.severity)}>
                                                {log.severity}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
