'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { complaints, students } from '@/lib/mockData';
import { format } from 'date-fns';
import { MessageSquare, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ComplaintsPage() {
  const [complaintList, setComplaintList] = useState(complaints);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resolveDialog, setResolveDialog] = useState<any>(null);

  const openComplaints = complaintList.filter(c => c.status === 'open' || c.status === 'in_progress');
  const resolvedComplaints = complaintList.filter(c => c.status === 'resolved');

  const handleCreateComplaint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newComplaint = {
      id: `cmp-${complaintList.length + 1}`,
      branchId: 'br-del-001',
      studentId: formData.get('studentId') as string || undefined,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      priority: formData.get('priority') as any,
      status: 'open' as const,
      assignedTo: undefined,
      resolution: undefined,
      createdAt: new Date().toISOString(),
      resolvedAt: undefined,
    };

    setComplaintList([newComplaint, ...complaintList]);
    setIsCreateOpen(false);
    toast.success('Complaint registered successfully');
  };

  const handleResolve = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setComplaintList(complaintList.map(c => 
      c.id === resolveDialog.id ? {
        ...c,
        status: 'resolved' as const,
        resolution: formData.get('resolution') as string,
        resolvedAt: new Date().toISOString(),
      } : c
    ));
    
    setResolveDialog(null);
    toast.success('Complaint resolved successfully');
  };

  const ComplaintCard = ({ complaint }: { complaint: any }) => {
    const student = students.find(s => s.id === complaint.studentId);
    const daysOpen = Math.floor((new Date().getTime() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">{complaint.title}</CardTitle>
                <Badge variant={
                  complaint.priority === 'urgent' ? 'destructive' :
                  complaint.priority === 'high' ? 'default' :
                  'secondary'
                }>
                  {complaint.priority}
                </Badge>
                <Badge variant="outline">{complaint.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{complaint.description}</p>
            </div>
            {complaint.status !== 'resolved' && (
              <Button
                size="sm"
                onClick={() => setResolveDialog(complaint)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Complainant</p>
              <p className="font-medium">{student ? student.name : 'Anonymous'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant={complaint.status === 'resolved' ? 'default' : 'secondary'}>
                {complaint.status}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Days {complaint.status === 'resolved' ? 'to Resolve' : 'Open'}</p>
              <p className="font-medium">{daysOpen}</p>
            </div>
          </div>
          {complaint.resolution && (
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-sm font-medium text-green-900">Resolution:</p>
              <p className="text-sm text-green-700 mt-1">{complaint.resolution}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Created on {format(new Date(complaint.createdAt), 'MMM dd, yyyy HH:mm')}
            {complaint.resolvedAt && ` • Resolved on ${format(new Date(complaint.resolvedAt), 'MMM dd, yyyy HH:mm')}`}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">Manage student and staff complaints</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Register New Complaint</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="Brief description of the issue" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required rows={4} placeholder="Detailed description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue="infrastructure">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="noise">Noise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="studentId">Student (Optional)</Label>
                <Select name="studentId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select student or leave anonymous" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.slice(0, 20).map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register Complaint</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">
            Open ({openComplaints.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedComplaints.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4 mt-6">
          {openComplaints.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No open complaints</p>
              </CardContent>
            </Card>
          ) : (
            openComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4 mt-6">
          {resolvedComplaints.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No resolved complaints</p>
              </CardContent>
            </Card>
          ) : (
            resolvedComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {resolveDialog && (
        <Dialog open={!!resolveDialog} onOpenChange={() => setResolveDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve Complaint</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <Label>Complaint</Label>
                <p className="text-sm text-muted-foreground mt-1">{resolveDialog.title}</p>
              </div>
              <div>
                <Label htmlFor="resolution">Resolution Notes</Label>
                <Textarea 
                  id="resolution" 
                  name="resolution" 
                  required 
                  rows={4} 
                  placeholder="Describe how the complaint was resolved"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setResolveDialog(null)}>
                  Cancel
                </Button>
                <Button type="submit">Mark as Resolved</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
