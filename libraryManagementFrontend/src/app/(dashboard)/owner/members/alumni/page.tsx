'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { alumni, students, getBranchById } from '@/lib/mockData';
import { format } from 'date-fns';
import { GraduationCap, Search, UserPlus, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function AlumniPage() {
  const [alumniList] = useState(alumni);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);

  const filteredAlumni = alumniList.filter(a => {
    const student = students.find(s => s.id === a.studentId);
    return student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           student?.smartId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleReadmit = (alumniEntry: any) => {
    toast.success('Re-admission process initiated. Manager will assign seat.');
    setSelectedAlumni(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumni</h1>
          <p className="text-muted-foreground">Former students who have exited the library</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or Smart ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredAlumni.length} Alumni
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredAlumni.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No alumni found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlumni.map((alumniEntry) => {
            const student = students.find(s => s.id === alumniEntry.studentId);
            const branch = getBranchById(alumniEntry.branchId);
            
            if (!student) return null;

            return (
              <Card key={alumniEntry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <Badge variant="outline">{student.smartId}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Exited on {format(new Date(alumniEntry.exitDate), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{branch?.name || 'Unknown Branch'}</span>
                          </div>
                          <p className="mt-2">
                            <span className="font-medium">Reason:</span> {alumniEntry.reason}
                          </p>
                          {alumniEntry.forwardAddress && (
                            <p>
                              <span className="font-medium">Forward Address:</span> {alumniEntry.forwardAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAlumni(alumniEntry)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Re-admit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {selectedAlumni && (
        <Dialog open={!!selectedAlumni} onOpenChange={() => setSelectedAlumni(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Re-admit Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {(() => {
                const student = students.find(s => s.id === selectedAlumni.studentId);
                return (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Student Name</p>
                      <p className="font-medium">{student?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Smart ID</p>
                      <p className="font-medium">{student?.smartId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Previous Exit Date</p>
                      <p className="font-medium">{format(new Date(selectedAlumni.exitDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Exit Reason</p>
                      <p className="font-medium">{selectedAlumni.reason}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-900">
                        Note: As an Owner, you can initiate re-admission. The Manager will need to assign a seat and complete the admission process.
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedAlumni(null)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleReadmit(selectedAlumni)}>
                        Initiate Re-admission
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
