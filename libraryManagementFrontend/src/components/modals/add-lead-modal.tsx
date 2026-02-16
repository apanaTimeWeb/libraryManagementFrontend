'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddLeadModal({ open, onClose }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'walk_in',
    notes: '',
    followUpDate: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone are required');
      return;
    }

    toast.success(`Lead ${formData.name} added successfully`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full name"
            />
          </div>

          <div>
            <Label>Phone *</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+919876543210"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <Label>Source</Label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="walk_in">Walk In</option>
              <option value="google_ads">Google Ads</option>
              <option value="facebook">Facebook</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label>Follow-up Date</Label>
            <Input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Add Lead
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
