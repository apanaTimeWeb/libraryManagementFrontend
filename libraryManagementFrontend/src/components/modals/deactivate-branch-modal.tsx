'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { deactivateBranchSchema, type DeactivateBranchFormData } from '@/lib/validation/branch';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface DeactivateBranchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: any;
  branches: any[];
}

export function DeactivateBranchModal({ open, onOpenChange, branch, branches }: DeactivateBranchModalProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<DeactivateBranchFormData>({
    resolver: zodResolver(deactivateBranchSchema),
    defaultValues: { id: branch?.id, archiveData: true },
  });

  const onSubmit = async (data: DeactivateBranchFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Branch deactivated successfully!');
    onOpenChange(false);
  };

  const activeBranches = branches.filter(b => b.id !== branch?.id && b.status === 'active');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Deactivate Branch</DialogTitle>
          <DialogDescription>This action will deactivate {branch?.name}</DialogDescription>
        </DialogHeader>

        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            This will affect {branch?.activeStudents || 0} active students. Please migrate them to another branch.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select onValueChange={(v) => setValue('reason', v as any)}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="relocated">Relocated</SelectItem>
                <SelectItem value="poor_performance">Poor Performance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasonNotes">Detailed Notes *</Label>
            <Textarea id="reasonNotes" {...register('reasonNotes')} rows={3} placeholder="Provide detailed explanation..." />
            {errors.reasonNotes && <p className="text-sm text-red-500">{errors.reasonNotes.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="migrateStudentsTo">Migrate Students To</Label>
            <Select onValueChange={(v) => setValue('migrateStudentsTo', v)}>
              <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
              <SelectContent>
                {activeBranches.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name} - {b.city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? 'Deactivating...' : 'Deactivate Branch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
