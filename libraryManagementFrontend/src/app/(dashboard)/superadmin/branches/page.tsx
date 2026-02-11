'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreateBranchModal } from '@/components/modals/create-branch-modal';
import { EditBranchModal } from '@/components/modals/edit-branch-modal';
import { DeactivateBranchModal } from '@/components/modals/deactivate-branch-modal';
import { BranchTable, type BranchTableRow } from '@/components/tables/branch-table';
import { toast } from 'sonner';
import { useBranchStore } from '@/lib/stores/branch-store';
import { getUserById } from '@/lib/mockData';

export default function BranchManagementPage() {
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchTableRow | null>(null);

  const { branches, fetchBranches, deleteBranch, isLoading } = useBranchStore();

  useEffect(() => {
    void fetchBranches();
  }, [fetchBranches]);

  const tableData = useMemo<BranchTableRow[]>(() => {
    return branches.map((branch) => ({
      ...branch,
      managerName: branch.managerId ? getUserById(branch.managerId)?.name : 'Unassigned',
    }));
  }, [branches]);

  const handleEdit = (branch: BranchTableRow) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleView = (branch: BranchTableRow) => {
    router.push(`/superadmin/branches/${branch.id}`);
  };

  const handleDelete = async (branch: BranchTableRow) => {
    try {
      await deleteBranch(branch.id);
      toast.success('Branch deleted', {
        description: `${branch.name} has been removed.`,
      });
    } catch {
      toast.error('Delete failed', {
        description: `Could not delete ${branch.name}.`,
      });
    }
  };

  const handleDeactivate = (branch: BranchTableRow) => {
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
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading branches...</p>
          ) : (
            <BranchTable
              data={tableData}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onDeactivate={handleDeactivate}
            />
          )}
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
        branches={tableData}
      />
    </div>
  );
}
