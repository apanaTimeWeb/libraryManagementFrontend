'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Student } from '@/lib/types/ops-types';
import { useRoleStore } from '@/lib/stores/role-store';
import { toast } from 'sonner';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ShiftMigrationModalProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export function ShiftMigrationModal({ student, open, onClose }: ShiftMigrationModalProps) {
  const { isManager } = useRoleStore();
  const [newShift, setNewShift] = useState(student.shift);
  const [isHybrid, setIsHybrid] = useState(false);
  const [needsSeatChange, setNeedsSeatChange] = useState(false);
  
  // Calculate pro-rated fee adjustment
  const daysRemaining = 15; // Mock calculation
  const dailyRate = 40; // Mock rate
  const feeAdjustment = daysRemaining * dailyRate;

  const handleMigrate = () => {
    if (!isManager()) {
      toast.error('Only managers can migrate shifts');
      return;
    }
    
    if (newShift === student.shift) {
      toast.error('Please select a different shift');
      return;
    }

    toast.success(
      `${student.name} migrated to ${newShift} shift. Fee adjustment: ₹${feeAdjustment}${
        needsSeatChange ? '. Seat reassignment required.' : ''
      }`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Shift - {student.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Info */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="font-medium">{student.name}</p>
            <p className="text-sm text-slate-500">{student.smartId}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge>{student.shift} Shift</Badge>
              {student.currentSeat && <Badge variant="outline">{student.currentSeat}</Badge>}
            </div>
          </div>

          {/* Manager Only Warning */}
          {!isManager() && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <p className="text-sm text-orange-800">Only managers can perform shift migration</p>
              </div>
            </div>
          )}

          {/* Current Shift */}
          <div>
            <Label>Current Shift</Label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-base py-1 px-3">{student.shift}</Badge>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* New Shift Selection */}
          <div>
            <Label>Select New Shift *</Label>
            <RadioGroup value={newShift} onValueChange={(value) => {
              setNewShift(value as any);
              setIsHybrid(value === 'Hybrid');
            }}>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50">
                  <RadioGroupItem value="Morning" id="morning" />
                  <Label htmlFor="morning" className="flex-1 cursor-pointer">
                    <span className="font-medium">Morning Shift</span>
                    <p className="text-xs text-slate-500">6:00 AM - 2:00 PM</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50">
                  <RadioGroupItem value="Evening" id="evening" />
                  <Label htmlFor="evening" className="flex-1 cursor-pointer">
                    <span className="font-medium">Evening Shift</span>
                    <p className="text-xs text-slate-500">2:00 PM - 10:00 PM</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-slate-50">
                  <RadioGroupItem value="Hybrid" id="hybrid" />
                  <Label htmlFor="hybrid" className="flex-1 cursor-pointer">
                    <span className="font-medium">Hybrid Shift</span>
                    <p className="text-xs text-slate-500">Custom schedule</p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Hybrid Schedule Builder */}
          {isHybrid && (
            <div className="p-4 bg-blue-50 rounded-lg space-y-3">
              <Label>Custom Schedule</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox id={day} />
                    <Label htmlFor={day} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Start Time</Label>
                  <Input type="time" className="text-sm" />
                </div>
                <div>
                  <Label className="text-xs">End Time</Label>
                  <Input type="time" className="text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* Fee Adjustment */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Fee Adjustment</p>
              <Badge variant="outline">{daysRemaining} days remaining</Badge>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{feeAdjustment}</p>
            <p className="text-xs text-slate-500 mt-1">Pro-rated difference for remaining subscription period</p>
          </div>

          {/* Seat Change Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seat-change"
              checked={needsSeatChange}
              onCheckedChange={(checked) => setNeedsSeatChange(checked as boolean)}
            />
            <Label htmlFor="seat-change" className="text-sm">
              Reassign seat after migration
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button 
              onClick={handleMigrate} 
              className="flex-1" 
              disabled={newShift === student.shift || !isManager()}
            >
              Migrate to {newShift}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
