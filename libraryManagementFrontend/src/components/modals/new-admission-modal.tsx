'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { toast } from 'sonner';
import { useStudentStore } from '@/lib/stores/student-store';
import { branches } from '@/lib/mockData';
import { CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const admissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  parentPhone: z.string().optional(),
  college: z.string().optional(),
  address: z.string().optional(),
  branchId: z.string().min(1, 'Branch is required'),
  shiftType: z.enum(['morning', 'evening', 'hybrid']),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

interface NewAdmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAdmissionModal({ open, onOpenChange }: NewAdmissionModalProps) {
  const { createStudent, fetchStudents } = useStudentStore();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      name: 'Test Student',
      email: 'teststudent@example.com',
      phone: '+919876543210',
      parentPhone: '+919876543211',
      college: 'Delhi University',
      address: '123 Test Street, Test Area, Delhi',
      branchId: branches.length > 0 ? branches[0].id : '',
      shiftType: 'morning',
    },
  });

  const onSubmit = async (data: AdmissionFormData) => {
    try {
      await createStudent(data);
      setSuccess(true);
      toast.success('Student admitted successfully!');

      setTimeout(async () => {
        setSuccess(false);
        onOpenChange(false);
        reset();
        await fetchStudents();
      }, 1500);
    } catch (error) {
      toast.error('Failed to admit student', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Admission</DialogTitle>
          <DialogDescription>Add a new student to the library</DialogDescription>
        </DialogHeader>

        {success ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Student admitted successfully!
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+919876543210"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent Phone</Label>
                  <Input
                    id="parentPhone"
                    {...register('parentPhone')}
                    placeholder="+919876543210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College/Institution</Label>
                  <Input
                    id="college"
                    {...register('college')}
                    placeholder="Delhi University"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchId">
                    Branch <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('branchId')}
                    onValueChange={(value) => setValue('branchId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} - {branch.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.branchId && (
                    <p className="text-sm text-red-500">{errors.branchId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shiftType">
                    Shift Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch('shiftType')}
                    onValueChange={(value) => setValue('shiftType', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    {...register('address')}
                    placeholder="Full address"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Admitting...' : 'Admit Student'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
