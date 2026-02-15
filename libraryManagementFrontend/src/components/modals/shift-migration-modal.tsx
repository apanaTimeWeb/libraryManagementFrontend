'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Student } from '@/lib/types/ops-types';
import { toast } from 'sonner';

interface ShiftMigrationModalProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export function ShiftMigrationModal({ student, open, onClose }: ShiftMigrationModalProps) {
  const [newShift, setNewShift] = useState(student.shift);
  const feeAdjustment = 100; // Pro-rated difference

  const handleMigrate = () => {
    toast.success(`${student.name} migrated to ${newShift} shift. Fee adjustment: ₹${feeAdjustment}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Shift - {student.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Current Shift</Label>
            <p className="text-sm font-medium mt-1">{student.shift}</p>
          </div>

          <div>
            <Label>New Shift</Label>
            <div className="flex gap-2 mt-2">
              {['Morning', 'Evening', 'Hybrid'].map(shift => (
                <Button
                  key={shift}
                  variant={newShift === shift ? 'default' : 'outline'}
                  onClick={() => setNewShift(shift as any)}
                >
                  {shift}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium">Fee Adjustment</p>
            <p className="text-2xl font-bold text-blue-600">₹{feeAdjustment}</p>
            <p className="text-xs text-slate-500 mt-1">Pro-rated difference for remaining days</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleMigrate} className="flex-1" disabled={newShift === student.shift}>
              Migrate Shift
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
