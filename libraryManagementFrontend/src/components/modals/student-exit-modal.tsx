'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Student } from '@/lib/types/ops-types';
import { toast } from 'sonner';

interface StudentExitModalProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export function StudentExitModal({ student, open, onClose }: StudentExitModalProps) {
  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(500); // Security deposit
  const [deductions, setDeductions] = useState(0);

  const finalRefund = refundAmount - deductions;

  const handleExit = () => {
    toast.success(`${student.name} exit processed. Refund: ₹${finalRefund}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student Exit - {student.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">
              ⚠️ This action will deactivate the student and process refund
            </p>
          </div>

          <div>
            <Label>Exit Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for exit..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Security Deposit</Label>
              <Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value))} />
            </div>
            <div>
              <Label>Deductions</Label>
              <Input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} />
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium">Final Refund Amount</p>
            <p className="text-2xl font-bold text-green-600">₹{finalRefund}</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleExit} variant="destructive" className="flex-1">
              Process Exit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
