'use client';

import { useState } from 'react';
import { ManagerLayout } from '@/components/layout/manager-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockStudents } from '@/lib/opsData';
import { Student } from '@/lib/types/ops-types';
import { Plus, Search } from 'lucide-react';
import { StudentTable } from '@/components/tables/student-table';
import { StudentProfileDrawer } from '@/components/modals/student-profile-drawer';
import { AdmissionWizard } from '@/components/modals/admission-wizard';
import { SeatAssignmentModal } from '@/components/modals/seat-assignment-modal';
import { CollectFeeModal } from '@/components/modals/collect-fee-modal';

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    hasDues: false,
    noSeat: false,
    shift: 'all',
    status: 'all'
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAdmission, setShowAdmission] = useState(false);
  const [showSeatAssignment, setShowSeatAssignment] = useState<Student | null>(null);
  const [showFeeCollection, setShowFeeCollection] = useState<Student | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.smartId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.phone.includes(searchQuery);
    const matchesDues = !filters.hasDues || student.dueAmount > 0;
    const matchesSeat = !filters.noSeat || !student.currentSeat;
    const matchesShift = filters.shift === 'all' || student.shift === filters.shift;
    const matchesStatus = filters.status === 'all' || student.status === filters.status;

    return matchesSearch && matchesDues && matchesSeat && matchesShift && matchesStatus;
  });

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
            <p className="text-sm text-slate-500">Manage student admissions and profiles</p>
          </div>
          <Button onClick={() => setShowAdmission(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Admission
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by name, ID, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button
                variant={filters.hasDues ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, hasDues: !filters.hasDues })}
              >
                Has Dues
              </Button>
              <Button
                variant={filters.noSeat ? 'default' : 'outline'}
                onClick={() => setFilters({ ...filters, noSeat: !filters.noSeat })}
              >
                No Seat
              </Button>
              <select
                value={filters.shift}
                onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Shifts</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6">
            <StudentTable
              students={filteredStudents}
              onViewProfile={setSelectedStudent}
              onAssignSeat={setShowSeatAssignment}
              onCollectFee={setShowFeeCollection}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <StudentProfileDrawer
          student={selectedStudent}
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
      {showAdmission && (
        <AdmissionWizard
          open={showAdmission}
          onClose={() => setShowAdmission(false)}
        />
      )}
      {showSeatAssignment && (
        <SeatAssignmentModal
          student={showSeatAssignment}
          open={!!showSeatAssignment}
          onClose={() => setShowSeatAssignment(null)}
        />
      )}
      {showFeeCollection && (
        <CollectFeeModal
          student={showFeeCollection}
          open={!!showFeeCollection}
          onClose={() => setShowFeeCollection(null)}
        />
      )}
    </ManagerLayout>
  );
}
