'use client';

import { useState } from 'react';
import { ManagerLayout } from '@/components/layout/manager-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { mockStudents, mockAttendance } from '@/lib/opsData';
import { Camera, AlertTriangle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AttendancePage() {
  const [smartId, setSmartId] = useState('');
  const [notifyGuardian, setNotifyGuardian] = useState(true);
  const [scannedStudent, setScannedStudent] = useState<any>(null);

  const absentees = mockStudents.filter(s => s.status === 'active').slice(0, 5);
  const presentToday = mockAttendance.length;

  const handleScan = () => {
    const student = mockStudents.find(s => s.smartId === smartId);
    if (student) {
      setScannedStudent(student);
    } else {
      toast.error('Student not found');
    }
  };

  const handleMarkIn = () => {
    if (!scannedStudent) return;
    toast.success(
      `${scannedStudent.name} marked IN at ${new Date().toLocaleTimeString()}${
        notifyGuardian && scannedStudent.parentPhone ? '. Message sent to parent.' : ''
      }`
    );
    setScannedStudent(null);
    setSmartId('');
  };

  const handleMarkOut = () => {
    if (!scannedStudent) return;
    toast.success(
      `${scannedStudent.name} marked OUT at ${new Date().toLocaleTimeString()}${
        notifyGuardian && scannedStudent.parentPhone ? '. Message sent to parent.' : ''
      }`
    );
    setScannedStudent(null);
    setSmartId('');
  };

  const handleSendWarning = (student: any) => {
    toast.success(`Warning sent to ${student.name} and guardian`);
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">Mark student attendance and track absentees</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-green-600">{presentToday}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Absent Today</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-red-600">{mockStudents.length - presentToday}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-blue-600">
                {Math.round((presentToday / mockStudents.length) * 100)}%
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Mark In/Out Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Mark In/Out
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Smart ID</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter or scan Smart ID..."
                  value={smartId}
                  onChange={(e) => setSmartId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                />
                <Button onClick={handleScan}>Scan</Button>
              </div>
            </div>

            {scannedStudent && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                    {scannedStudent.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{scannedStudent.name}</h3>
                    <p className="text-sm text-slate-600">{scannedStudent.smartId}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge>{scannedStudent.shift} Shift</Badge>
                      {scannedStudent.currentSeat && <Badge variant="outline">{scannedStudent.currentSeat}</Badge>}
                    </div>
                  </div>
                </div>

                {scannedStudent.parentPhone && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify">Notify Guardian?</Label>
                    <Switch
                      id="notify"
                      checked={notifyGuardian}
                      onCheckedChange={setNotifyGuardian}
                    />
                  </div>
                )}

                {scannedStudent.familyLinked && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      This student is linked to a family. Mark attendance for siblings too?
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleMarkIn} className="flex-1 bg-green-600 hover:bg-green-700">
                    Mark IN
                  </Button>
                  <Button onClick={handleMarkOut} className="flex-1 bg-red-600 hover:bg-red-700">
                    Mark OUT
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Absentee List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Absentee List (3+ Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Parent Phone</TableHead>
                    <TableHead>Consecutive Days</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absentees.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.smartId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>{student.parentPhone || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">3 days</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleSendWarning(student)}>
                          <Send className="h-3 w-3 mr-1" />
                          Send Warning
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManagerLayout>
  );
}
