'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { students, payments, subscriptions, plans, familyRelations, complaints } from '@/lib/mockData';
import { format, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns';
import { ArrowLeft, Star, Phone, Mail, Building2, Calendar, CreditCard, FileText, Activity, Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  
  const student = students.find(s => s.id === studentId);
  const [isSuspended, setIsSuspended] = useState(student?.status === 'suspended');
  const [showExitModal, setShowExitModal] = useState(false);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const subscription = subscriptions.find(s => s.studentId === studentId);
  const plan = subscription ? plans.find(p => p.id === subscription.planId) : null;
  const studentPayments = payments.filter(p => p.studentId === studentId);
  const studentComplaints = complaints.filter(c => c.studentId === studentId);
  const family = familyRelations.filter(f => f.guardianStudentId === studentId || f.dependentStudentId === studentId);

  // Mock attendance data
  const currentMonth = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  const attendanceData = daysInMonth.map(day => ({
    date: day,
    present: Math.random() > 0.2
  }));
  const attendancePercentage = Math.round((attendanceData.filter(a => a.present).length / attendanceData.length) * 100);

  const handleSuspend = () => {
    setIsSuspended(!isSuspended);
    toast.success(isSuspended ? 'Student reactivated' : 'Student suspended');
  };

  const handleExit = () => {
    toast.success('Exit process initiated');
    setShowExitModal(false);
    router.push('/owner/members/directory');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">{student.smartId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={isSuspended ? "default" : "destructive"} onClick={handleSuspend}>
            {isSuspended ? 'Reactivate' : 'Suspend'}
          </Button>
          <Button variant="outline" onClick={() => setShowExitModal(true)}>
            Exit Student
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <Badge variant={student.status === 'active' ? 'default' : 'destructive'}>
                      {student.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                  {student.parentPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{student.parentPhone} (Parent)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{student.college}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Seat</p>
                    <p className="font-medium">{student.currentSeat || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shift</p>
                    <p className="font-medium">{student.shift}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trust Score</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < student.trustScore ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Amount</p>
                    <p className={`font-medium ${student.dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{student.dueAmount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {family.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Family Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {family.map(rel => {
                    const relatedStudent = students.find(s => 
                      s.id === (rel.guardianStudentId === studentId ? rel.dependentStudentId : rel.guardianStudentId)
                    );
                    return relatedStudent ? (
                      <div key={rel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          {rel.isGuardian && <Crown className="h-4 w-4 text-yellow-500" />}
                          <div>
                            <p className="font-medium">{relatedStudent.name}</p>
                            <p className="text-xs text-muted-foreground">{rel.relationship}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{relatedStudent.smartId}</Badge>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {plan && subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-2xl font-bold text-indigo-600">₹{plan.price}</p>
                    </div>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                      {subscription.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{format(new Date(subscription.startDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">{format(new Date(subscription.endDate), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((feature, i) => (
                        <Badge key={i} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No active subscription</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {studentPayments.length > 0 ? (
                  studentPayments.map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">₹{payment.amount}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(payment.date), 'MMM dd, yyyy')} • {payment.mode}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{payment.receivedBy}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No payment history</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Attendance Rate</span>
                  <span className="text-2xl font-bold text-green-600">{attendancePercentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600" 
                    style={{ width: `${attendancePercentage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day, i) => {
                  const attendance = attendanceData[i];
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${
                        attendance.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-900">
                  <strong>Pattern:</strong> Mostly present on weekdays
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complaint History</CardTitle>
            </CardHeader>
            <CardContent>
              {studentComplaints.length > 0 ? (
                <div className="space-y-2">
                  {studentComplaints.map(complaint => (
                    <div key={complaint.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{complaint.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant={complaint.status === 'resolved' ? 'default' : 'secondary'}>
                        {complaint.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No complaints filed</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {student.referredBy ? (
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-900">
                    Referred by: <strong>{students.find(s => s.id === student.referredBy)?.name || 'Unknown'}</strong>
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No referral information</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to exit {student.name}? This will calculate any refunds and move them to alumni.
            </p>
            <div className="p-4 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-900">
                <strong>Refund Calculation:</strong> ₹{Math.floor(Math.random() * 1000)}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExitModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleExit}>
                Confirm Exit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
