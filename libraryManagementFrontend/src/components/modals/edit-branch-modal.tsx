'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { editBranchSchema, type EditBranchFormData } from '@/lib/validation/branch';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EditBranchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: any;
}

export function EditBranchModal({ open, onOpenChange, branch }: EditBranchModalProps) {
  const [step, setStep] = useState(1);
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm<EditBranchFormData>({
    resolver: zodResolver(editBranchSchema),
  });

  useEffect(() => {
    if (branch && open) {
      Object.keys(branch).forEach((key) => {
        setValue(key as any, branch[key]);
      });
    }
  }, [branch, open, setValue]);

  const onSubmit = async (data: EditBranchFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Branch updated successfully!');
    onOpenChange(false);
    setStep(1);
  };

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Pune', 'Hyderabad', 'Chennai'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
          <DialogDescription>Update branch information. Step {step} of 3</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name *</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select value={watch('city')} onValueChange={(v) => setValue('city', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" {...register('address')} rows={3} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register('phone')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" {...register('email')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input id="gstNumber" {...register('gstNumber')} maxLength={15} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input id="panNumber" {...register('panNumber')} maxLength={10} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalCapacity">Total Capacity</Label>
                  <Input id="totalCapacity" type="number" {...register('totalCapacity', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent</Label>
                  <Input id="monthlyRent" type="number" {...register('monthlyRent', { valueAsNumber: true })} />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between mt-6">
            <div>
              {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(step - 1)}><ChevronLeft className="mr-2 h-4 w-4" />Previous</Button>}
            </div>
            <div className="flex gap-2">
              {step < 3 ? (
                <Button type="button" onClick={() => setStep(step + 1)}>Next<ChevronRight className="ml-2 h-4 w-4" /></Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update Branch'}</Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
