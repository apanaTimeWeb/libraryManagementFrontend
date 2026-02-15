'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Enquiry } from '@/lib/types/ops-types';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface LogInteractionModalProps {
  lead: Enquiry;
  open: boolean;
  onClose: () => void;
}

export function LogInteractionModal({ lead, open, onClose }: LogInteractionModalProps) {
  const [interactionType, setInteractionType] = useState('call');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState(lead.status);
  const [followUpDate, setFollowUpDate] = useState<Date>();

  const handleSubmit = () => {
    toast.success(`Interaction logged for ${lead.name}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Interaction - {lead.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Interaction Type</Label>
            <select
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="call">Phone Call</option>
              <option value="visit">In-Person Visit</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter interaction details..."
              rows={4}
            />
          </div>

          <div>
            <Label>Update Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="new">New</option>
              <option value="visited">Visited</option>
              <option value="interested">Interested</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <Label>Next Follow-up Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {followUpDate ? format(followUpDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={followUpDate} onSelect={setFollowUpDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Log Interaction
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
