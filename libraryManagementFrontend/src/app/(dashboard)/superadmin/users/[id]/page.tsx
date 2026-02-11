'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
    ArrowLeft, Edit2, Mail, Phone, Calendar, Activity,
    Shield, Key, Smartphone, MapPin
} from 'lucide-react';
import { users, getBranchById, branches, auditLogs } from '@/lib/mockData';
import { format, formatDistanceToNow } from 'date-fns';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Mock session data
const generateSessions = () => {
    return Array.from({ length: 5 }, (_, i) => ({
        id: `session-${i + 1}`,
        device: ['Chrome/Windows 11', 'Safari/macOS', 'Firefox/Ubuntu', 'Edge/Windows 10', 'Chrome/Android'][i],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        location: ['Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Pune, India', 'Hyderabad, India'][i],
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrent: i === 0,
    }));
};

// Permission list
const allPermissions = [
    { id: 'branch_full', name: 'Full Branch Access', category: 'Branch' },
    { id: 'branch_view', name: 'View Branch', category: 'Branch' },
    { id: 'branch_edit', name: 'Edit Branch', category: 'Branch' },
    { id: 'branch_delete', name: 'Delete Branch', category: 'Branch' },
    { id: 'user_create', name: 'Create Users', category: 'User Management' },
    { id: 'user_edit', name: 'Edit Users', category: 'User Management' },
    { id: 'user_delete', name: 'Delete Users', category: 'User Management' },
    { id: 'manage_students', name: 'Manage Students', category: 'Student Management' },
    { id: 'collect_fees', name: 'Collect Fees', category: 'Financial' },
    { id: 'view_financials', name: 'View Financials', category: 'Financial' },
    { id: 'view_reports', name: 'View Reports', category: 'Reports' },
    { id: 'manage_attendance', name: 'Manage Attendance', category: 'Operations' },
    { id: 'system_settings', name: 'System Settings', category: 'System' },
];

const sessionHistorySeed = Array.from({ length: 10 }, (_, i) => ({
    timestamp: new Date(2026, 0, 10 + i, 9 + (i % 8), 15).toISOString(),
    ip: `192.168.${10 + i}.${100 + i}`,
    device: ['Chrome/Windows', 'Safari/Mac', 'Firefox/Linux'][i % 3],
    status: 'success' as const,
}));

const permissionChangeSeed = Array.from({ length: 5 }, (_, i) => ({
    timestamp: new Date(2025, 11, 1 + i * 5, 11, 30).toISOString(),
    action: ['Added', 'Removed', 'Modified'][i % 3],
    permission: allPermissions[i % allPermissions.length].name,
    by: users[0].name,
}));

export default function UserProfilePage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    const user = users.find(u => u.id === id);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
                <p className="text-muted-foreground mb-4">The requested user could not be found.</p>
                <Button onClick={() => router.push('/superadmin/users')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                </Button>
            </div>
        );
    }

    const userBranch = user.branchId ? getBranchById(user.branchId) : null;
    const sessions = generateSessions();
    const userAuditLogs = auditLogs.filter(log => log.userId === user.id).slice(0, 20);

    // For owners, get all branches they own
    const userBranches = user.role === 'owner' && user.branchId
        ? branches.filter(b => b.managerId === user.id || b.id === user.branchId)
        : userBranch ? [userBranch] : [];

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'superadmin': return 'bg-purple-100 text-purple-700';
            case 'owner': return 'bg-blue-100 text-blue-700';
            case 'manager': return 'bg-green-100 text-green-700';
            case 'staff': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/superadmin/users')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
                <Button>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit User
                </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="branches">Branches</TabsTrigger>
                </TabsList>

                {/* Tab 1: Profile */}
                <TabsContent value="profile" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* User Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                                <CardDescription>Personal and contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.phone}</span>
                                </div>
                                {userBranch && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{userBranch.name}, {userBranch.city}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined: {user.createdAt ? format(new Date(user.createdAt), 'PPP') : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span>Last Login: {user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) : 'Never'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Statistics</CardTitle>
                                <CardDescription>This month&apos;s activity</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Total Logins</span>
                                    <span className="text-2xl font-bold">42</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Actions Performed</span>
                                    <span className="text-2xl font-bold">{userAuditLogs.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Average Session</span>
                                    <span className="text-2xl font-bold">2.5h</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Last 20 actions performed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {userAuditLogs.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <Badge variant="outline" className="capitalize mr-2">{log.action}</Badge>
                                                <span className="text-muted-foreground">on {log.entityType}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{log.ipAddress} • {log.device}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Security */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password & Authentication</CardTitle>
                            <CardDescription>Manage password and security settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Password</p>
                                    <p className="text-sm text-muted-foreground">Last changed 32 days ago</p>
                                </div>
                                <Button variant="outline">
                                    <Key className="mr-2 h-4 w-4" /> Reset Password
                                </Button>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <p className="font-medium">Two-Factor Authentication</p>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Sessions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Sessions</CardTitle>
                            <CardDescription>Manage your active sessions across devices</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {sessions.map((session) => (
                                    <div key={session.id} className="flex items-center justify-between py-3 border-b last:border-0">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">{session.device}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {session.ipAddress} • {session.location}
                                                    {session.isCurrent && <Badge variant="outline" className="ml-2 text-xs">Current</Badge>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                                            </p>
                                            {!session.isCurrent && (
                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                    Revoke
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Session History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Session History</CardTitle>
                            <CardDescription>Last 20 login attempts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {sessionHistorySeed.map((login, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b text-sm">
                                        <div>
                                            <span className="font-medium">{login.device}</span>
                                            <span className="text-muted-foreground ml-2">• {login.ip}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-green-50 text-green-700">Success</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(login.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Permissions */}
                <TabsContent value="permissions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Permission Matrix</CardTitle>
                            <CardDescription>
                                {user.role === 'superadmin'
                                    ? 'SuperAdmins have all permissions by default'
                                    : 'Manage custom permissions for this user'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.role === 'superadmin' ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Shield className="h-16 w-16 text-purple-500 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Full System Access</h3>
                                    <p className="text-muted-foreground">
                                        SuperAdmins have unrestricted access to all features and data
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(
                                        allPermissions.reduce((acc, perm) => {
                                            if (!acc[perm.category]) acc[perm.category] = [];
                                            acc[perm.category].push(perm);
                                            return acc;
                                        }, {} as Record<string, typeof allPermissions>)
                                    ).map(([category, perms]) => (
                                        <div key={category} className="space-y-3">
                                            <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                                            <div className="space-y-2 pl-4">
                                                {perms.map((perm) => (
                                                    <div key={perm.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={perm.id}
                                                            checked={user.permissions?.includes(perm.id) || user.permissions?.includes('all')}
                                                            disabled={user.permissions?.includes('all')}
                                                        />
                                                        <label
                                                            htmlFor={perm.id}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {perm.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t">
                                        <Button>Save Permissions</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Permission Change Audit */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Permission Change History</CardTitle>
                            <CardDescription>Audit trail of permission modifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {permissionChangeSeed.map((change, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b text-sm">
                                        <div>
                                            <Badge variant="outline" className="mr-2">{change.action}</Badge>
                                            <span className="font-medium">{change.permission}</span>
                                            <span className="text-muted-foreground ml-2">by {change.by}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(change.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 4: Branches */}
                <TabsContent value="branches" className="space-y-4">
                    {user.role === 'superadmin' ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Shield className="h-16 w-16 text-purple-500 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Global Access</h3>
                                <p className="text-muted-foreground">
                                    This user has access to all {branches.length} branches in the system
                                </p>
                                <Button variant="outline" className="mt-4" onClick={() => router.push('/superadmin/branches')}>
                                    View All Branches
                                </Button>
                            </CardContent>
                        </Card>
                    ) : userBranches.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <MapPin className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">No Branches Assigned</h3>
                                <p className="text-muted-foreground">This user is not assigned to any branch</p>
                                <Button variant="outline" className="mt-4">Assign Branch</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {userBranches.map((branch) => {
                                const branchRevenue = branch.revenue;
                                const branchOccupancy = branch.occupancy;

                                return (
                                    <Card key={branch.id}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>{branch.name}</CardTitle>
                                                    <CardDescription>{branch.city} • {branch.address}</CardDescription>
                                                </div>
                                                <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                                                    {branch.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Revenue</p>
                                                    <p className="text-2xl font-bold">₹{branchRevenue.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Occupancy</p>
                                                    <p className="text-2xl font-bold">{branchOccupancy}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Capacity</p>
                                                    <p className="text-2xl font-bold">{branch.capacity}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full mt-4"
                                                onClick={() => router.push(`/superadmin/branches/${branch.id}`)}
                                            >
                                                View Branch Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
