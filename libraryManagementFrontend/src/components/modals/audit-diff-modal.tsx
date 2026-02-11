'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AuditDiffModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    log: any;
}

export function AuditDiffModal({ open, onOpenChange, log }: AuditDiffModalProps) {
    if (!log) return null;

    const copyToClipboard = () => {
        const diffText = log.changes?.map((change: any) =>
            `${change.field}: ${change.oldValue} → ${change.newValue}`
        ).join('\n') || 'No changes';

        navigator.clipboard.writeText(diffText);
        toast.success('Diff copied to clipboard');
    };

    const getValueColor = (type: 'old' | 'new') => {
        return type === 'old' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Audit Log Changes</DialogTitle>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogDescription>
                        View detailed changes made in this audit log entry
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Log Metadata */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground">Timestamp</p>
                            <p className="font-medium">{format(new Date(log.timestamp), 'PPpp')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">User</p>
                            <p className="font-medium">{log.userId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Action</p>
                            <Badge variant="outline" className="capitalize">{log.action}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Entity</p>
                            <Badge variant="outline" className="capitalize">{log.entityType}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">IP Address</p>
                            <p className="font-medium">{log.ipAddress}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Device</p>
                            <p className="font-medium text-sm">{log.device}</p>
                        </div>
                    </div>

                    {/* Changes Diff */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Changes</h3>
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Diff
                            </Button>
                        </div>

                        {log.changes && log.changes.length > 0 ? (
                            <div className="space-y-3 border rounded-lg divide-y">
                                {log.changes.map((change: any, index: number) => (
                                    <div key={index} className="p-4 space-y-2">
                                        <p className="font-medium text-sm capitalize">{change.field.replace(/_/g, ' ')}</p>

                                        {/* Side-by-side diff */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Old Value */}
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase font-medium">Before</p>
                                                <div className={`p-3 rounded-md border ${getValueColor('old')}`}>
                                                    {typeof change.oldValue === 'object' ? (
                                                        <pre className="text-xs overflow-auto">
                                                            {JSON.stringify(change.oldValue, null, 2)}
                                                        </pre>
                                                    ) : (
                                                        <p className="text-sm font-mono break-words">
                                                            {change.oldValue?.toString() || <span className="text-muted-foreground italic">null</span>}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* New Value */}
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase font-medium">After</p>
                                                <div className={`p-3 rounded-md border ${getValueColor('new')}`}>
                                                    {typeof change.newValue === 'object' ? (
                                                        <pre className="text-xs overflow-auto">
                                                            {JSON.stringify(change.newValue, null, 2)}
                                                        </pre>
                                                    ) : (
                                                        <p className="text-sm font-mono break-words">
                                                            {change.newValue?.toString() || <span className="text-muted-foreground italic">null</span>}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Diff summary */}
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                                            <span>Removed</span>
                                            <span className="mx-2">→</span>
                                            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                                            <span>Added</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border rounded-lg p-8 text-center text-muted-foreground">
                                <p>No changes recorded for this audit log entry</p>
                                <p className="text-sm mt-1">This may be a view or login action</p>
                            </div>
                        )}
                    </div>

                    {/* Unified Diff View (Alternative) */}
                    {log.changes && log.changes.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Unified Diff</h3>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto">
                                {log.changes.map((change: any, index: number) => (
                                    <div key={index} className="mb-2">
                                        <div className="text-blue-400">@@ {change.field} @@</div>
                                        <div className="text-red-400">- {JSON.stringify(change.oldValue)}</div>
                                        <div className="text-green-400">+ {JSON.stringify(change.newValue)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
