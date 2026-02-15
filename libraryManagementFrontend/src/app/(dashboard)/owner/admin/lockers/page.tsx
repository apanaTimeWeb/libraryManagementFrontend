'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { lockers, students } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Lock, LockOpen, Wrench } from 'lucide-react';

export default function LockersPage() {
  const [selectedLocker, setSelectedLocker] = useState<typeof lockers[0] | null>(null);

  const freeLockers = lockers.filter(l => l.status === 'free').length;
  const occupiedLockers = lockers.filter(l => l.status === 'occupied').length;
  const maintenanceLockers = lockers.filter(l => l.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Locker Matrix</h1>
        <p className="text-muted-foreground">Visual grid of locker availability</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Free Lockers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{freeLockers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupiedLockers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{maintenanceLockers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Locker Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-3">
            {lockers.map((locker) => (
              <div
                key={locker.id}
                className={`relative h-16 w-16 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 flex flex-col items-center justify-center ${
                  locker.status === 'free' ? 'bg-green-50 border-green-500' :
                  locker.status === 'occupied' ? 'bg-red-50 border-red-500' :
                  'bg-orange-50 border-orange-500'
                }`}
                onClick={() => setSelectedLocker(locker)}
                title={`Locker ${locker.number} - ${locker.status}`}
              >
                {locker.status === 'free' ? (
                  <LockOpen className="h-6 w-6 text-green-600" />
                ) : locker.status === 'occupied' ? (
                  <Lock className="h-6 w-6 text-red-600" />
                ) : (
                  <Wrench className="h-6 w-6 text-orange-600" />
                )}
                <span className="text-xs font-semibold mt-1">{locker.number}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-green-50 border-2 border-green-500 rounded" />
              <span>Free ({freeLockers})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-red-50 border-2 border-red-500 rounded" />
              <span>Occupied ({occupiedLockers})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-orange-50 border-2 border-orange-500 rounded" />
              <span>Maintenance ({maintenanceLockers})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLocker} onOpenChange={() => setSelectedLocker(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Locker #{selectedLocker?.number}</DialogTitle>
          </DialogHeader>
          {selectedLocker && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={
                    selectedLocker.status === 'free' ? 'default' :
                    selectedLocker.status === 'occupied' ? 'destructive' :
                    'secondary'
                  }>
                    {selectedLocker.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Fee</p>
                  <p className="font-semibold">₹{selectedLocker.monthlyFee}</p>
                </div>
                {selectedLocker.studentId && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Student</p>
                      <p className="font-semibold">
                        {students.find(s => s.id === selectedLocker.studentId)?.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expiry Date</p>
                      <p className="font-semibold">
                        {selectedLocker.expiryDate ? format(new Date(selectedLocker.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
