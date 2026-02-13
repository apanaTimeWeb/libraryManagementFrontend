'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { branches } from '@/lib/mockData';
import { Role } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserStore } from '@/lib/stores/user-store';
import { toast } from 'sonner';

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const { createUser, fetchUsers } = useUserStore();
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: 'Test User',
        phone: '+919876543210',
        email: 'testuser@smartlibrary.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        role: 'staff' as Role | '',
        permissions: ['attendance', 'basic_ops', 'view_students'] as string[],
        branchId: branches.length > 0 ? branches[0].id : '',
        sendWelcomeEmail: true,
        requirePasswordReset: true,
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePermissionToggle = (permission: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const handleSubmit = async () => {
        try {
            await createUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role as Role,
                permissions: formData.permissions,
                isActive: true,
                branchId: formData.role === 'superadmin' ? null : formData.branchId || null,
            });
            
            setSuccess(true);
            toast.success('User created successfully!');
            
            setTimeout(async () => {
                setSuccess(false);
                onOpenChange(false);
                setStep(1);
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: '',
                    permissions: [],
                    branchId: '',
                    sendWelcomeEmail: true,
                    requirePasswordReset: true,
                });
                await fetchUsers();
            }, 1500);
        } catch (error) {
            toast.error('Failed to create user', {
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    const rolePermissions = {
        superadmin: ['all', 'system_settings', 'user_management', 'branch_management'],
        owner: ['branch_full', 'create_managers', 'view_financials', 'modify_settings'],
        manager: ['manage_students', 'collect_fees', 'view_reports', 'manage_attendance'],
        staff: ['attendance', 'basic_ops', 'view_students'],
    };

    const availablePermissions = formData.role ? rolePermissions[formData.role as keyof typeof rolePermissions] : [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the system. Step {step} of 4
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            User created successfully! Welcome email sent.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {step === 1 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Step 1: Basic Information</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            placeholder="+919876543210"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            placeholder="user@smartlibrary.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            placeholder="Min 8 characters"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                            placeholder="Re-enter password"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Step 2: Role & Permissions</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Select Role *</Label>
                                        <RadioGroup value={formData.role} onValueChange={(v) => handleChange('role', v as Role)}>
                                            <div className="flex items-start space-x-2 border rounded-lg p-3">
                                                <RadioGroupItem value="superadmin" id="superadmin" />
                                                <div className="flex-1">
                                                    <Label htmlFor="superadmin" className="font-semibold cursor-pointer">SuperAdmin</Label>
                                                    <p className="text-sm text-muted-foreground">Full system access, create branches</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-2 border rounded-lg p-3">
                                                <RadioGroupItem value="owner" id="owner" />
                                                <div className="flex-1">
                                                    <Label htmlFor="owner" className="font-semibold cursor-pointer">Owner</Label>
                                                    <p className="text-sm text-muted-foreground">Full branch access, create managers</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-2 border rounded-lg p-3">
                                                <RadioGroupItem value="manager" id="manager" />
                                                <div className="flex-1">
                                                    <Label htmlFor="manager" className="font-semibold cursor-pointer">Manager</Label>
                                                    <p className="text-sm text-muted-foreground">Operations + limited financials</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-2 border rounded-lg p-3">
                                                <RadioGroupItem value="staff" id="staff" />
                                                <div className="flex-1">
                                                    <Label htmlFor="staff" className="font-semibold cursor-pointer">Staff</Label>
                                                    <p className="text-sm text-muted-foreground">Daily operations only</p>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {formData.role && (
                                        <div className="space-y-2">
                                            <Label>Permissions</Label>
                                            <div className="grid grid-cols-2 gap-2 border rounded-lg p-3">
                                                {availablePermissions.map(permission => (
                                                    <div key={permission} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={permission}
                                                            checked={formData.permissions.includes(permission)}
                                                            onCheckedChange={() => handlePermissionToggle(permission)}
                                                        />
                                                        <Label htmlFor={permission} className="text-sm cursor-pointer">
                                                            {permission.replace(/_/g, ' ')}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Step 3: Branch Assignment</h3>
                                {formData.role === 'superadmin' ? (
                                    <Alert>
                                        <AlertDescription>
                                            SuperAdmins have global access to all branches. No branch assignment required.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="branchId">Assign Branch *</Label>
                                        <Select value={formData.branchId} onValueChange={(v) => handleChange('branchId', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {branches.map(branch => (
                                                    <SelectItem key={branch.id} value={branch.id}>
                                                        {branch.name} - {branch.city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Step 4: Review & Create</h3>
                                <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
                                    <div className="grid grid-cols-2 gap-2">
                                        <span className="text-sm font-medium">Name:</span>
                                        <span className="text-sm">{formData.name}</span>

                                        <span className="text-sm font-medium">Email:</span>
                                        <span className="text-sm">{formData.email}</span>

                                        <span className="text-sm font-medium">Phone:</span>
                                        <span className="text-sm">{formData.phone}</span>

                                        <span className="text-sm font-medium">Role:</span>
                                        <span className="text-sm capitalize">{formData.role}</span>

                                        <span className="text-sm font-medium">Branch:</span>
                                        <span className="text-sm">
                                            {formData.role === 'superadmin'
                                                ? 'Global Access'
                                                : branches.find(b => b.id === formData.branchId)?.name || 'Not assigned'}
                                        </span>

                                        <span className="text-sm font-medium">Permissions:</span>
                                        <span className="text-sm">{formData.permissions.length} selected</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="sendWelcomeEmail"
                                            checked={formData.sendWelcomeEmail}
                                            onCheckedChange={(checked) => handleChange('sendWelcomeEmail', checked)}
                                        />
                                        <Label htmlFor="sendWelcomeEmail" className="cursor-pointer">
                                            Send Welcome Email
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="requirePasswordReset"
                                            checked={formData.requirePasswordReset}
                                            onCheckedChange={(checked) => handleChange('requirePasswordReset', checked)}
                                        />
                                        <Label htmlFor="requirePasswordReset" className="cursor-pointer">
                                            Require Password Reset on First Login
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!success && (
                    <DialogFooter className="gap-2">
                        {step > 1 && (
                            <Button variant="outline" onClick={() => setStep(step - 1)}>
                                Previous
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        {step < 4 ? (
                            <Button onClick={() => setStep(step + 1)} disabled={step === 2 && !formData.role}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit}>
                                Create User
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
