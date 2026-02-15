'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { users } from '@/lib/mockData';
import { Plus, Edit, Key, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function UsersPage() {
  const [usersData, setUsersData] = useState(users.filter(u => u.role !== 'superadmin' && u.role !== 'owner'));
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = {
      id: `usr-${usersData.length + 1}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as 'manager' | 'staff',
      branchId: 'br-del-001',
      permissions: ['manage_students', 'collect_fees'],
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setUsersData([newUser, ...usersData]);
    toast.success('User created successfully');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage managers and staff</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add User</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Name *</Label>
                  <Input name="name" required />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input name="phone" type="tel" required placeholder="+91..." />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="email" type="email" />
                </div>
                <div>
                  <Label>Role *</Label>
                  <select name="role" required className="w-full border rounded-md p-2">
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Manage Students', 'Collect Fees', 'View Reports', 'Mark Attendance'].map(perm => (
                      <div key={perm} className="flex items-center gap-2">
                        <Checkbox defaultChecked />
                        <Label className="text-sm">{perm}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usersData.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email || user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={user.role === 'manager' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.isActive ? 'default' : 'outline'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Last login: {user.lastLogin ? format(new Date(user.lastLogin), 'MMM dd') : 'Never'}
                  </div>
                  <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm"><Key className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
