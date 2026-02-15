'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Users, Wallet, AlertTriangle, TrendingUp } from 'lucide-react';
import { payments, students, settlements, waitlist, dailyRevenue, staffPerformance, seats, auditLogs } from '@/lib/mockData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, isAfter } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  // Calculate KPIs
  const currentMonth = startOfMonth(new Date());
  const monthlyRevenue = payments
    .filter(p => p.status === 'paid' && isAfter(new Date(p.date), currentMonth))
    .reduce((sum, p) => sum + p.amount, 0);

  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalCapacity = 100;
  
  const latestSettlement = settlements.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  const flaggedSettlements = settlements.filter(s => s.status === 'flagged').length;

  const potentialRevenue = waitlist
    .filter(w => w.status === 'waiting')
    .reduce((sum, w) => sum + w.potentialRevenue, 0);

  const criticalAudits = auditLogs
    .filter(a => a.severity === 'critical' || a.severity === 'high')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  // Seat status counts
  const availableSeats = seats.filter(s => s.status === 'available').length;
  const occupiedSeats = seats.filter(s => s.status === 'occupied').length;
  const maintenanceSeats = seats.filter(s => s.status === 'maintenance').length;
  const expiringSeats = seats.filter(s => s.status === 'expiring').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor revenue, staff integrity, and operational efficiency
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push('/owner/finance/reports')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyRevenue.toLocaleString()}</div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600" 
                style={{ width: `${Math.min((monthlyRevenue / 150000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: ₹150,000 ({Math.round((monthlyRevenue / 150000) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeStudents} / {totalCapacity}
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600" 
                style={{ width: `${(activeStudents / totalCapacity) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((activeStudents / totalCapacity) * 100)}% capacity
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cash in Hand (Today)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{latestSettlement?.actualCash.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              System: ₹{latestSettlement?.systemCalculated.toLocaleString() || 0}
            </p>
            {latestSettlement?.variance !== 0 && (
              <Badge variant={latestSettlement.variance < 0 ? 'destructive' : 'secondary'} className="mt-2">
                {latestSettlement.variance > 0 ? '+' : ''}₹{latestSettlement.variance}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:shadow-md transition-shadow ${flaggedSettlements > 0 ? 'border-red-500 bg-red-50' : ''}`}
          onClick={() => router.push('/owner/finance/settlements')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Flagged Settlements</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${flaggedSettlements > 0 ? 'text-red-600' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${flaggedSettlements > 0 ? 'text-red-600' : ''}`}>
              {flaggedSettlements}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {flaggedSettlements > 0 ? 'Requires immediate attention' : 'All settlements balanced'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trend (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4f46e5" 
                  fill="#818cf8" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffPerformance.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={80}
                  fontSize={11}
                  tickFormatter={(name) => name.split(' ')[0]}
                />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Seat Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-1">
              {seats.slice(0, 100).map((seat) => (
                <div
                  key={seat.id}
                  className={`h-3 w-3 rounded-sm cursor-pointer ${
                    seat.status === 'available' ? 'bg-green-500' :
                    seat.status === 'occupied' ? 'bg-red-500' :
                    seat.status === 'maintenance' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`}
                  title={`${seat.label} - ${seat.status}`}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-sm" />
                <span>Available ({availableSeats})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-sm" />
                <span>Occupied ({occupiedSeats})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-orange-500 rounded-sm" />
                <span>Maintenance ({maintenanceSeats})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-yellow-500 rounded-sm" />
                <span>Expiring ({expiringSeats})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalAudits.map((audit) => (
                <div key={audit.id} className="border-l-2 border-red-500 pl-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{audit.action}</p>
                    <Badge variant={audit.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {audit.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(audit.timestamp), 'MMM dd, HH:mm')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push('/owner/members/waitlist')}
        >
          <CardHeader>
            <CardTitle>Waitlist Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 mb-4">
              ₹{potentialRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mb-4">Potential Revenue</p>
            <div className="space-y-2">
              {waitlist.filter(w => w.status === 'waiting').slice(0, 3).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-sm">
                  <span>{entry.name}</span>
                  <Badge variant="outline">{entry.preferredShift}</Badge>
                </div>
              ))}
            </div>
            <button className="text-sm text-indigo-600 hover:underline mt-3">
              View All →
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
