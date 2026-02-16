'use client';

import { useState } from 'react';
import { ManagerLayout } from '@/components/layout/manager-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockEnquiries } from '@/lib/opsData';
import { Enquiry } from '@/lib/types/ops-types';
import { Plus, Phone, MessageSquare, UserPlus } from 'lucide-react';
import { LeadsTable } from '@/components/tables/leads-table';
import { LogInteractionModal } from '@/components/modals/log-interaction-modal';
import { SendMessageModal } from '@/components/modals/send-message-modal';
import { AdmissionWizard } from '@/components/modals/admission-wizard';
import { AddLeadModal } from '@/components/modals/add-lead-modal';

export default function CRMPage() {
  const [leads, setLeads] = useState(mockEnquiries);
  const [selectedLead, setSelectedLead] = useState<Enquiry | null>(null);
  const [showLogInteraction, setShowLogInteraction] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);

  const newLeads = leads.filter(l => l.status === 'new').length;
  const interestedLeads = leads.filter(l => l.status === 'interested').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;

  const handleLogInteraction = (lead: Enquiry) => {
    setSelectedLead(lead);
    setShowLogInteraction(true);
  };

  const handleSendMessage = (lead: Enquiry) => {
    setSelectedLead(lead);
    setShowSendMessage(true);
  };

  const handleConvert = (lead: Enquiry) => {
    setSelectedLead(lead);
    setShowConvert(true);
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CRM & Leads</h1>
            <p className="text-sm text-slate-500">Manage enquiries and convert leads</p>
          </div>
          <Button onClick={() => setShowAddLead(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">New Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-blue-600">{newLeads}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Interested</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-green-600">{interestedLeads}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Converted</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-purple-600">{convertedLeads}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-slate-900">
                {Math.round((convertedLeads / leads.length) * 100)}%
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Management</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsTable
              leads={leads}
              onLogInteraction={handleLogInteraction}
              onSendMessage={handleSendMessage}
              onConvert={handleConvert}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showLogInteraction && selectedLead && (
        <LogInteractionModal
          lead={selectedLead}
          open={showLogInteraction}
          onClose={() => {
            setShowLogInteraction(false);
            setSelectedLead(null);
          }}
        />
      )}
      {showSendMessage && selectedLead && (
        <SendMessageModal
          lead={selectedLead}
          open={showSendMessage}
          onClose={() => {
            setShowSendMessage(false);
            setSelectedLead(null);
          }}
        />
      )}
      {showConvert && (
        <AdmissionWizard
          open={showConvert}
          onClose={() => {
            setShowConvert(false);
            setSelectedLead(null);
          }}
        />
      )}
      {showAddLead && (
        <AddLeadModal
          open={showAddLead}
          onClose={() => setShowAddLead(false)}
        />
      )}
    </ManagerLayout>
  );
}
