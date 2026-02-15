'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { settlements, users } from '@/lib/mockData';
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function SettlementsPage() {
  const [settlementsData, setSettlementsData] = useState(settlements);
  const [selectedSettlement, setSelectedSettlement] = useState<typeof settlements[0] | null>(null);

  const flaggedCount = settlementsData.filter(s => s.status === 'flagged').length;
  const totalVariance = settlementsData.reduce((sum, s) => sum + Math.abs(s.variance), 0);

  const handleMarkReviewed = () => {
    if (selectedSettlement) {
      setSettlementsData(settlementsData.map(s => 
        s.id === selectedSettlement.id ? { ...s, status: 'reviewed' as const } : s
      ));
      toast.success('Settlement marked as reviewed');
      setSelectedSettlement(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Settlements</h1>
        <p className="text-muted-foreground">Anti-theft verification of cash deposits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Flagged Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${flaggedCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {flaggedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {flaggedCount > 0 ? 'Requires immediate attention' : 'All settlements balanced'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalVariance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Cumulative discrepancy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Last Settlement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(settlementsData[0].date), 'MMM dd')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {users.find(u => u.id === settlementsData[0].settledBy)?.name}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settlement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {settlementsData.slice(0, 30).map((settlement) => {
              const user = users.find(u => u.id === settlement.settledBy);
              return (
                <div 
                  key={settlement.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    settlement.variance < 0 ? 'bg-red-50 border-red-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {settlement.status === 'flagged' ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium">{format(new Date(settlement.date), 'MMMM dd, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">Settled by {user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">System</p>
                      <p className="font-semibold">₹{settlement.systemCalculated.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Actual</p>
                      <p className="font-semibold">₹{settlement.actualCash.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Variance</p>
                      <p className={`font-semibold ${settlement.variance < 0 ? 'text-red-600' : settlement.variance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {settlement.variance > 0 ? '+' : ''}₹{settlement.variance}
                      </p>
                    </div>
                    <Badge variant={settlement.status === 'flagged' ? 'destructive' : settlement.status === 'reviewed' ? 'secondary' : 'default'}>
                      {settlement.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSettlement(settlement)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSettlement} onOpenChange={() => setSelectedSettlement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Settlement Details</DialogTitle>
          </DialogHeader>
          {selectedSettlement && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{format(new Date(selectedSettlement.date), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Settled By</p>
                  <p className="font-semibold">{users.find(u => u.id === selectedSettlement.settledBy)?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Calculation</p>
                  <p className="font-semibold text-lg">₹{selectedSettlement.systemCalculated.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Actual Cash</p>
                  <p className="font-semibold text-lg">₹{selectedSettlement.actualCash.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Variance</p>
                  <p className={`font-semibold text-lg ${selectedSettlement.variance < 0 ? 'text-red-600' : selectedSettlement.variance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {selectedSettlement.variance > 0 ? '+' : ''}₹{selectedSettlement.variance}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedSettlement.status === 'flagged' ? 'destructive' : 'default'}>
                    {selectedSettlement.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Bank Deposit Slip</p>
                <div className="border rounded-lg p-8 bg-gray-50 text-center">
                  <p className="text-muted-foreground">Evidence: {selectedSettlement.evidenceUrl}</p>
                  <p className="text-xs text-muted-foreground mt-2">(Image placeholder)</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <Textarea defaultValue={selectedSettlement.notes} rows={3} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSettlement(null)}>Close</Button>
                {selectedSettlement.status === 'flagged' && (
                  <Button onClick={handleMarkReviewed}>Mark as Reviewed</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
