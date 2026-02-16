'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useRoleStore } from '@/lib/stores/role-store';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ResolveComplaintModalProps {
  complaint: any;
  open: boolean;
  onClose: () => void;
}

export function ResolveComplaintModal({ complaint, open, onClose }: ResolveComplaintModalProps) {
  const { isManager } = useRoleStore();
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [notifyComplainant, setNotifyComplainant] = useState(true);

  const handleResolve = () => {
    if (!isManager()) {
      toast.error('Only managers can resolve complaints');
      return;
    }

    if (!resolutionNotes.trim()) {
      toast.error('Please provide resolution notes');
      return;
    }

    toast.success(
      `Complaint ${complaint.number} resolved${
        notifyComplainant ? '. Notification sent to complainant.' : ''
      }`
    );
    onClose();
  };

  const handleEscalate = () => {
    toast.success(`Complaint ${complaint.number} escalated to manager`);
    onClose();
  };

  const handleInProgress = () => {
    if (!isManager()) {
      toast.error('Only managers can change complaint status');
      return;
    }
    toast.success(`Complaint ${complaint.number} marked as In Progress`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Complaint</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Complaint Info */}
          <div className="p-4 bg-slate-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{complaint.number}</p>
              <Badge variant={complaint.priority === 'high' ? 'destructive' : 'secondary'}>
                {complaint.priority}
              </Badge>
            </div>
            <p className="text-sm font-medium">{complaint.title}</p>
            <p className="text-sm text-slate-600">{complaint.description}</p>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline">{complaint.category}</Badge>
              <Badge variant="outline">{complaint.daysOpen} days open</Badge>
              {complaint.studentName && (
                <Badge>{complaint.studentName}</Badge>
              )}
            </div>
          </div>

          {/* Manager Only Warning */}
          {!isManager() && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">Staff Access Limited</p>
                  <p>You can escalate this complaint. Only managers can resolve or mark in progress.</p>
                </div>
              </div>
            </div>
          )}

          {/* Resolution Notes (Manager Only) */}
          {isManager() && (
            <>
              <div>
                <Label>Resolution Notes *</Label>
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe how the complaint was resolved..."
                  rows={4}
                />
              </div>

              {/* Notify Complainant */}
              {!complaint.isAnonymous && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notify"
                    checked={notifyComplainant}
                    onCheckedChange={(checked) => setNotifyComplainant(checked as boolean)}
                  />
                  <Label htmlFor="notify" className="text-sm">
                    Notify complainant via WhatsApp
                  </Label>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4 border-t">
            {isManager() ? (
              <>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleInProgress} className="flex-1">
                    Mark In Progress
                  </Button>
                  <Button onClick={handleResolve} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                </div>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleEscalate} className="w-full">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Escalate to Manager
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
