'use client';

import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface SendAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendAnnouncementModal({ open, onOpenChange }: SendAnnouncementModalProps) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      message: '',
      target: 'all',
      channels: { email: true, sms: false, whatsapp: false, inApp: true },
      schedule: 'immediate',
    },
  });

  const onSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Announcement sent successfully!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Announcement</DialogTitle>
          <DialogDescription>Broadcast message to users</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} placeholder="Announcement title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" {...register('message')} rows={5} placeholder="Your message here..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Audience</Label>
            <Select onValueChange={(v) => setValue('target', v)}>
              <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="students">Students Only</SelectItem>
                <SelectItem value="staff">Staff Only</SelectItem>
                <SelectItem value="branch">Specific Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Channels</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="email" defaultChecked onCheckedChange={(c) => setValue('channels.email', !!c)} />
                <Label htmlFor="email" className="cursor-pointer">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sms" onCheckedChange={(c) => setValue('channels.sms', !!c)} />
                <Label htmlFor="sms" className="cursor-pointer">SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="whatsapp" onCheckedChange={(c) => setValue('channels.whatsapp', !!c)} />
                <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="inApp" defaultChecked onCheckedChange={(c) => setValue('channels.inApp', !!c)} />
                <Label htmlFor="inApp" className="cursor-pointer">In-App</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Announcement'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
