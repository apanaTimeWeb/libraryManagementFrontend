'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/lib/types/ops-types';
import { mockSeats } from '@/lib/opsData';
import { toast } from 'sonner';

interface SeatAssignmentModalProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export function SeatAssignmentModal({ student, open, onClose }: SeatAssignmentModalProps) {
  const [selectedSeat, setSelectedSeat] = useState('');

  const handleAssign = () => {
    toast.success(`Seat ${selectedSeat} assigned to ${student.name}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Assign Seat to {student.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-green-500 rounded" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-red-500 rounded" />
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-orange-500 rounded" />
              <span>Maintenance</span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto p-4 border rounded-lg">
            {mockSeats.map(seat => {
              const isAvailable = seat.status === 'available';
              const isSelected = selectedSeat === seat.number;
              
              return (
                <Button
                  key={seat.id}
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSeat(seat.number)}
                  className={`h-12 ${
                    !isAvailable ? 
                      seat.status === 'occupied' ? 'bg-red-100 border-red-300' : 'bg-orange-100 border-orange-300'
                    : isSelected ? '' : 'bg-green-50 border-green-300 hover:bg-green-100'
                  }`}
                  title={seat.occupantName || seat.maintenanceReason || ''}
                >
                  {seat.number}
                </Button>
              );
            })}
          </div>

          {selectedSeat && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Selected Seat:</span> {selectedSeat}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAssign} disabled={!selectedSeat}>
              Assign Seat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
