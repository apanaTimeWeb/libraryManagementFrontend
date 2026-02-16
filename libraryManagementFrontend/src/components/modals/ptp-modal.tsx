'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isFuture } from 'date-fns';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Student } from '@/lib/types/ops-types';

interface PTPModalProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export function PTPModal({ student, open, onClose }: PTPModalProps) {
  const [ptpDate, setPtpDate] = useState<Date>();
  const [ptpAmount, setPtpAmount] = useState(student.dueAmount);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!ptpDate) {
      toast.error('Please select a promise date');
      return;
    }

    if (!isFuture(ptpDate)) {
      toast.error('Promise date must be in the future');
      return;
    }

    if (ptpAmount <= 0 || ptpAmount > student.dueAmount) {
      toast.error('Invalid amount');
      return;
    }

    toast.success(`Promise to Pay recorded for ${student.name} - ₹${ptpAmount} by ${format(ptpDate, 'PPP')}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Promise to Pay</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Info */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="font-medium">{student.name}</p>
            <p className="text-sm text-slate-500">{student.smartId}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive">Due: ₹{student.dueAmount}</Badge>
              {student.trustScore && (
                <Badge variant="outline">Trust Score: {student.trustScore}/5</Badge>
              )}
            </div>
          </div>

          {/* Amount */}
          <div>
            <Label>Promised Amount *</Label>
            <Input
              type="number"
              value={ptpAmount}
              onChange={(e) => setPtpAmount(Number(e.target.value))}
              max={student.dueAmount}
              min={0}
            />
            <p className="text-xs text-slate-500 mt-1">
              Maximum: ₹{student.dueAmount}
            </p>
          </div>

          {/* Promise Date */}
          <div>
            <Label>Promise Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {ptpDate ? format(ptpDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={ptpDate}
                  onSelect={setPtpDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {ptpDate && !isFuture(ptpDate) && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                Promise date must be in the future
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          {/* Trust Score Warning */}
          {student.trustScore && student.trustScore < 3 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">Low Trust Score</p>
                  <p>This student has a trust score of {student.trustScore}/5. Monitor closely.</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Record PTP
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
