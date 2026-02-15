'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { familyRelations, students } from '@/lib/mockData';
import { Heart, Plus, Users, Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function FamiliesPage() {
  const [relations, setRelations] = useState(familyRelations);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);

  // Group relations by guardian
  const familyGroups = relations.reduce((acc, rel) => {
    const guardian = rel.isGuardian ? rel.guardianStudentId : rel.dependentStudentId;
    if (!acc[guardian]) {
      acc[guardian] = [];
    }
    acc[guardian].push(rel);
    return acc;
  }, {} as Record<string, typeof relations>);

  const handleAddRelation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newRelation = {
      id: `fam-${relations.length + 1}`,
      guardianStudentId: formData.get('guardian') as string,
      dependentStudentId: formData.get('dependent') as string,
      relationship: formData.get('relationship') as any,
      isGuardian: formData.get('isGuardian') === 'true',
    };

    setRelations([...relations, newRelation]);
    setIsAddOpen(false);
    toast.success('Family relationship added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family Management</h1>
          <p className="text-muted-foreground">Manage family relationships and guardian information</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Relationship
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Family Relationship</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRelation} className="space-y-4">
              <div>
                <Label htmlFor="guardian">Primary Member</Label>
                <Select name="guardian" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary member" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.slice(0, 50).map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.smartId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dependent">Related Member</Label>
                <Select name="dependent" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select related member" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.slice(0, 50).map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.smartId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Select name="relationship" defaultValue="brother">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brother">Brother</SelectItem>
                    <SelectItem value="sister">Sister</SelectItem>
                    <SelectItem value="cousin">Cousin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="isGuardian">Set as Guardian</Label>
                <Select name="isGuardian" defaultValue="false">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Relationship</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {Object.entries(familyGroups).map(([guardianId, familyMembers]) => {
          const guardian = students.find(s => s.id === guardianId);
          if (!guardian) return null;

          const isExpanded = expandedFamily === guardianId;
          const memberCount = familyMembers.length + 1; // +1 for guardian

          return (
            <Card key={guardianId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {guardian.name}
                        <Crown className="h-4 w-4 text-yellow-500" />
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {guardian.phone} • {guardian.smartId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {memberCount} members
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedFamily(isExpanded ? null : guardianId)}
                    >
                      {isExpanded ? 'Collapse' : 'View Family'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-indigo-500 pl-4">
                      <p className="text-sm font-medium text-muted-foreground mb-3">Family Members</p>
                      <div className="space-y-3">
                        {familyMembers.map((rel) => {
                          const member = students.find(s => 
                            s.id === (rel.guardianStudentId === guardianId ? rel.dependentStudentId : rel.guardianStudentId)
                          );
                          if (!member) return null;

                          return (
                            <div key={rel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {member.smartId} • {rel.relationship}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">{member.phone}</p>
                                <Badge variant="outline" className="mt-1">
                                  {member.status}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-900">
                        <strong>Guardian Contact:</strong> {guardian.phone}
                        {guardian.parentPhone && ` • Parent: ${guardian.parentPhone}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {Object.keys(familyGroups).length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No family relationships found</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Relationship
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
