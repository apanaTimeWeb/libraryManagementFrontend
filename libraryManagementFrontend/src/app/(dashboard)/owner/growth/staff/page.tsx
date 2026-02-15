'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { staffPerformanceDetails } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function StaffPerformancePage() {
  const topPerformers = [...staffPerformanceDetails].sort((a, b) => b.revenueCollected - a.revenueCollected).slice(0, 5);
  const lowPerformers = [...staffPerformanceDetails].sort((a, b) => b.missedFollowups - a.missedFollowups).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Performance</h1>
        <p className="text-muted-foreground">Monitor staff productivity and identify performance gaps</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((staff, idx) => (
                <div key={staff.userId} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{staff.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{staff.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{staff.revenueCollected.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{staff.conversions} conversions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowPerformers.map((staff, idx) => (
                <div key={staff.userId} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                  <div>
                    <p className="font-semibold">{staff.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{staff.role}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{staff.missedFollowups} Missed Follow-ups</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{staff.conversionRate}% conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Staff Member</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staffPerformanceDetails}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={11}
              />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenueCollected" fill="#4f46e5" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Staff Name</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-right p-3">Leads Assigned</th>
                  <th className="text-right p-3">Calls Made</th>
                  <th className="text-right p-3">Missed Follow-ups</th>
                  <th className="text-right p-3">Conversions</th>
                  <th className="text-right p-3">Revenue</th>
                  <th className="text-right p-3">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformanceDetails.map((staff) => (
                  <tr 
                    key={staff.userId} 
                    className={`border-b hover:bg-gray-50 ${staff.missedFollowups > 5 ? 'bg-red-50' : ''}`}
                  >
                    <td className="p-3 font-medium">{staff.name}</td>
                    <td className="p-3 capitalize text-muted-foreground">{staff.role}</td>
                    <td className="p-3 text-right">{staff.leadsAssigned}</td>
                    <td className="p-3 text-right">{staff.callsMade}</td>
                    <td className="p-3 text-right">
                      <span className={staff.missedFollowups > 5 ? 'text-red-600 font-semibold' : ''}>
                        {staff.missedFollowups}
                      </span>
                    </td>
                    <td className="p-3 text-right">{staff.conversions}</td>
                    <td className="p-3 text-right font-semibold">₹{staff.revenueCollected.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <Badge variant={staff.conversionRate > 20 ? 'default' : staff.conversionRate > 10 ? 'secondary' : 'outline'}>
                        {staff.conversionRate}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
