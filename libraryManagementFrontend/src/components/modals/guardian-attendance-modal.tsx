'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockStudents } from '@/lib/opsData';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

interface GuardianAttendanceModalProps {
  guardianStudent: any;
  action: 'in' | 'out';
  time: string;
  open: boolean;
  onClose: () => void;
}

export function GuardianAttendanceModal({ 
  guardianStudent, 
  action, 
  time, 
  open, 
  onClose 
}: GuardianAttendanceModalProps) {
  // Find dependents (students with same guardian phone)
  const dependents = mockStudents.filter(
    s => s.guardianPhone === guardianStudent.phone && s.id !== guardianStudent.id
  );

  const [selectedDependents, setSelectedDependents] = useState<string[]>(
    dependents.map(d => d.id)
  );

  const handleToggleDependent = (studentId: string) => {
    setSelectedDependents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleMarkAll = () => {
    const selectedNames = dependents
      .filter(d => selectedDependents.includes(d.id))
      .map(d => d.name)
      .join(', ');

    toast.success(
      `Marked ${action.toUpperCase()} for ${guardianStudent.name}${
        selectedDependents.length > 0 ? ` and ${selectedDependents.length} dependent(s): ${selectedNames}` : ''
      } at ${time}`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Attendance for Family</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Guardian Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{guardianStudent.name}</p>
                <p className="text-sm text-slate-500">Guardian</p>
                <Badge className="mt-1">
                  Marking {action.toUpperCase()} at {time}
                </Badge>
              </div>
            </div>
          </div>

          {/* Dependents */}
          {dependents.length > 0 ? (
            <>
              <div>
                <Label className="text-base">Also mark attendance for dependents?</Label>
                <p className="text-sm text-slate-500 mt-1">
                  Select family members to mark {action} at the same time
                </p>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dependents.map(dependent => (
                  <div
                    key={dependent.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50"
                  >
                    <Checkbox
                      id={dependent.id}
                      checked={selectedDependents.includes(dependent.id)}
                      onCheckedChange={() => handleToggleDependent(dependent.id)}
                    />
                    <Label
                      htmlFor={dependent.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{dependent.name}</p>
                        <p className="text-xs text-slate-500">
                          {dependent.smartId} • {dependent.shift} Shift
                        </p>
                      </div>
                    </Label>
                    {dependent.currentSeat && (
                      <Badge variant="outline">{dependent.currentSeat}</Badge>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedDependents.length} of {dependents.length} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedDependents(
                      selectedDependents.length === dependents.length
                        ? []
                        : dependents.map(d => d.id)
                    )
                  }
                >
                  {selectedDependents.length === dependents.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </>
          ) : (
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-sm text-slate-500">No dependents found for this guardian</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleMarkAll} className="flex-1">
              Mark {action.toUpperCase()} ({selectedDependents.length + 1})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
