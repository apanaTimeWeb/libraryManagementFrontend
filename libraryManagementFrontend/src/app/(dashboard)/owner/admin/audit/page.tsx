'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auditLogs, users } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Shield, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = filter === 'all' 
    ? auditLogs 
    : auditLogs.filter(log => log.severity === filter);

  const criticalCount = auditLogs.filter(l => l.severity === 'critical').length;
  const highCount = auditLogs.filter(l => l.severity === 'high').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Fraud detection and activity monitoring</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Logs</CardTitle>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md p-2 text-sm"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLogs.slice(0, 50).map((log) => {
              const user = users.find(u => u.id === log.userId);
              const isCritical = log.action === 'delete' || log.severity === 'critical';
              
              return (
                <div 
                  key={log.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    isCritical ? 'bg-red-50 border-red-200' : ''
                  }`}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-center gap-4">
                    {isCritical ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{log.action.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.name} • {format(new Date(log.timestamp), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground capitalize">{log.entityType}</span>
                    <Badge variant={
                      log.severity === 'critical' ? 'destructive' :
                      log.severity === 'high' ? 'secondary' :
                      'outline'
                    }>
                      {log.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{log.ipAddress}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-semibold">{users.find(u => u.id === selectedLog.userId)?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Action</p>
                  <p className="font-semibold">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entity</p>
                  <p className="font-semibold capitalize">{selectedLog.entityType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <Badge variant={selectedLog.severity === 'critical' ? 'destructive' : 'default'}>
                    {selectedLog.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="font-semibold">{format(new Date(selectedLog.timestamp), 'PPpp')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-semibold">{selectedLog.ipAddress}</p>
                </div>
              </div>
              {selectedLog.changes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Changes</p>
                  <div className="border rounded-lg p-3 space-y-2">
                    {selectedLog.changes.map((change, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{change.field}:</span>
                        <span className="text-red-600 line-through ml-2">{String(change.oldValue)}</span>
                        <span className="text-green-600 ml-2">{String(change.newValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
