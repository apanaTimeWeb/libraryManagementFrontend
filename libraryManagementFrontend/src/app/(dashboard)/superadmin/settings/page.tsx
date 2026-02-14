'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const generalSettingsSchema = z.object({
  siteName: z.string().min(2, 'Site name must be at least 2 characters'),
  siteDescription: z.string().optional(),
  supportEmail: z.string().email('Invalid email address'),
  supportPhone: z.string(),
  timezone: z.string(),
  dateFormat: z.string(),
  currency: z.string(),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  paymentReminders: z.boolean(),
  expiryAlerts: z.boolean(),
  reminderDays: z.number().min(1).max(30),
});

const securitySettingsSchema = z.object({
  sessionTimeout: z.number().min(5).max(1440),
  passwordMinLength: z.number().min(6).max(32),
  requireTwoFactor: z.boolean(),
  allowMultipleSessions: z.boolean(),
  ipWhitelist: z.string().optional(),
});

const paymentSettingsSchema = z.object({
  enableUPI: z.boolean(),
  enableCard: z.boolean(),
  enableCash: z.boolean(),
  enableBankTransfer: z.boolean(),
  lateFeePercentage: z.number().min(0).max(100),
  gracePeriodDays: z.number().min(0).max(30),
});

export default function SettingsPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: 'Smart Library Management',
      siteDescription: 'Comprehensive library management system',
      supportEmail: 'support@smartlibrary.com',
      supportPhone: '+919876543210',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR',
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      paymentReminders: true,
      expiryAlerts: true,
      reminderDays: 3,
    },
  });

  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      sessionTimeout: 60,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowMultipleSessions: true,
      ipWhitelist: '',
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentSettingsSchema>>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      enableUPI: true,
      enableCard: true,
      enableCash: true,
      enableBankTransfer: true,
      lateFeePercentage: 5,
      gracePeriodDays: 3,
    },
  });

  const onSubmitGeneral = async (values: z.infer<typeof generalSettingsSchema>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('General settings saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const onSubmitNotifications = async (values: z.infer<typeof notificationSettingsSchema>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification settings saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const onSubmitSecurity = async (values: z.infer<typeof securitySettingsSchema>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Security settings saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const onSubmitPayment = async (values: z.infer<typeof paymentSettingsSchema>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Payment settings saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className=\"space-y-6\">
      <div>
        <h1 className=\"text-3xl font-bold tracking-tight\">Settings</h1>
        <p className=\"text-muted-foreground\">Manage your system preferences and configurations</p>
      </div>

      {hasUnsavedChanges && (
        <Alert>
          <AlertTriangle className=\"h-4 w-4\" />
          <AlertDescription>
            You have unsaved changes. Make sure to save before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className=\"space-y-4\">
        <TabsList className=\"grid w-full grid-cols-2 lg:grid-cols-4\">
          <TabsTrigger value=\"general\">General</TabsTrigger>
          <TabsTrigger value=\"notifications\">Notifications</TabsTrigger>
          <TabsTrigger value=\"security\">Security</TabsTrigger>
          <TabsTrigger value=\"payment\">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value=\"general\">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className=\"space-y-6\">
                  <FormField
                    control={generalForm.control}
                    name=\"siteName\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={(e) => { field.onChange(e); setHasUnsavedChanges(true); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name=\"siteDescription\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} onChange={(e) => { field.onChange(e); setHasUnsavedChanges(true); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className=\"grid grid-cols-2 gap-4\">
                    <FormField
                      control={generalForm.control}
                      name=\"supportEmail\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Email</FormLabel>
                          <FormControl>
                            <Input type=\"email\" {...field} onChange={(e) => { field.onChange(e); setHasUnsavedChanges(true); }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name=\"supportPhone\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Phone</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => { field.onChange(e); setHasUnsavedChanges(true); }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=\"grid grid-cols-3 gap-4\">
                    <FormField
                      control={generalForm.control}
                      name=\"timezone\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select value={field.value} onValueChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=\"Asia/Kolkata\">Asia/Kolkata (IST)</SelectItem>
                              <SelectItem value=\"America/New_York\">America/New_York (EST)</SelectItem>
                              <SelectItem value=\"Europe/London\">Europe/London (GMT)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name=\"dateFormat\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Format</FormLabel>
                          <Select value={field.value} onValueChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=\"DD/MM/YYYY\">DD/MM/YYYY</SelectItem>
                              <SelectItem value=\"MM/DD/YYYY\">MM/DD/YYYY</SelectItem>
                              <SelectItem value=\"YYYY-MM-DD\">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name=\"currency\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select value={field.value} onValueChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=\"INR\">INR (₹)</SelectItem>
                              <SelectItem value=\"USD\">USD ($)</SelectItem>
                              <SelectItem value=\"EUR\">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type=\"submit\">
                    <Save className=\"mr-2 h-4 w-4\" /> Save General Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value=\"notifications\">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className=\"space-y-6\">
                  <div className=\"space-y-4\">
                    <FormField
                      control={notificationForm.control}
                      name=\"emailNotifications\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">Email Notifications</FormLabel>
                            <FormDescription>Receive notifications via email</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name=\"smsNotifications\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">SMS Notifications</FormLabel>
                            <FormDescription>Receive notifications via SMS</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name=\"pushNotifications\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">Push Notifications</FormLabel>
                            <FormDescription>Receive browser push notifications</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name=\"paymentReminders\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">Payment Reminders</FormLabel>
                            <FormDescription>Send payment reminders to students</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name=\"expiryAlerts\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">Expiry Alerts</FormLabel>
                            <FormDescription>Alert when subscriptions are expiring</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={notificationForm.control}
                    name=\"reminderDays\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reminder Days Before Expiry</FormLabel>
                        <FormControl>
                          <Input 
                            type=\"number\" 
                            {...field} 
                            onChange={(e) => { field.onChange(parseInt(e.target.value)); setHasUnsavedChanges(true); }} 
                          />
                        </FormControl>
                        <FormDescription>Number of days before expiry to send reminders</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type=\"submit\">
                    <Save className=\"mr-2 h-4 w-4\" /> Save Notification Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value=\"security\">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access control</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className=\"space-y-6\">
                  <FormField
                    control={securityForm.control}
                    name=\"sessionTimeout\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type=\"number\" 
                            {...field} 
                            onChange={(e) => { field.onChange(parseInt(e.target.value)); setHasUnsavedChanges(true); }} 
                          />
                        </FormControl>
                        <FormDescription>Auto logout after inactivity</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name=\"passwordMinLength\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Password Length</FormLabel>
                        <FormControl>
                          <Input 
                            type=\"number\" 
                            {...field} 
                            onChange={(e) => { field.onChange(parseInt(e.target.value)); setHasUnsavedChanges(true); }} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name=\"requireTwoFactor\"
                    render={({ field }) => (
                      <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                        <div className=\"space-y-0.5\">
                          <FormLabel className=\"text-base\">Require Two-Factor Authentication</FormLabel>
                          <FormDescription>Enforce 2FA for all users</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name=\"allowMultipleSessions\"
                    render={({ field }) => (
                      <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                        <div className=\"space-y-0.5\">
                          <FormLabel className=\"text-base\">Allow Multiple Sessions</FormLabel>
                          <FormDescription>Users can login from multiple devices</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name=\"ipWhitelist\"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IP Whitelist (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder=\"Enter IP addresses, one per line\" 
                            {...field} 
                            onChange={(e) => { field.onChange(e); setHasUnsavedChanges(true); }} 
                          />
                        </FormControl>
                        <FormDescription>Restrict access to specific IP addresses</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type=\"submit\">
                    <Save className=\"mr-2 h-4 w-4\" /> Save Security Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value=\"payment\">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)} className=\"space-y-6\">
                  <div className=\"space-y-4\">
                    <h3 className=\"text-lg font-medium\">Payment Methods</h3>
                    <FormField
                      control={paymentForm.control}
                      name=\"enableUPI\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">UPI Payments</FormLabel>
                            <FormDescription>Accept payments via UPI</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paymentForm.control}
                      name=\"enableCard\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">Card Payments</FormLabel>
                            <FormDescription>Accept credit/debit card payments</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paymentForm.control}
                      name=\"enableCash\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">Cash Payments</FormLabel>
                            <FormDescription>Accept cash payments</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paymentForm.control}
                      name=\"enableBankTransfer\"
                      render={({ field }) => (
                        <FormItem className=\"flex items-center justify-between rounded-lg border p-4\">
                          <div className=\"space-y-0.5\">
                            <FormLabel className=\"text-base\">Bank Transfer</FormLabel>
                            <FormDescription>Accept bank transfer payments</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={(v) => { field.onChange(v); setHasUnsavedChanges(true); }} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=\"space-y-4\">
                    <h3 className=\"text-lg font-medium\">Payment Policies</h3>
                    <FormField
                      control={paymentForm.control}
                      name=\"lateFeePercentage\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Late Fee Percentage</FormLabel>
                          <FormControl>
                            <Input 
                              type=\"number\" 
                              {...field} 
                              onChange={(e) => { field.onChange(parseFloat(e.target.value)); setHasUnsavedChanges(true); }} 
                            />
                          </FormControl>
                          <FormDescription>Percentage charged for late payments</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={paymentForm.control}
                      name=\"gracePeriodDays\"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grace Period (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type=\"number\" 
                              {...field} 
                              onChange={(e) => { field.onChange(parseInt(e.target.value)); setHasUnsavedChanges(true); }} 
                            />
                          </FormControl>
                          <FormDescription>Days before late fee is applied</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type=\"submit\">
                    <Save className=\"mr-2 h-4 w-4\" /> Save Payment Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
