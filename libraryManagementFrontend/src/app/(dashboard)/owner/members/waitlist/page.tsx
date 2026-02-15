'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { waitlist } from '@/lib/mockData';
import { Plus, Bell, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function WaitlistPage() {
  const [waitlistData, setWaitlistData] = useState(waitlist);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const potentialRevenue = waitlistData.filter(w => w.status === 'waiting').reduce((sum, w) => sum + w.potentialRevenue, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEntry = {
      id: `wait-${waitlistData.length + 1}`,
      branchId: 'br-del-001',
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      preferredShift: formData.get('preferredShift') as any,
      joinedDate: new Date().toISOString(),
      status: 'waiting' as const,
      potentialRevenue: 1200,
      priority: waitlistData.length + 1,
      notes: formData.get('notes') as string,
    };
    setWaitlistData([...waitlistData, newEntry]);
    toast.success('Added to waitlist');
    setIsAddOpen(false);
  };

  const handleNotify = (id: string) => {
    setWaitlistData(waitlistData.map(w => 
      w.id === id ? { ...w, status: 'notified' as const } : w
    ));
    toast.success('Notification sent');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Waitlist</h1>
          <p className="text-muted-foreground">Manage seat waitlist</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add to Waitlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Waitlist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input name="name" required />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input name="phone" type="tel" required />
              </div>
              <div>
                <Label>Preferred Shift *</Label>
                <select name="preferredShift" required className="w-full border rounded-md p-2">
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea name="notes" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Potential Revenue: ₹{potentialRevenue.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {waitlistData.map((entry, idx) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground">#{idx + 1}</div>
                  <div>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-sm text-muted-foreground">{entry.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Preferred Shift</p>
                    <p className="font-medium capitalize">{entry.preferredShift}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Waiting Since</p>
                    <p className="font-medium">{format(new Date(entry.joinedDate), 'MMM dd')}</p>
                  </div>
                  <Badge variant={
                    entry.status === 'waiting' ? 'default' :
                    entry.status === 'notified' ? 'secondary' :
                    'outline'
                  }>
                    {entry.status}
                  </Badge>
                  <div className="flex gap-2">
                    {entry.status === 'waiting' && (
                      <Button variant="outline" size="sm" onClick={() => handleNotify(entry.id)}>
                        <Bell className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
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
