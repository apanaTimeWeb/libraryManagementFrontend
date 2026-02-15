'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { marketingSources } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, Target, Users } from 'lucide-react';

export default function MarketingROIPage() {
  const totalLeads = marketingSources.reduce((sum, s) => sum + s.leads, 0);
  const totalConversions = marketingSources.reduce((sum, s) => sum + s.conversions, 0);
  const totalCost = marketingSources.reduce((sum, s) => sum + s.cost, 0);
  const totalRevenue = marketingSources.reduce((sum, s) => sum + s.revenue, 0);
  const overallROI = ((totalRevenue - totalCost) / totalCost) * 100;

  const sourcesWithMetrics = marketingSources.map(source => ({
    ...source,
    conversionRate: Math.round((source.conversions / source.leads) * 100),
    costPerAcquisition: source.cost > 0 ? Math.round(source.cost / source.conversions) : 0,
    roi: source.cost > 0 ? Math.round(((source.revenue - source.cost) / source.cost) * 100) : Infinity,
  }));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const pieData = marketingSources.map(s => ({
    name: s.name,
    value: s.conversions,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketing ROI</h1>
        <p className="text-muted-foreground">Analyze marketing performance and optimize ad spend</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalConversions} conversions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Marketing budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From marketing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overall ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overallROI > 100 ? 'text-green-600' : 'text-red-600'}`}>
              {overallROI.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Return on investment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Per Acquisition by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourcesWithMetrics.filter(s => s.cost > 0)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value: number) => `₹${value}`} />
                <Bar dataKey="costPerAcquisition" fill="#4f46e5" name="Cost per Student" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Source Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Source</th>
                  <th className="text-right p-3">Leads</th>
                  <th className="text-right p-3">Conversions</th>
                  <th className="text-right p-3">Conv. Rate</th>
                  <th className="text-right p-3">Cost</th>
                  <th className="text-right p-3">Revenue</th>
                  <th className="text-right p-3">CPA</th>
                  <th className="text-right p-3">ROI</th>
                  <th className="text-left p-3">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {sourcesWithMetrics.map((source) => {
                  const isGoodROI = source.roi > 200 || source.roi === Infinity;
                  const isGoodConversion = source.conversionRate > 30;
                  
                  return (
                    <tr key={source.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{source.name}</td>
                      <td className="p-3 text-right">{source.leads}</td>
                      <td className="p-3 text-right">{source.conversions}</td>
                      <td className="p-3 text-right">
                        <Badge variant={isGoodConversion ? 'default' : 'secondary'}>
                          {source.conversionRate}%
                        </Badge>
                      </td>
                      <td className="p-3 text-right">₹{source.cost.toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold">₹{source.revenue.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        {source.costPerAcquisition > 0 ? `₹${source.costPerAcquisition}` : 'Free'}
                      </td>
                      <td className="p-3 text-right">
                        <Badge variant={isGoodROI ? 'default' : 'destructive'}>
                          {source.roi === Infinity ? '∞' : `${source.roi}%`}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {isGoodROI && isGoodConversion ? (
                          <Badge className="bg-green-600">Increase Budget</Badge>
                        ) : isGoodROI ? (
                          <Badge variant="secondary">Maintain</Badge>
                        ) : (
                          <Badge variant="destructive">Reduce/Stop</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900">💡 Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-indigo-800">
            <strong>Best Performer:</strong> {sourcesWithMetrics.sort((a, b) => b.roi - a.roi)[0].name} with {sourcesWithMetrics.sort((a, b) => b.roi - a.roi)[0].roi === Infinity ? 'infinite' : sourcesWithMetrics.sort((a, b) => b.roi - a.roi)[0].roi + '%'} ROI
          </p>
          <p className="text-indigo-800">
            <strong>Highest Conversion:</strong> {sourcesWithMetrics.sort((a, b) => b.conversionRate - a.conversionRate)[0].name} at {sourcesWithMetrics.sort((a, b) => b.conversionRate - a.conversionRate)[0].conversionRate}%
          </p>
          <p className="text-indigo-800">
            <strong>Most Cost-Effective:</strong> Walk-in and Referrals have zero acquisition cost - focus on improving these channels
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
