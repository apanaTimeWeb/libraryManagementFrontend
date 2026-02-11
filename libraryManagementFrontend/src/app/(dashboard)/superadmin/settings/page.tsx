'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground">
                    Manage global configurations, security policies, and system preferences.
                </p>
            </div>

            <Tabs defaultValue="global" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="global">Global</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="communication">Communication</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="global" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Configuration</CardTitle>
                            <CardDescription>
                                Basic system information and localization settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="systemName">System Name</Label>
                                <Input id="systemName" defaultValue="Smart Library 360" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select defaultValue="inr">
                                        <SelectTrigger id="currency">
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inr">INR (₹)</SelectItem>
                                            <SelectItem value="usd">USD ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="timezone">Time Zone</Label>
                                    <Select defaultValue="ist">
                                        <SelectTrigger id="timezone">
                                            <SelectValue placeholder="Select Time Zone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ist">IST (Asia/Kolkata)</SelectItem>
                                            <SelectItem value="utc">UTC</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password Policy</CardTitle>
                            <CardDescription>
                                Define password requirements for all users.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Require Uppercase</Label>
                                    <p className="text-sm text-muted-foreground">Passwords must contain at least one uppercase letter.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Require Special Characters</Label>
                                    <p className="text-sm text-muted-foreground">Passwords must contain at least one special character.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Other tabs would be implemented similarly based on the prompt */}
            </Tabs>
        </div>
    );
}
