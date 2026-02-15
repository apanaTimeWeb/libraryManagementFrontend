'use client';

import { useState } from 'react';
import { ManagerLayout } from '@/components/layout/manager-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockStudents } from '@/lib/opsData';
import { Student } from '@/lib/types/ops-types';
import { DollarSign, Send } from 'lucide-react';
import { CollectFeeModal } from '@/components/modals/collect-fee-modal';
import { DuesTable } from '@/components/tables/dues-table';
import { toast } from 'sonner';

export default function FeesPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const studentsWithDues = mockStudents.filter(s => s.dueAmount > 0);
  const totalDues = studentsWithDues.reduce((sum, s) => sum + s.dueAmount, 0);

  const handleBulkReminder = () => {
    toast.success(`Reminders sent to ${studentsWithDues.length} students via WhatsApp`);
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Fee Collection</h1>
            <p className="text-sm text-slate-500">Manage dues and collect payments</p>
          </div>
          <Button onClick={handleBulkReminder}>
            <Send className="h-4 w-4 mr-2" />
            Send Bulk Reminder
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Dues Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <DollarSign className="h-5 w-5 text-red-600" />
                <span className="text-3xl font-bold text-red-600">₹{totalDues.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Students with Dues</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-slate-900">{studentsWithDues.length}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Late Fee Applicable</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-orange-600">
                {studentsWithDues.filter(s => s.lateFeeApplicable).length}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Dues Manager Table */}
        <Card>
          <CardHeader>
            <CardTitle>Dues Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <DuesTable
              students={studentsWithDues}
              onCollectFee={setSelectedStudent}
            />
          </CardContent>
        </Card>
      </div>

      {/* Collect Fee Modal */}
      {selectedStudent && (
        <CollectFeeModal
          student={selectedStudent}
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </ManagerLayout>
  );
}
