'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { students, plans, subscriptions } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Phone, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const router = useRouter();

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.smartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStudentPlan = (studentId: string) => {
    const sub = subscriptions.find(s => s.studentId === studentId);
    return sub ? plans.find(p => p.id === sub.planId)?.name : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Directory</h1>
        <p className="text-muted-foreground">View and manage all students</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Input 
              placeholder="Search by name, Smart ID, or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredStudents.slice(0, 50).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.smartId} • {student.college}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="font-medium">{getStudentPlan(student.id)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Seat</p>
                    <p className="font-medium">{student.currentSeat || 'N/A'}</p>
                  </div>
                  <Badge variant={
                    student.status === 'active' ? 'default' :
                    student.status === 'expired' ? 'secondary' :
                    'outline'
                  }>
                    {student.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/owner/members/students/${student.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
