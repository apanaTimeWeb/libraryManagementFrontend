'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { users } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { CreateUserModal } from '@/components/modals/create-user-modal';
import { EditUserModal } from '@/components/modals/edit-user-modal';
import { ResetPasswordModal } from '@/components/modals/reset-password-modal';
import { UserTable } from '@/components/tables/user-table';
import { toast } from 'sonner';

export default function UserManagementPage() {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleView = (user: any) => {
        router.push(`/superadmin/users/${user.id}`);
    };

    const handleDelete = (user: any) => {
        // Show confirmation toast
        toast.error('Delete functionality not yet implemented', {
            description: `Would delete user: ${user.name}`,
        });
    };

    const handleResetPassword = (user: any) => {
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
                    <UserTable
                        data={users}
                        onEdit={handleEdit}
                        onView={handleView}
                        onDelete={handleDelete}
                        onResetPassword={handleResetPassword}
                    />
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
