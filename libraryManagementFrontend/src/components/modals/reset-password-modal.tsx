'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validation/user';
import { toast } from 'sonner';

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function ResetPasswordModal({ open, onOpenChange, user }: ResetPasswordModalProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      userId: user?.id,
      autoGenerate: false,
      sendEmail: true,
      forceChangeOnNextLogin: true,
    },
  });

  const autoGenerate = watch('autoGenerate');

  const onSubmit = async (data: ResetPasswordFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Password reset successfully!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Reset password for {user?.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoGenerate"
              checked={autoGenerate}
              onCheckedChange={(checked) => setValue('autoGenerate', !!checked)}
            />
            <Label htmlFor="autoGenerate" className="cursor-pointer">Auto-generate secure password</Label>
          </div>

          {!autoGenerate && (
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password *</Label>
              <Input id="newPassword" type="password" {...register('newPassword')} placeholder="Min 8 characters" />
              {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              checked={watch('sendEmail')}
              onCheckedChange={(checked) => setValue('sendEmail', !!checked)}
            />
            <Label htmlFor="sendEmail" className="cursor-pointer">Send email notification</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="forceChangeOnNextLogin"
              checked={watch('forceChangeOnNextLogin')}
              onCheckedChange={(checked) => setValue('forceChangeOnNextLogin', !!checked)}
            />
            <Label htmlFor="forceChangeOnNextLogin" className="cursor-pointer">Force change on next login</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Resetting...' : 'Reset Password'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
