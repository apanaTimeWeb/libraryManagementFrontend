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
import { Textarea } from '@/components/ui/textarea';
import { users } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateBranchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateBranchModal({ open, onOpenChange }: CreateBranchModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        pincode: '',
        contactNumber: '',
        email: '',
        ownerName: '',
        gstNumber: '',
        panNumber: '',
        capacity: '100',
        monthlyRent: '',
        managerId: '',
        morningStart: '06:00',
        morningEnd: '14:00',
        eveningStart: '14:00',
        eveningEnd: '22:00',
    });

    const managers = users.filter(u => u.role === 'manager' && !u.branchId);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Mock submission
        console.log('Creating branch:', formData);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            onOpenChange(false);
            setStep(1);
            router.refresh();
        }, 2000);
    };

    const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Jaipur', 'Lucknow'];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    <>
                        {step === 1 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 1: Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Branch Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            placeholder="Smart Library - Location"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Select value={formData.city} onValueChange={(v) => handleChange('city', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cities.map(city => (
                                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address *</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder="Full address with landmarks"
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode *</Label>
                                        <Input
                                            id="pincode"
                                            value={formData.pincode}
                                            onChange={(e) => handleChange('pincode', e.target.value)}
                                            placeholder="110001"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 2: Contact & Legal</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactNumber">Contact Number *</Label>
                                        <Input
                                            id="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={(e) => handleChange('contactNumber', e.target.value)}
                                            placeholder="+911123456789"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            placeholder="branch@smartlibrary.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ownerName">Owner Name</Label>
                                    <Input
                                        id="ownerName"
                                        value={formData.ownerName}
                                        onChange={(e) => handleChange('ownerName', e.target.value)}
                                        placeholder="Franchise owner name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="gstNumber">GST Number</Label>
                                        <Input
                                            id="gstNumber"
                                            value={formData.gstNumber}
                                            onChange={(e) => handleChange('gstNumber', e.target.value)}
                                            placeholder="07AAACH7409R1ZN"
                                            maxLength={15}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="panNumber">PAN Number</Label>
                                        <Input
                                            id="panNumber"
                                            value={formData.panNumber}
                                            onChange={(e) => handleChange('panNumber', e.target.value)}
                                            placeholder="AAACH7409R"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 3: Configuration</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="capacity">Total Capacity (Seats) *</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => handleChange('capacity', e.target.value)}
                                            placeholder="100"
                                            min="50"
                                            max="500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="monthlyRent">Monthly Rent (₹)</Label>
                                        <Input
                                            id="monthlyRent"
                                            type="number"
                                            value={formData.monthlyRent}
                                            onChange={(e) => handleChange('monthlyRent', e.target.value)}
                                            placeholder="80000"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 4: Assign Manager</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="managerId">Select Manager</Label>
                                    <Select value={formData.managerId} onValueChange={(v) => handleChange('managerId', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a manager (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {managers.length === 0 ? (
                                                <div className="p-2 text-sm text-muted-foreground">No available managers</div>
                                            ) : (
                                                managers.map(manager => (
                                                    <SelectItem key={manager.id} value={manager.id}>
                                                        {manager.name} - {manager.phone}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {managers.length === 0 && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                No unassigned managers available. You can assign a manager later.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="grid gap-4 py-4">
                                <h3 className="font-semibold">Section 5: Default Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="mb-2 block">Morning Shift Timings</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="morningStart">Start Time</Label>
                                                <Input
                                                    id="morningStart"
                                                    type="time"
                                                    value={formData.morningStart}
                                                    onChange={(e) => handleChange('morningStart', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="morningEnd">End Time</Label>
                                                <Input
                                                    id="morningEnd"
                                                    type="time"
                                                    value={formData.morningEnd}
                                                    onChange={(e) => handleChange('morningEnd', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="mb-2 block">Evening Shift Timings</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="eveningStart">Start Time</Label>
                                                <Input
                                                    id="eveningStart"
                                                    type="time"
                                                    value={formData.eveningStart}
                                                    onChange={(e) => handleChange('eveningStart', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="eveningEnd">End Time</Label>
                                                <Input
                                                    id="eveningEnd"
                                                    type="time"
                                                    value={formData.eveningEnd}
                                                    onChange={(e) => handleChange('eveningEnd', e.target.value)}
                                                />
                                            </div>
                                        </div>
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
                        {step < 5 ? (
                            <Button onClick={() => setStep(step + 1)}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit}>
                                Create Branch
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
