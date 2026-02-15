'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Student } from '@/lib/types/ops-types';
import { mockPayments, mockAttendance } from '@/lib/opsData';
import { useRoleStore } from '@/lib/stores/role-store';
import { format } from 'date-fns';
import { FileText, Ban, CheckCircle, ArrowRightLeft, LogOut } from 'lucide-react';
import { useState } from 'react';
import { ShiftMigrationModal } from './shift-migration-modal';
import { StudentExitModal } from './student-exit-modal';

interface StudentProfileDrawerProps {
  student: Student;
  open: boolean;
  onClose: () => void;
}

export function StudentProfileDrawer({ student, open, onClose }: StudentProfileDrawerProps) {
  const { isManager } = useRoleStore();
  const [showShiftMigration, setShowShiftMigration] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const payments = mockPayments.filter(p => p.studentId === student.id);
  const attendance = mockAttendance.filter(a => a.studentId === student.id);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Student Profile</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
              {student.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-sm text-slate-500">{student.smartId}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={student.status === 'active' ? 'default' : 'destructive'}>
                  {student.status}
                </Badge>
                {student.currentSeat && <Badge variant="outline">{student.currentSeat}</Badge>}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate ID Card
            </Button>
            <Button size="sm" variant="outline">
              {student.status === 'active' ? (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reactivate
                </>
              )}
            </Button>
            {isManager() && (
              <>
                <Button size="sm" variant="outline" onClick={() => setShowShiftMigration(true)}>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Change Shift
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setShowExit(true)}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit
                </Button>
              </>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Parent Phone</p>
                  <p className="font-medium">{student.parentPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{student.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">College</p>
                  <p className="font-medium">{student.college || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Shift</p>
                  <p className="font-medium">{student.shift}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Due Amount</p>
                  <p className={`font-medium ${student.dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{student.dueAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Expiry Date</p>
                  <p className="font-medium">{format(new Date(student.expiryDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Trust Score</p>
                  <p className="font-medium">{student.trustScore}/5</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="family">
              {student.familyLinked ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm">Family linked with guardian: {student.guardianPhone}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No family members linked</p>
                  <Button variant="outline">Add to Family</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="payments">
              <div className="space-y-3">
                {payments.length > 0 ? (
                  payments.map(payment => (
                    <div key={payment.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">₹{payment.amount}</p>
                          <p className="text-xs text-slate-500">{format(new Date(payment.date), 'MMM dd, yyyy')}</p>
                        </div>
                        <Badge variant="outline">{payment.mode}</Badge>
                      </div>
                      {payment.transactionId && (
                        <p className="text-xs text-slate-500 mt-2">TXN: {payment.transactionId}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">No payment history</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <div className="space-y-3">
                {attendance.length > 0 ? (
                  attendance.map(att => (
                    <div key={att.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between">
                        <p className="font-medium">{format(new Date(att.date), 'MMM dd, yyyy')}</p>
                        <Badge variant="outline">Present</Badge>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-slate-600">
                        <span>In: {att.checkIn}</span>
                        {att.checkOut && <span>Out: {att.checkOut}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">No attendance records</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        {showShiftMigration && (
          <ShiftMigrationModal
            student={student}
            open={showShiftMigration}
            onClose={() => setShowShiftMigration(false)}
          />
        )}
        {showExit && (
          <StudentExitModal
            student={student}
            open={showExit}
            onClose={() => setShowExit(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
