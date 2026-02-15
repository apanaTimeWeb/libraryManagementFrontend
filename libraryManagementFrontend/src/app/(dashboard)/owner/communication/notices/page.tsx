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
import { Checkbox } from '@/components/ui/checkbox';
import { notices } from '@/lib/mockData';
import { format } from 'date-fns';
import { Megaphone, Plus, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NoticesPage() {
  const [noticeList, setNoticeList] = useState(notices);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const handleCreateNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newNotice = {
      id: `not-${noticeList.length + 1}`,
      title: formData.get('title') as string,
      message: formData.get('message') as string,
      type: formData.get('type') as any,
      targetAudience: formData.get('target') as any,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      createdBy: 'usr-own-001',
      createdAt: new Date().toISOString(),
    };

    setNoticeList([newNotice, ...noticeList]);
    setIsCreateOpen(false);
    toast.success('Notice created and sent successfully');
  };

  const handleDelete = (id: string) => {
    setNoticeList(noticeList.filter(n => n.id !== id));
    toast.success('Notice deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notices</h1>
          <p className="text-muted-foreground">Send announcements to students and staff</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="Enter notice title" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required rows={5} placeholder="Enter notice message" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Priority</Label>
                  <Select name="type" defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">General</SelectItem>
                      <SelectItem value="warning">Important</SelectItem>
                      <SelectItem value="urgent">Emergency</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target">Target Audience</Label>
                  <Select name="target" defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="staff">Staff Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Channels</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="whatsapp" defaultChecked />
                    <label htmlFor="whatsapp" className="text-sm">WhatsApp</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms" />
                    <label htmlFor="sms" className="text-sm">SMS</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" />
                    <label htmlFor="email" className="text-sm">Email</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send Notice</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {noticeList.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-indigo-600" />
                    <CardTitle>{notice.title}</CardTitle>
                    <Badge variant={
                      notice.type === 'urgent' ? 'destructive' :
                      notice.type === 'warning' ? 'default' :
                      'secondary'
                    }>
                      {notice.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{notice.message}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notice.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Sent</p>
                  <p className="font-medium">{notice.sentCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivered</p>
                  <p className="font-medium">{notice.deliveredCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Read</p>
                  <p className="font-medium">{notice.readCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery Rate</p>
                  <p className="font-medium text-green-600">
                    {notice.sentCount > 0 ? Math.round((notice.deliveredCount / notice.sentCount) * 100) : 0}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Sent on {format(new Date(notice.createdAt), 'MMM dd, yyyy HH:mm')} • Target: {notice.targetAudience}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedNotice && (
        <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delivery Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{selectedNotice.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedNotice.message}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-2xl font-bold">{selectedNotice.sentCount}</p>
                    <p className="text-xs text-muted-foreground">Total Sent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-2xl font-bold text-green-600">{selectedNotice.deliveredCount}</p>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-2xl font-bold text-red-600">
                      {selectedNotice.sentCount - selectedNotice.deliveredCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
