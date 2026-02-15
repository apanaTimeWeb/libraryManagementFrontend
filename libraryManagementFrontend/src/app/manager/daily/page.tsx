'use client';

import { useState } from 'react';
import { ManagerLayout } from '@/components/layout/manager-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockLockers, mockComplaints, mockExpenses, mockAssets } from '@/lib/opsData';
import { useRoleStore } from '@/lib/stores/role-store';
import { Plus, Lock, AlertCircle, DollarSign, Package, Calculator } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function DailyOpsPage() {
  const { isManager } = useRoleStore();
  const [activeTab, setActiveTab] = useState('lockers');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEOD, setShowEOD] = useState(false);

  // EOD State
  const [actualCash, setActualCash] = useState('');
  const expectedCash = 5000;
  const variance = actualCash ? Number(actualCash) - expectedCash : 0;

  const handleEODSubmit = () => {
    toast.success('EOD Settlement submitted successfully');
    setShowEOD(false);
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Operations</h1>
          <p className="text-sm text-slate-500">Manage lockers, complaints, expenses, and assets</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="lockers">
              <Lock className="h-4 w-4 mr-2" />
              Lockers
            </TabsTrigger>
            <TabsTrigger value="complaints">
              <AlertCircle className="h-4 w-4 mr-2" />
              Complaints
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <DollarSign className="h-4 w-4 mr-2" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="assets">
              <Package className="h-4 w-4 mr-2" />
              Assets
            </TabsTrigger>
            {isManager() && (
              <TabsTrigger value="eod">
                <Calculator className="h-4 w-4 mr-2" />
                EOD
              </TabsTrigger>
            )}
          </TabsList>

          {/* Lockers Tab */}
          <TabsContent value="lockers">
            <Card>
              <CardHeader>
                <CardTitle>Locker Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-3">
                  {mockLockers.map(locker => (
                    <Button
                      key={locker.id}
                      variant="outline"
                      className={`h-20 flex flex-col items-center justify-center ${
                        locker.status === 'occupied' ? 'bg-red-50 border-red-300' :
                        locker.status === 'available' ? 'bg-green-50 border-green-300' :
                        'bg-orange-50 border-orange-300'
                      }`}
                      onClick={() => locker.status === 'available' && toast.success('Assign locker modal would open')}
                    >
                      <Lock className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">{locker.number}</span>
                      {locker.occupantName && (
                        <span className="text-xs text-slate-500 truncate w-full text-center">
                          {locker.occupantName.split(' ')[0]}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-green-500 rounded" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-red-500 rounded" />
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-orange-500 rounded" />
                    <span>Maintenance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Complaints</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Complaint
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="open">
                  <TabsList>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                  </TabsList>
                  <TabsContent value="open">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Number</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Days Open</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockComplaints.filter(c => c.status !== 'resolved').map(complaint => (
                          <TableRow key={complaint.id}>
                            <TableCell className="font-medium">{complaint.number}</TableCell>
                            <TableCell>{complaint.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{complaint.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={complaint.priority === 'high' ? 'destructive' : 'secondary'}>
                                {complaint.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{complaint.isAnonymous ? 'Anonymous' : complaint.studentName}</TableCell>
                            <TableCell>{complaint.daysOpen} days</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {!isManager() ? (
                                  <Button size="sm" variant="outline">Escalate</Button>
                                ) : (
                                  <>
                                    <Button size="sm" variant="outline">In Progress</Button>
                                    <Button size="sm">Resolve</Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="resolved">
                    <p className="text-center text-slate-500 py-8">No resolved complaints</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Expenses</CardTitle>
                  <Button size="sm" onClick={() => setShowAddExpense(!showAddExpense)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddExpense && (
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Category</Label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Maintenance</option>
                          <option>Utilities</option>
                          <option>Stationery</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div>
                        <Label>Vendor</Label>
                        <Input placeholder="Vendor name" />
                      </div>
                      <div>
                        <Label>Payment Mode</Label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Cash</option>
                          <option>Bank</option>
                          <option>UPI</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea placeholder="Expense details..." rows={2} />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => {
                        toast.success('Expense added');
                        setShowAddExpense(false);
                      }}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddExpense(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExpenses.map(expense => (
                      <TableRow key={expense.id}>
                        <TableCell>{format(new Date(expense.date), 'MMM dd')}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="font-medium">₹{expense.amount}</TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.paymentMode}</Badge>
                        </TableCell>
                        <TableCell>
                          {isManager() && (
                            <Button size="sm" variant="ghost">Delete</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle>Asset Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Maintenance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssets.map(asset => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.category}</TableCell>
                        <TableCell>
                          <Badge variant={asset.status === 'operational' ? 'default' : 'destructive'}>
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(asset.nextMaintenance), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          {isManager() ? (
                            <Button size="sm" variant="outline">Log Maintenance</Button>
                          ) : (
                            <Button size="sm" variant="outline">Request</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EOD Settlement Tab (Manager Only) */}
          {isManager() && (
            <TabsContent value="eod">
              <Card>
                <CardHeader>
                  <CardTitle>End of Day Settlement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Expected Cash</p>
                      <p className="text-2xl font-bold">₹{expectedCash}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Cash Expenses</p>
                      <p className="text-2xl font-bold">₹650</p>
                    </div>
                  </div>
                  <div>
                    <Label>Actual Cash in Hand</Label>
                    <Input
                      type="number"
                      value={actualCash}
                      onChange={(e) => setActualCash(e.target.value)}
                      placeholder="Enter actual cash amount"
                    />
                  </div>
                  {actualCash && (
                    <div className={`p-4 rounded-lg ${variance === 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="text-sm">Variance</p>
                      <p className={`text-2xl font-bold ${variance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{variance}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label>Notes</Label>
                    <Textarea placeholder="Any remarks..." rows={3} />
                  </div>
                  <Button onClick={handleEODSubmit} className="w-full">
                    Submit Settlement
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ManagerLayout>
  );
}
