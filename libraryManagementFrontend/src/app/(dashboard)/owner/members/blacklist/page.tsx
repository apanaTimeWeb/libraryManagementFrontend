'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { blacklist } from '@/lib/mockData';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function BlacklistPage() {
  const [blacklistData, setBlacklistData] = useState(blacklist);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEntry = {
      id: `blk-${blacklistData.length + 1}`,
      branchId: 'br-del-001',
      phone: formData.get('phone') as string,
      name: formData.get('name') as string,
      reason: formData.get('reason') as string,
      severity: formData.get('severity') as 'low' | 'medium' | 'high',
      addedBy: 'usr-own-001',
      date: new Date().toISOString(),
    };
    setBlacklistData([newEntry, ...blacklistData]);
    toast.success('Added to blacklist');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blacklist</h1>
          <p className="text-muted-foreground">Manage blacklisted individuals</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add to Blacklist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Blacklist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Phone *</Label>
                <Input name="phone" type="tel" required placeholder="+91..." />
              </div>
              <div>
                <Label>Name *</Label>
                <Input name="name" required />
              </div>
              <div>
                <Label>Reason *</Label>
                <Textarea name="reason" required />
              </div>
              <div>
                <Label>Severity *</Label>
                <select name="severity" required className="w-full border rounded-md p-2">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
          <CardTitle>Blacklisted Individuals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {blacklistData.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">{entry.phone}</p>
                  <p className="text-sm mt-1">{entry.reason}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    entry.severity === 'high' ? 'destructive' :
                    entry.severity === 'medium' ? 'secondary' :
                    'outline'
                  }>
                    {entry.severity}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), 'MMM dd, yyyy')}
                  </div>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
