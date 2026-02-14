'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { users } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    createBranchSchema,
    type CreateBranchFormData,
} from '@/lib/validation/branch';
import { useBranchStore } from '@/lib/stores/branch-store';
import { toast } from 'sonner';

interface CreateBranchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateBranchModal({ open, onOpenChange }: CreateBranchModalProps) {
    const router = useRouter();
    const { createBranch, fetchBranches } = useBranchStore();
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');

    const availableUsers = useMemo(() => {
        const filtered = users.filter(u => 
            !u.branchId && 
            (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
             u.role.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        return filtered;
    }, [searchQuery]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset,
        trigger,
    } = useForm<CreateBranchFormData>({
        resolver: zodResolver(createBranchSchema),
        defaultValues: {
            name: 'Smart Library - Test Branch',
            city: 'Delhi',
            address: '123 Test Street, Test Area, Test City',
            pincode: '110001',
            phone: '+919876543210',
            email: 'test@smartlibrary.com',
            ownerName: 'Test Owner',
            gstNumber: '22AAAAA0000A1Z5',
            panNumber: 'ABCDE1234F',
            totalCapacity: 100,
            acSeats: 60,
            nonAcSeats: 40,
            monthlyRent: 50000,
            securityDeposit: 5000,
            managerId: '',
            morningShift: { start: '06:00', end: '14:00' },
            eveningShift: { start: '14:00', end: '22:00' },
            allowWaitlist: true,
            requireSecurityDeposit: false,
            lateFeePerDay: 10,
        },
    });

    const formValues = watch();

    const cities = [
        'Delhi',
        'Mumbai',
        'Bangalore',
        'Kolkata',
        'Pune',
        'Hyderabad',
        'Chennai',
        'Ahmedabad',
        'Jaipur',
        'Lucknow'
    ];

    // Validate current step before moving forward
    const validateStep = async (stepNumber: number): Promise<boolean> => {
        let fields: (keyof CreateBranchFormData)[] = [];

        switch (stepNumber) {
            case 1:
                fields = ['name', 'city', 'address', 'pincode'];
                break;
            case 2:
                fields = ['phone', 'email', 'ownerName'];
                break;
            case 3:
                fields = ['totalCapacity', 'monthlyRent'];
                break;
            case 4:
                // Manager is now optional, no validation needed
                return true;
            case 5:
                // No required fields in step 5 (all optional)
                return true;
        }

        const result = await trigger(fields as any);
        return result;
    };

    const handleNext = async () => {
        const isValid = await validateStep(step);
        if (isValid) {
            setStep(prev => Math.min(prev + 1, 5));
        }
    };

    const handlePrevious = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data: CreateBranchFormData) => {
        try {
            await createBranch({
                name: data.name,
                city: data.city,
                address: data.address,
                contactNumber: data.phone,
                email: data.email,
                status: 'active',
                capacity: data.totalCapacity,
                occupancy: 0,
                revenue: 0,
                defaultShiftMorning: data.morningShift || { start: '06:00', end: '14:00' },
                defaultShiftEvening: data.eveningShift || { start: '14:00', end: '22:00' },
                pincode: data.pincode,
                managerId: data.managerId,
                ownerName: data.ownerName,
                gstNumber: data.gstNumber,
                panNumber: data.panNumber,
                monthlyRent: data.monthlyRent,
            });
            
            setSuccess(true);
            toast.success('Branch created successfully!');
            
            setTimeout(async () => {
                setSuccess(false);
                onOpenChange(false);
                setStep(1);
                reset();
                await fetchBranches();
            }, 1500);
        } catch (error) {
            toast.error('Failed to create branch', {
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setStep(1);
        reset();
        setSuccess(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Branch</DialogTitle>
                    <DialogDescription>
                        Add a new library branch to your network. Step {step} of 5
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Branch created successfully! Redirecting...
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 1: Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Branch Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            {...register('name')}
                                            placeholder="Smart Library - Location"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">
                                            City <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formValues.city}
                                            onValueChange={(value) => setValue('city', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cities.map(city => (
                                                    <SelectItem key={city} value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.city && (
                                            <p className="text-sm text-red-500">{errors.city.message}</p>
                                        )}
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="address">
                                            Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="address"
                                            {...register('address')}
                                            placeholder="Full branch address"
                                            rows={3}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-500">{errors.address.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">
                                            Pincode <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="pincode"
                                            {...register('pincode')}
                                            placeholder="123456"
                                            maxLength={6}
                                        />
                                        {errors.pincode && (
                                            <p className="text-sm text-red-500">{errors.pincode.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Contact & Legal */}
                        {step === 2 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 2: Contact & Legal Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Contact Number <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            {...register('phone')}
                                            placeholder="+91 9876543210"
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-500">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register('email')}
                                            placeholder="branch@smartlibrary.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="ownerName">
                                            Owner Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="ownerName"
                                            {...register('ownerName')}
                                            placeholder="Full name"
                                        />
                                        {errors.ownerName && (
                                            <p className="text-sm text-red-500">{errors.ownerName.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gstNumber">GST Number</Label>
                                        <Input
                                            id="gstNumber"
                                            {...register('gstNumber')}
                                            placeholder="22AAAAA0000A1Z5"
                                            maxLength={15}
                                        />
                                        {errors.gstNumber && (
                                            <p className="text-sm text-red-500">{errors.gstNumber.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="panNumber">PAN Number</Label>
                                        <Input
                                            id="panNumber"
                                            {...register('panNumber')}
                                            placeholder="ABCDE1234F"
                                            maxLength={10}
                                        />
                                        {errors.panNumber && (
                                            <p className="text-sm text-red-500">{errors.panNumber.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Configuration */}
                        {step === 3 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 3: Configuration</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="totalCapacity">
                                            Total Capacity <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="totalCapacity"
                                            type="number"
                                            {...register('totalCapacity', { valueAsNumber: true })}
                                            placeholder="100"
                                        />
                                        {errors.totalCapacity && (
                                            <p className="text-sm text-red-500">{errors.totalCapacity.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="monthlyRent">
                                            Monthly Rent <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="monthlyRent"
                                            type="number"
                                            {...register('monthlyRent', { valueAsNumber: true })}
                                            placeholder="50000"
                                        />
                                        {errors.monthlyRent && (
                                            <p className="text-sm text-red-500">{errors.monthlyRent.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="acSeats">AC Seats</Label>
                                        <Input
                                            id="acSeats"
                                            type="number"
                                            {...register('acSeats', { valueAsNumber: true })}
                                            placeholder="50"
                                        />
                                        {errors.acSeats && (
                                            <p className="text-sm text-red-500">{errors.acSeats.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nonAcSeats">Non-AC Seats</Label>
                                        <Input
                                            id="nonAcSeats"
                                            type="number"
                                            {...register('nonAcSeats', { valueAsNumber: true })}
                                            placeholder="50"
                                        />
                                        {errors.nonAcSeats && (
                                            <p className="text-sm text-red-500">{errors.nonAcSeats.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="securityDeposit">Security Deposit</Label>
                                        <Input
                                            id="securityDeposit"
                                            type="number"
                                            {...register('securityDeposit', { valueAsNumber: true })}
                                            placeholder="5000"
                                        />
                                        {errors.securityDeposit && (
                                            <p className="text-sm text-red-500">{errors.securityDeposit.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Assign Manager */}
                        {step === 4 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 4: Assign User (Optional)</h3>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name, email, or role..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>

                                    {availableUsers.length === 0 ? (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                No unassigned users found. You can assign a user later from branch settings.
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2">
                                            {availableUsers.map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => {
                                                        setSelectedUserId(user.id);
                                                        setValue('managerId', user.id);
                                                    }}
                                                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                                                        selectedUserId === user.id
                                                            ? 'bg-primary/10 border-2 border-primary'
                                                            : 'hover:bg-accent border-2 border-transparent'
                                                    }`}
                                                >
                                                    <Avatar>
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                    <Badge variant="outline" className="capitalize">
                                                        {user.role}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedUserId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedUserId('');
                                                setValue('managerId', '');
                                            }}
                                        >
                                            Clear Selection
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Default Settings */}
                        {step === 5 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 5: Default Settings</h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Morning Shift</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="morningStart">Start Time</Label>
                                                <Input
                                                    id="morningStart"
                                                    type="time"
                                                    {...register('morningShift.start')}
                                                />
                                                {errors.morningShift?.start && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.morningShift.start.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="morningEnd">End Time</Label>
                                                <Input
                                                    id="morningEnd"
                                                    type="time"
                                                    {...register('morningShift.end')}
                                                />
                                                {errors.morningShift?.end && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.morningShift.end.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Evening Shift</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="eveningStart">Start Time</Label>
                                                <Input
                                                    id="eveningStart"
                                                    type="time"
                                                    {...register('eveningShift.start')}
                                                />
                                                {errors.eveningShift?.start && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.eveningShift.start.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="eveningEnd">End Time</Label>
                                                <Input
                                                    id="eveningEnd"
                                                    type="time"
                                                    {...register('eveningShift.end')}
                                                />
                                                {errors.eveningShift?.end && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.eveningShift.end.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lateFeePerDay">Late Fee Per Day (₹)</Label>
                                        <Input
                                            id="lateFeePerDay"
                                            type="number"
                                            {...register('lateFeePerDay', { valueAsNumber: true })}
                                            placeholder="10"
                                        />
                                        {errors.lateFeePerDay && (
                                            <p className="text-sm text-red-500">{errors.lateFeePerDay.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <DialogFooter className="flex justify-between mt-6">
                            <div className="flex gap-2">
                                {step > 1 && (
                                    <Button type="button" variant="outline" onClick={handlePrevious}>
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {step < 5 ? (
                                    <Button type="button" onClick={handleNext}>
                                        Next
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create Branch'}
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
