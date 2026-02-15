'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Enquiry } from '@/lib/types/ops-types';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';

interface SendMessageModalProps {
  lead: Enquiry;
  open: boolean;
  onClose: () => void;
}

const templates = [
  {
    id: 'welcome',
    name: 'Welcome Offer',
    message: 'Hi {name}! Welcome to Smart Library 360. Get 10% off on your first month. Visit us today!'
  },
  {
    id: 'seat_available',
    name: 'Seat Availability Alert',
    message: 'Hi {name}! Good news! We have seats available in your preferred shift. Book now before they fill up!'
  },
  {
    id: 'follow_up',
    name: 'Follow-up',
    message: 'Hi {name}! Just following up on your enquiry. Would you like to visit our library? Let us know a convenient time.'
  },
  {
    id: 'reminder',
    name: 'Reminder',
    message: 'Hi {name}! This is a reminder about your interest in joining Smart Library 360. We\'d love to have you!'
  }
];

export function SendMessageModal({ lead, open, onClose }: SendMessageModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);

  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const previewMessage = currentTemplate?.message.replace('{name}', lead.name);

  const handleSend = () => {
    toast.success(`Message sent to ${lead.name} via WhatsApp`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Message to {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Select Template</Label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Preview</Label>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{previewMessage}</p>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Message will be sent to: {lead.phone}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSend} className="flex-1 bg-green-600 hover:bg-green-700">
              Send via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
