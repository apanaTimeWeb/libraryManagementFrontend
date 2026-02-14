'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Settings, Shield, CreditCard, Mail, Database, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

export default function SuperAdminSettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        console.log('Saving settings...');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SuperAdmin Settings</h1>
                    <p className="text-muted-foreground">
                        Configure system-wide settings, security policies, and integrations.
                    </p>
                </div>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save All Changes
                </Button>
            </div>

            {saved && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        Settings saved successfully!
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="general" className="text-xs sm:text-sm">
                        <Settings className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">General</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="text-xs sm:text-sm">
                        <Shield className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="text-xs sm:text-sm">
                        <CreditCard className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Billing</span>
                    </TabsTrigger>
                    <TabsTrigger value="communication" className="text-xs sm:text-sm">
                        <Mail className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Comm</span>
                    </TabsTrigger>
                    <TabsTrigger value="backup" className="text-xs sm:text-sm">
                        <Database className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Backup</span>
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="text-xs sm:text-sm">
                        <Zap className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Advanced</span>
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Information</CardTitle>
                            <CardDescription>Configure basic system settings and branding</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="systemName">System Name</Label>
                                    <Input id="systemName" defaultValue="Smart Library 360" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <Select defaultValue="INR">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                                            <SelectItem value="EUR">Euro (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dateFormat">Date Format</Label>
                                    <Select defaultValue="DD/MM/YYYY">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select defaultValue="Asia/Kolkata">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input id="supportEmail" type="email" defaultValue="support@smartlibrary.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="supportPhone">Support Phone</Label>
                                <Input id="supportPhone" defaultValue="+91 1234567890" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security & Access */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password Policy</CardTitle>
                            <CardDescription>Configure password requirements for all users</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="minLength">Minimum Length</Label>
                                    <Input id="minLength" type="number" defaultValue="8" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxAge">Password Max Age (days)</Label>
                                    <Input id="maxAge" type="number" defaultValue="90" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                                <Switch id="requireUppercase" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="requireNumbers">Require Numbers</Label>
                                <Switch id="requireNumbers" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="requireSpecial">Require Special Characters</Label>
                                <Switch id="requireSpecial" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Session Management</CardTitle>
                            <CardDescription>Configure user session timeouts and policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                    <Input id="sessionTimeout" type="number" defaultValue="30" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxSessions">Max Concurrent Sessions</Label>
                                    <Input id="maxSessions" type="number" defaultValue="3" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                                <Switch id="twoFactor" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>IP Whitelist</CardTitle>
                            <CardDescription>Restrict SuperAdmin access to specific IP addresses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Enter IP addresses (one per line)&#10;192.168.1.1&#10;203.0.113.0/24"
                                rows={5}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing & Subscription */}
                <TabsContent value="billing" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Gateway Configuration</CardTitle>
                            <CardDescription>Configure payment gateways for online transactions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h4 className="font-semibold">Razorpay</h4>
                                    <p className="text-sm text-muted-foreground">UPI, Cards, NetBanking</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h4 className="font-semibold">PayU</h4>
                                    <p className="text-sm text-muted-foreground">Alternative payment gateway</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="razorpayKey">Razorpay API Key</Label>
                                    <Input id="razorpayKey" type="password" placeholder="rzp_live_..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
                                    <Input id="razorpaySecret" type="password" placeholder="***" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Settings</CardTitle>
                            <CardDescription>Configure invoicing preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                                <Input id="invoicePrefix" defaultValue="SL-INV-" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                                <Input id="taxRate" type="number" defaultValue="18" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="autoSendInvoice">Auto-send Invoice Email</Label>
                                <Switch id="autoSendInvoice" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Communication */}
                <TabsContent value="communication" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Configuration</CardTitle>
                            <CardDescription>SMTP settings for sending emails</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpHost">SMTP Host</Label>
                                    <Input id="smtpHost" defaultValue="smtp.gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">SMTP Port</Label>
                                    <Input id="smtpPort" type="number" defaultValue="587" />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpUser">SMTP Username</Label>
                                    <Input id="smtpUser" defaultValue="noreply@smartlibrary.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPass">SMTP Password</Label>
                                    <Input id="smtpPass" type="password" />
                                </div>
                            </div>
                            <Button variant="outline">Test Email Configuration</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SMS Configuration</CardTitle>
                            <CardDescription>Configure SMS provider for notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="smsProvider">SMS Provider</Label>
                                <Select defaultValue="twilio">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="twilio">Twilio</SelectItem>
                                        <SelectItem value="msg91">MSG91</SelectItem>
                                        <SelectItem value="aws">AWS SNS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="smsApiKey">API Key</Label>
                                    <Input id="smsApiKey" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smsSenderID">Sender ID</Label>
                                    <Input id="smsSenderID" defaultValue="SMRTLIB" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>WhatsApp Business API</CardTitle>
                            <CardDescription>Enable WhatsApp notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="enableWhatsApp">Enable WhatsApp Notifications</Label>
                                <Switch id="enableWhatsApp" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsappToken">Business API Access Token</Label>
                                <Input id="whatsappToken" type="password" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Backup & Maintenance */}
                <TabsContent value="backup" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Automated Backups</CardTitle>
                            <CardDescription>Schedule automatic database backups</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="autoBackup">Enable Automated Backups</Label>
                                <Switch id="autoBackup" defaultChecked />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                                <Select defaultValue="daily">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hourly">Every Hour</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="backupTime">Backup Time (24h format)</Label>
                                <Input id="backupTime" type="time" defaultValue="02:00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="retentionDays">Retention Period (days)</Label>
                                <Input id="retentionDays" type="number" defaultValue="30" />
                            </div>
                            <Button>Trigger Manual Backup Now</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Mode</CardTitle>
                            <CardDescription>Schedule or enable maintenance mode</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
                                <Switch id="maintenanceMode" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                                <Textarea
                                    id="maintenanceMessage"
                                    defaultValue="System is under maintenance. We'll be back shortly!"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Features */}
                <TabsContent value="advanced" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Experimental Features</CardTitle>
                            <CardDescription>Enable beta features and experimental functionality</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="aiPredictions">AI-Powered Predictions</Label>
                                    <p className="text-sm text-muted-foreground">Revenue forecasting and occupancy predictions</p>
                                </div>
                                <Switch id="aiPredictions" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="smartRecommendations">Smart Recommendations</Label>
                                    <p className="text-sm text-muted-foreground">Seat and plan recommendations for students</p>
                                </div>
                                <Switch id="smartRecommendations" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="biometricAuth">Biometric Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Fingerprint and face recognition for attendance</p>
                                </div>
                                <Switch id="biometricAuth" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="mobileApp">Mobile App Integration</Label>
                                    <p className="text-sm text-muted-foreground">Enable mobile app features</p>
                                </div>
                                <Switch id="mobileApp" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>API & Webhooks</CardTitle>
                            <CardDescription>Configure external API access and webhooks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="apiKey">System API Key</Label>
                                <div className="flex gap-2">
                                    <Input id="apiKey" type="password" defaultValue="sk_live_..." readOnly />
                                    <Button variant="outline">Regenerate</Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="webhookURL">Webhook URL</Label>
                                <Input id="webhookURL" placeholder="https://your-app.com/webhook" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
