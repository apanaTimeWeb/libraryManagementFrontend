'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { branches } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { CreateBranchModal } from '@/components/modals/create-branch-modal';
import { EditBranchModal } from '@/components/modals/edit-branch-modal';
import { DeactivateBranchModal } from '@/components/modals/deactivate-branch-modal';
import { BranchTable } from '@/components/tables/branch-table';
import { toast } from 'sonner';

export default function BranchManagementPage() {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);

    const handleEdit = (branch: any) => {
        setSelectedBranch(branch);
        setShowEditModal(true);
    };

    const handleView = (branch: any) => {
        router.push(`/superadmin/branches/${branch.id}`);
    };

    const handleDelete = (branch: any) => {
        // Show confirmation toast
        toast.error('Delete functionality not yet implemented', {
            description: `Would delete branch: ${branch.name}`,
        });
    };

    const handleDeactivate = (branch: any) => {
        setSelectedBranch(branch);
        setShowDeactivateModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
                    <p className="text-muted-foreground">
                        Manage all library branches, view performance, and configure settings.
                    </p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Branch
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>All Branches</CardTitle>
                    <CardDescription>
                        A list of all branches including their location, manager, and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BranchTable
                        data={branches}
                        onEdit={handleEdit}
                        onView={handleView}
                        onDelete={handleDelete}
                        onDeactivate={handleDeactivate}
                    />
                </CardContent>
            </Card>

            <CreateBranchModal open={showCreateModal} onOpenChange={setShowCreateModal} />
            <EditBranchModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                branch={selectedBranch}
            />
            <DeactivateBranchModal
                open={showDeactivateModal}
                onOpenChange={setShowDeactivateModal}
                branch={selectedBranch}
                branches={branches}
            />
        </div>
    );
}
