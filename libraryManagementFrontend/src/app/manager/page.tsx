'use client';

import { useState } from 'react';
import { ManagerLayout } from '@/components/layout/manager-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  mockStudents, 
  mockEnquiries, 
  mockTodayCollection, 
  mockOccupancy, 
  mockPresentNow,
  mockRecentActivity 
} from '@/lib/opsData';
import { AlertCircle, Users, Phone, DollarSign, Plus, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { AdmissionWizard } from '@/components/modals/admission-wizard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function OpsDashboard() {
  const [showAdmission, setShowAdmission] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [smartId, setSmartId] = useState('');
  
  const duesPending = mockStudents.filter(s => s.dueAmount > 0);
  const unallocated = mockStudents.filter(s => s.status === 'active' && !s.currentSeat);
  const leadsToCall = mockEnquiries.filter(e => 
    format(new Date(e.followUpDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const handleQuickScan = () => {
    const student = mockStudents.find(s => s.smartId === smartId);
    if (student) {
      toast.success(`${student.name} marked IN`);
      setShowScanner(false);
      setSmartId('');
    } else {
      toast.error('Student not found');
    }
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAdmission(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Admission
            </Button>
            <Button variant="outline" onClick={() => setShowScanner(true)}>
              <Camera className="h-4 w-4 mr-2" />
              Mark In/Out
            </Button>
          </div>
        </div>

        {/* Critical Lists - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dues Pending */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                Dues Pending
                <Badge variant="destructive" className="ml-auto">{duesPending.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {duesPending.slice(0, 5).map(student => (
                  <div key={student.id} className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.smartId}</p>
                    </div>
                    <div className="text-right mr-2">
                      <p className="text-sm font-bold text-red-600">₹{student.dueAmount}</p>
                    </div>
                    <Button size="sm" variant="destructive">Collect</Button>
                  </div>
                ))}
                {duesPending.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No pending dues</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Unallocated Students */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                Unallocated Students
                <Badge variant="secondary" className="ml-auto bg-orange-100 text-orange-700">{unallocated.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {unallocated.slice(0, 5).map(student => (
                  <div key={student.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.shift} Shift</p>
                    </div>
                    <Button size="sm" variant="outline">Assign Seat</Button>
                  </div>
                ))}
                {unallocated.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">All students allocated</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Leads to Call */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                Leads to Call Today
                <Badge className="ml-auto">{leadsToCall.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {leadsToCall.map(lead => (
                  <div key={lead.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.phone}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">Call</Button>
                      <Button size="sm" variant="ghost">Message</Button>
                    </div>
                  </div>
                ))}
                {leadsToCall.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No follow-ups today</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats - Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Collection */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Today's Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-3xl font-bold text-slate-900">₹{mockTodayCollection.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Updated in real-time</p>
            </CardContent>
          </Card>

          {/* Occupancy */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{mockOccupancy.occupied}</span>
                  <span className="text-lg text-slate-500">/ {mockOccupancy.total}</span>
                </div>
                <Progress value={(mockOccupancy.occupied / mockOccupancy.total) * 100} className="h-2" />
                <p className="text-xs text-slate-500">{Math.round((mockOccupancy.occupied / mockOccupancy.total) * 100)}% occupied</p>
              </div>
            </CardContent>
          </Card>

          {/* Present Now */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Present Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-3xl font-bold text-slate-900">{mockPresentNow}</span>
                <span className="text-lg text-slate-500">students</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Live attendance count</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - Bottom Row */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">{activity.user[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500">{format(new Date(activity.timestamp), 'MMM dd, yyyy • hh:mm a')}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">₹{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showAdmission && (
        <AdmissionWizard open={showAdmission} onClose={() => setShowAdmission(false)} />
      )}
      
      {/* Quick Scanner */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Mark In/Out</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Smart ID</Label>
              <Input
                value={smartId}
                onChange={(e) => setSmartId(e.target.value)}
                placeholder="Enter Smart ID..."
                onKeyDown={(e) => e.key === 'Enter' && handleQuickScan()}
              />
            </div>
            <Button onClick={handleQuickScan} className="w-full">
              Mark Attendance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ManagerLayout>
  );
}
