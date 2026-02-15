'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { branches } from '@/lib/mockData';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function BranchSettingsPage() {
  const branch = branches[0]; // Owner's branch
  const [settings, setSettings] = useState({
    morningStart: branch.defaultShiftMorning.start,
    morningEnd: branch.defaultShiftMorning.end,
    eveningStart: branch.defaultShiftEvening.start,
    eveningEnd: branch.defaultShiftEvening.end,
    hybridEnabled: false,
    securityDeposit: 500,
    lateFeePerDay: 50,
    gracePeriodDays: 5,
    lockerMonthlyFee: 200,
    absenteeAlertDays: 3,
    parentAlertAbsences: 3,
    renewalReminderDays: 7,
    ptpReminderSchedule: 'daily',
  });

  const [holidays, setHolidays] = useState([
    { id: 1, date: '2024-03-08', reason: 'Holi', recurring: true },
    { id: 2, date: '2024-08-15', reason: 'Independence Day', recurring: true },
    { id: 3, date: '2024-10-02', reason: 'Gandhi Jayanti', recurring: true },
  ]);

  const handleSave = () => {
    toast.success('Settings updated successfully');
  };

  const addHoliday = () => {
    const newHoliday = {
      id: holidays.length + 1,
      date: format(new Date(), 'yyyy-MM-dd'),
      reason: 'New Holiday',
      recurring: false,
    };
    setHolidays([...holidays, newHoliday]);
  };

  const removeHoliday = (id: number) => {
    setHolidays(holidays.filter(h => h.id !== id));
    toast.success('Holiday removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Branch Settings</h1>
        <p className="text-muted-foreground">
          Configure your branch operations and policies
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          <TabsTrigger value="fees">Fee Rules</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Branch Name</Label>
                  <Input value={branch.name} disabled />
                </div>
                <div>
                  <Label>City</Label>
                  <Input value={branch.city} disabled />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Input value={branch.address} disabled />
                </div>
                <div>
                  <Label>GST Number</Label>
                  <Input value={branch.gstNumber} disabled />
                </div>
                <div>
                  <Label>PAN Number</Label>
                  <Input value={branch.panNumber} disabled />
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <Input value={branch.contactNumber} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={branch.email} disabled />
                </div>
                <div>
                  <Label>Capacity</Label>
                  <Input value={branch.capacity} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Morning Shift Start</Label>
                  <Input 
                    type="time" 
                    value={settings.morningStart}
                    onChange={(e) => setSettings({...settings, morningStart: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Morning Shift End</Label>
                  <Input 
                    type="time" 
                    value={settings.morningEnd}
                    onChange={(e) => setSettings({...settings, morningEnd: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Evening Shift Start</Label>
                  <Input 
                    type="time" 
                    value={settings.eveningStart}
                    onChange={(e) => setSettings({...settings, eveningStart: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Evening Shift End</Label>
                  <Input 
                    type="time" 
                    value={settings.eveningEnd}
                    onChange={(e) => setSettings({...settings, eveningEnd: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Hybrid Scheduling</Label>
                  <p className="text-sm text-muted-foreground">Allow students to book custom time slots</p>
                </div>
                <Switch 
                  checked={settings.hybridEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, hybridEnabled: checked})}
                />
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Security Deposit (₹)</Label>
                  <Input 
                    type="number" 
                    value={settings.securityDeposit}
                    onChange={(e) => setSettings({...settings, securityDeposit: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Late Fee Per Day (₹)</Label>
                  <Input 
                    type="number" 
                    value={settings.lateFeePerDay}
                    onChange={(e) => setSettings({...settings, lateFeePerDay: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Grace Period (Days)</Label>
                  <Input 
                    type="number" 
                    value={settings.gracePeriodDays}
                    onChange={(e) => setSettings({...settings, gracePeriodDays: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Locker Monthly Fee (₹)</Label>
                  <Input 
                    type="number" 
                    value={settings.lockerMonthlyFee}
                    onChange={(e) => setSettings({...settings, lockerMonthlyFee: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Absentee Alert After (Days)</Label>
                  <Input 
                    type="number" 
                    value={settings.absenteeAlertDays}
                    onChange={(e) => setSettings({...settings, absenteeAlertDays: Number(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Holiday Calendar</CardTitle>
              <Button onClick={addHoliday} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Holiday
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <Input 
                        type="date" 
                        value={holiday.date}
                        onChange={(e) => {
                          const updated = holidays.map(h => 
                            h.id === holiday.id ? {...h, date: e.target.value} : h
                          );
                          setHolidays(updated);
                        }}
                      />
                      <Input 
                        value={holiday.reason}
                        onChange={(e) => {
                          const updated = holidays.map(h => 
                            h.id === holiday.id ? {...h, reason: e.target.value} : h
                          );
                          setHolidays(updated);
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={holiday.recurring}
                          onCheckedChange={(checked) => {
                            const updated = holidays.map(h => 
                              h.id === holiday.id ? {...h, recurring: checked} : h
                            );
                            setHolidays(updated);
                          }}
                        />
                        <Label className="text-sm">Recurring</Label>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeHoliday(holiday.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button onClick={handleSave} className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Parent Alert After X Absences</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={settings.parentAlertAbsences}
                    onChange={(e) => setSettings({...settings, parentAlertAbsences: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Renewal Reminder (Days Before Expiry)</Label>
                  <Input 
                    type="number" 
                    value={settings.renewalReminderDays}
                    onChange={(e) => setSettings({...settings, renewalReminderDays: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>PTP Reminder Schedule</Label>
                  <select 
                    className="w-full border rounded-md p-2"
                    value={settings.ptpReminderSchedule}
                    onChange={(e) => setSettings({...settings, ptpReminderSchedule: e.target.value})}
                  >
                    <option value="daily">Daily</option>
                    <option value="every_3_days">Every 3 Days</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
