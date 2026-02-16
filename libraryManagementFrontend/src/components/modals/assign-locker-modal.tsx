'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockStudents } from '@/lib/opsData';
import { toast } from 'sonner';
import { Search, Lock } from 'lucide-react';

interface AssignLockerModalProps {
  lockerNumber: string;
  open: boolean;
  onClose: () => void;
}

export function AssignLockerModal({ lockerNumber, open, onClose }: AssignLockerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [monthlyFee, setMonthlyFee] = useState(200);

  const filteredStudents = mockStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.smartId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    toast.success(
      `Locker ${lockerNumber} assigned to ${selectedStudent.name}. Monthly fee ₹${monthlyFee} added to dues.`
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Locker {lockerNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Locker Info */}
          <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Locker {lockerNumber}</p>
              <p className="text-sm text-slate-500">Available for assignment</p>
            </div>
          </div>

          {/* Student Search */}
          <div>
            <Label>Search Student *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or Smart ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {filteredStudents.slice(0, 5).map(student => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-3 cursor-pointer hover:bg-slate-50 border-b last:border-0 ${
                    selectedStudent?.id === student.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="font-medium text-sm">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.smartId} • {student.shift} Shift</p>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No students found</p>
              )}
            </div>
          )}

          {/* Selected Student */}
          {selectedStudent && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium">Selected Student</p>
              <p className="font-medium">{selectedStudent.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{selectedStudent.smartId}</Badge>
                <Badge variant="outline">{selectedStudent.shift}</Badge>
              </div>
            </div>
          )}

          {/* Monthly Fee */}
          <div>
            <Label>Monthly Fee (₹)</Label>
            <Input
              type="number"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(Number(e.target.value))}
              min={0}
            />
            <p className="text-xs text-slate-500 mt-1">
              This amount will be added to student's monthly dues
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAssign} className="flex-1" disabled={!selectedStudent}>
              Assign Locker
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
