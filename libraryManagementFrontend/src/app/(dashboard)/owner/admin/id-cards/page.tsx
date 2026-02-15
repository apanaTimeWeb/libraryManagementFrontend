'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { students } from '@/lib/mockData';
import { Download, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function IDCardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.smartId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = () => {
    toast.success('ID Card generated successfully');
  };

  const handleBulkGenerate = () => {
    toast.success(`Generating ${selectedStudents.length} ID cards...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ID Card Generator</h1>
        <p className="text-muted-foreground">Generate student ID cards</p>
      </div>

      <Tabs defaultValue="single" className="space-y-4">
        <TabsList>
          <TabsTrigger value="single">Single Card</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Search by name or Smart ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredStudents.slice(0, 10).map((student) => (
                    <div 
                      key={student.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.smartId}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle>ID Card Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-indigo-600 rounded-lg p-6 max-w-md mx-auto bg-gradient-to-br from-indigo-50 to-white">
                  <div className="text-center space-y-4">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-3xl font-bold text-indigo-600">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-xl">{selectedStudent.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedStudent.smartId}</p>
                      <p className="text-sm text-muted-foreground">{selectedStudent.college}</p>
                    </div>
                    <div className="border-t pt-4">
                      <div className="h-20 w-20 bg-gray-200 mx-auto rounded flex items-center justify-center text-xs">
                        QR Code
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button onClick={handleGenerate}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.slice(0, 20).map((student) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input 
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.smartId}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">{selectedStudents.length} students selected</p>
                <Button onClick={handleBulkGenerate} disabled={selectedStudents.length === 0}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Generate All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
