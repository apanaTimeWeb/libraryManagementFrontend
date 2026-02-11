'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { auditLogs, getUserById } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { AuditLogTable } from '@/components/tables/audit-log-table';
import { AuditDiffModal } from '@/components/modals/audit-diff-modal';
import { toast } from 'sonner';

export default function SystemLogsPage() {
    const [selectedLog, setSelectedLog] = React.useState<any | null>(null);
    const [diffModalOpen, setDiffModalOpen] = React.useState(false);

    const criticalLogs = auditLogs.filter(log => log.severity === 'critical' || log.severity === 'high');

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

    const handleViewChanges = (log: any) => {
        setSelectedLog(log);
        setDiffModalOpen(true);
    };

    const handleExportLogs = () => {
        toast.success('Export initiated', {
            description: 'Downloading audit logs as CSV...',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Logs & Audit Trail</h1>
                    <p className="text-muted-foreground">
                        Monitor system activities, security events, and changes across all modules.
                    </p>
                </div>
                <Button variant="outline" onClick={handleExportLogs}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                </Button>
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

            {/* Audit Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Audit Logs ({auditLogs.length} records)</CardTitle>
                    <CardDescription>Complete activity history with change tracking</CardDescription>
                </CardHeader>
                <CardContent>
                    <AuditLogTable data={auditLogs} onViewChanges={handleViewChanges} />
                </CardContent>
            </Card>

            {/* Audit Diff Modal */}
            <AuditDiffModal
                open={diffModalOpen}
                onOpenChange={setDiffModalOpen}
                log={selectedLog}
            />
        </div>
    );
}
