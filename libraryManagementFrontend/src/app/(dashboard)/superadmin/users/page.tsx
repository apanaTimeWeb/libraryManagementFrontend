'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreateUserModal } from '@/components/modals/create-user-modal';
import { EditUserModal } from '@/components/modals/edit-user-modal';
import { ResetPasswordModal } from '@/components/modals/reset-password-modal';
import { UserTable, type UserTableRow } from '@/components/tables/user-table';
import { toast } from 'sonner';
import { useUserStore } from '@/lib/stores/user-store';
import { getBranchById } from '@/lib/mockData';

export default function UserManagementPage() {
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserTableRow | null>(null);

  const { users, fetchUsers, deleteUser, isLoading } = useUserStore();

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const tableData = useMemo<UserTableRow[]>(() => {
    return users.map((user) => ({
      ...user,
      branchName: user.branchId ? getBranchById(user.branchId)?.name : 'Global Access',
    }));
  }, [users]);

  const handleEdit = (user: UserTableRow) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleView = (user: UserTableRow) => {
    router.push(`/superadmin/users/${user.id}`);
  };

  const handleDelete = async (user: UserTableRow) => {
    try {
      await deleteUser(user.id);
      toast.success('User deleted', {
        description: `${user.name} has been removed.`,
      });
    } catch {
      toast.error('Delete failed', {
        description: `Could not delete ${user.name}.`,
      });
    }
  };

  const handleResetPassword = (user: UserTableRow) => {
    setSelectedUser(user);
    setShowResetPasswordModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions across all branches.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            A comprehensive list of all users with access to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : (
            <UserTable
              data={tableData}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onResetPassword={handleResetPassword}
            />
          )}
        </CardContent>
      </Card>

      <CreateUserModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      <EditUserModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        user={selectedUser}
      />
      <ResetPasswordModal
        open={showResetPasswordModal}
        onOpenChange={setShowResetPasswordModal}
        user={selectedUser}
      />
    </div>
  );
}
