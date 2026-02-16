'use client';

import { useState } from 'react';
import { ManagerLayout } from '@/components/layout/manager-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockSeats, mockStudents } from '@/lib/opsData';
import { Armchair, Users, AlertCircle, CheckCircle, Wrench } from 'lucide-react';
import { SeatAssignmentModal } from '@/components/modals/seat-assignment-modal';
import { StudentProfileDrawer } from '@/components/modals/student-profile-drawer';
import { Student } from '@/lib/types/ops-types';

export default function SeatsPage() {
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const occupiedSeats = mockSeats.filter(s => s.status === 'occupied').length;
  const availableSeats = mockSeats.filter(s => s.status === 'available').length;
  const maintenanceSeats = mockSeats.filter(s => s.status === 'maintenance').length;

  const handleSeatClick = (seat: any) => {
    if (seat.status === 'occupied' && seat.occupantId) {
      const student = mockStudents.find(s => s.id === seat.occupantId);
      if (student) {
        setSelectedStudent(student);
      }
    } else if (seat.status === 'available') {
      setSelectedSeat(seat);
    }
  };

  const getSeatIcon = (status: string) => {
    switch (status) {
      case 'occupied':
        return <Users className="h-5 w-5" />;
      case 'available':
        return <CheckCircle className="h-5 w-5" />;
      case 'maintenance':
        return <Wrench className="h-5 w-5" />;
      default:
        return <Armchair className="h-5 w-5" />;
    }
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seat Management</h1>
          <p className="text-sm text-slate-500">View and manage seat allocations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Seats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Armchair className="h-5 w-5 text-slate-600" />
                <span className="text-3xl font-bold text-slate-900">{mockSeats.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Occupied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Users className="h-5 w-5 text-red-600" />
                <span className="text-3xl font-bold text-red-600">{occupiedSeats}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-3xl font-bold text-green-600">{availableSeats}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                <span className="text-3xl font-bold text-orange-600">{maintenanceSeats}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seat Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Seat Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-red-500 rounded" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-green-500 rounded" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-orange-500 rounded" />
                <span>Maintenance</span>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {mockSeats.map((seat) => (
                <Button
                  key={seat.id}
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center ${
                    seat.status === 'occupied' ? 'bg-red-50 border-red-300 hover:bg-red-100' :
                    seat.status === 'available' ? 'bg-green-50 border-green-300 hover:bg-green-100' :
                    'bg-orange-50 border-orange-300 hover:bg-orange-100'
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {getSeatIcon(seat.status)}
                  <span className="text-xs font-medium mt-1">{seat.number}</span>
                  {seat.occupantName && (
                    <span className="text-xs text-slate-500 truncate w-full text-center px-1">
                      {seat.occupantName.split(' ')[0]}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seat Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Seat Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Seat Number</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Occupant</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Expiry</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSeats.map((seat) => (
                    <tr key={seat.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{seat.number}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={
                            seat.status === 'occupied' ? 'destructive' :
                            seat.status === 'available' ? 'default' :
                            'secondary'
                          }
                        >
                          {seat.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {seat.occupantName ? (
                          <div>
                            <p className="font-medium">{seat.occupantName}</p>
                            <p className="text-xs text-slate-500">ID: {seat.occupantId}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {seat.expiry ? (
                          <span className="text-sm">{new Date(seat.expiry).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {seat.status === 'available' && (
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedSeat(seat)}
                          >
                            Assign
                          </Button>
                        )}
                        {seat.status === 'occupied' && seat.occupantId && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const student = mockStudents.find(s => s.id === seat.occupantId);
                              if (student) setSelectedStudent(student);
                            }}
                          >
                            View Student
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {selectedSeat && (
        <SeatAssignmentModal
          seat={selectedSeat}
          open={!!selectedSeat}
          onClose={() => setSelectedSeat(null)}
        />
      )}

      {selectedStudent && (
        <StudentProfileDrawer
          student={selectedStudent}
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </ManagerLayout>
  );
}
