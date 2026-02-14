'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { branches } from '@/lib/mockData';
import { Role } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserStore } from '@/lib/stores/user-store';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';
import { createUserSchema } from '@/lib/validation/user';

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['superadmin', 'owner', 'manager', 'staff']),
    permissions: z.array(z.string()),
    branchId: z.string().optional(),
    sendWelcomeEmail: z.boolean(),
    requirePasswordReset: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const { createUser, fetchUsers } = useUserStore();
    const { user: currentUser } = useAuthStore();
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    
    const isSuperAdmin = currentUser?.role === 'superadmin';
    const isOwner = currentUser?.role === 'owner';
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: undefined,
            permissions: [],
            branchId: isOwner ? currentUser.branchId || '' : '',
            sendWelcomeEmail: true,
            requirePasswordReset: true,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const branchId = isOwner ? currentUser.branchId : values.branchId;
            
            await createUser({
                name: values.name,
                email: values.email,
                phone: values.phone,
                role: values.role as Role,
                permissions: values.permissions,
                isActive: true,
                branchId: branchId || null,
            });
            
            setSuccess(true);
            toast.success('User created successfully!');
            
            setTimeout(async () => {
                setSuccess(false);
                onOpenChange(false);
                setStep(1);
                form.reset();
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

    const currentRole = form.watch('role');
    const availablePermissions = currentRole ? rolePermissions[currentRole as keyof typeof rolePermissions] : [];

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
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {step === 1 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Step 1: Basic Information</h3>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+919876543210" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address *</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="user@smartlibrary.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password *</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Min 8 characters" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password *</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Re-enter password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Step 2: Role & Permissions</h3>
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Role *</FormLabel>
                                            <FormControl>
                                                <RadioGroup value={field.value} onValueChange={field.onChange}>
                                                    {isSuperAdmin && (
                                                        <div className="flex items-start space-x-2 border rounded-lg p-3">
                                                            <RadioGroupItem value="owner" id="owner" />
                                                            <div className="flex-1">
                                                                <FormLabel htmlFor="owner" className="font-semibold cursor-pointer">Owner</FormLabel>
                                                                <p className="text-sm text-muted-foreground">Full branch access, create managers</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {isOwner && (
                                                        <>
                                                            <div className="flex items-start space-x-2 border rounded-lg p-3">
                                                                <RadioGroupItem value="manager" id="manager" />
                                                                <div className="flex-1">
                                                                    <FormLabel htmlFor="manager" className="font-semibold cursor-pointer">Manager</FormLabel>
                                                                    <p className="text-sm text-muted-foreground">Operations + limited financials</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start space-x-2 border rounded-lg p-3">
                                                                <RadioGroupItem value="staff" id="staff" />
                                                                <div className="flex-1">
                                                                    <FormLabel htmlFor="staff" className="font-semibold cursor-pointer">Staff</FormLabel>
                                                                    <p className="text-sm text-muted-foreground">Daily operations only</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {currentRole && (
                                    <FormField
                                        control={form.control}
                                        name="permissions"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Permissions</FormLabel>
                                                <div className="grid grid-cols-2 gap-2 border rounded-lg p-3">
                                                    {availablePermissions.map(permission => (
                                                        <FormField
                                                            key={permission}
                                                            control={form.control}
                                                            name="permissions"
                                                            render={({ field }) => (
                                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(permission)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, permission])
                                                                                    : field.onChange(field.value?.filter((val) => val !== permission));
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm cursor-pointer font-normal">
                                                                        {permission.replace(/_/g, ' ')}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Step 3: Branch Assignment</h3>
                                <FormField
                                    control={form.control}
                                    name="branchId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assign Branch *</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isOwner}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a branch" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {(isOwner ? branches.filter(b => b.id === currentUser.branchId) : branches).map(branch => (
                                                        <SelectItem key={branch.id} value={branch.id}>
                                                            {branch.name} - {branch.city}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {isOwner && (
                                                <p className="text-xs text-muted-foreground">
                                                    Users will be assigned to your branch automatically
                                                </p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {step === 4 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Step 4: Review & Create</h3>
                                <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
                                    <div className="grid grid-cols-2 gap-2">
                                        <span className="text-sm font-medium">Name:</span>
                                        <span className="text-sm">{form.getValues('name')}</span>

                                        <span className="text-sm font-medium">Email:</span>
                                        <span className="text-sm">{form.getValues('email')}</span>

                                        <span className="text-sm font-medium">Phone:</span>
                                        <span className="text-sm">{form.getValues('phone')}</span>

                                        <span className="text-sm font-medium">Role:</span>
                                        <span className="text-sm capitalize">{form.getValues('role')}</span>

                                        <span className="text-sm font-medium">Branch:</span>
                                        <span className="text-sm">
                                            {branches.find(b => b.id === form.getValues('branchId'))?.name || 'Not assigned'}
                                        </span>

                                        <span className="text-sm font-medium">Permissions:</span>
                                        <span className="text-sm">{form.getValues('permissions').length} selected</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="sendWelcomeEmail"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="cursor-pointer font-normal">Send Welcome Email</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="requirePasswordReset"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="cursor-pointer font-normal">Require Password Reset on First Login</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        </form>
                    </Form>
                )}

                {!success && (
                    <DialogFooter className="gap-2">
                        {step > 1 && (
                            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                                Previous
                            </Button>
                        )}
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        {step < 4 ? (
                            <Button type="button" onClick={() => setStep(step + 1)} disabled={step === 2 && !currentRole}>
                                Next
                            </Button>
                        ) : (
                            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                                Create User
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
