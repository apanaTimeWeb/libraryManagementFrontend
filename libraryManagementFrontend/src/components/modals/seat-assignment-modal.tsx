'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Student } from '@/lib/types/ops-types';
import { mockSeats } from '@/lib/opsData';
import { toast } from 'sonner';
import { AlertCircle, Search } from 'lucide-react';

interface SeatAssignmentModalProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export function SeatAssignmentModal({ student, open, onClose }: SeatAssignmentModalProps) {
  const [selectedSeat, setSelectedSeat] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const filteredSeats = mockSeats.filter(seat => 
    seat.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSeatClick = (seat: any) => {
    if (seat.status === 'maintenance') {
      setShowWarning(true);
      toast.warning('This seat is under maintenance. Proceed anyway?');
    } else {
      setShowWarning(false);
    }
    setSelectedSeat(seat.number);
  };

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
          {/* Student Info */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="font-medium">{student.name}</p>
            <p className="text-sm text-slate-500">{student.smartId} • {student.shift} Shift</p>
          </div>

          {/* Search */}
          <div>
            <Label>Search Seat</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by seat number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Legend */}
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

          {/* Seat Matrix */}
          <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto p-4 border rounded-lg bg-slate-50">
            {filteredSeats.map(seat => {
              const isAvailable = seat.status === 'available';
              const isOccupied = seat.status === 'occupied';
              const isMaintenance = seat.status === 'maintenance';
              const isSelected = selectedSeat === seat.number;
              
              return (
                <Button
                  key={seat.id}
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  disabled={isOccupied}
                  onClick={() => handleSeatClick(seat)}
                  className={`h-12 relative group ${
                    isOccupied ? 'bg-red-100 border-red-300 cursor-not-allowed' :
                    isMaintenance ? 'bg-orange-100 border-orange-300' :
                    isSelected ? '' : 'bg-green-50 border-green-300 hover:bg-green-100'
                  }`}
                  title={seat.occupantName || seat.maintenanceReason || 'Available'}
                >
                  <span className="text-xs font-medium">{seat.number}</span>
                  {/* Tooltip on hover */}
                  {(seat.occupantName || seat.maintenanceReason) && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {seat.occupantName || seat.maintenanceReason}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Selected Seat Info */}
          {selectedSeat && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Selected Seat:</span> {selectedSeat}
              </p>
              {showWarning && (
                <div className="flex items-center gap-2 mt-2 text-orange-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  This seat is under maintenance
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAssign} disabled={!selectedSeat}>
              Assign Seat {selectedSeat}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
