'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewAdmissionModal } from '@/components/modals/new-admission-modal';
import { useStudentStore } from '@/lib/stores/student-store';
import { Badge } from '@/components/ui/badge';
import { getBranchById } from '@/lib/mockData';

export default function AdmissionsPage() {
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const { students, fetchStudents, isLoading } = useStudentStore();

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admissions</h1>
          <p className="text-muted-foreground">
            Manage student admissions and enrollments
          </p>
        </div>
        <Button onClick={() => setShowAdmissionModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Admission
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {students.filter((s) => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {students.filter((s) => s.status === 'expired').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {students.filter((s) => s.status === 'inactive').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Admissions</CardTitle>
          <CardDescription>Latest students admitted to the library</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading students...</p>
          ) : (
            <div className="space-y-4">
              {students.slice(0, 10).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.smartId} • {getBranchById(student.branchId)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        student.status === 'active'
                          ? 'default'
                          : student.status === 'expired'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {student.status}
                    </Badge>
                    <Badge variant="outline">{student.shiftType}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <NewAdmissionModal open={showAdmissionModal} onOpenChange={setShowAdmissionModal} />
    </div>
  );
}
