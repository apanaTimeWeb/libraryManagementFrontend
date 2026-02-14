'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Menu, Building, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { useSocketForNotifications } from '@/lib/socket-client';

export function Topbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // Initialize socket connection for real-time notifications
    useSocketForNotifications();

    if (!user) return null;

    const pathSegments = pathname.split('/').filter(Boolean);

    return (
        <header className="flex h-16 items-center border-b bg-white px-6 dark:border-slate-800 dark:bg-gray-950">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger (Hidden on Desktop for now) */}
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Breadcrumbs */}
                <nav className="hidden md:flex items-center text-sm text-muted-foreground">
                    <Link href="/dashboard" className="hover:text-foreground">Home</Link>
                    {pathSegments.map((segment, index) => (
                        <div key={index} className="flex items-center">
                            <span className="mx-2">/</span>
                            <span className="capitalize text-foreground">{segment.replace(/-/g, ' ')}</span>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="ml-auto flex items-center gap-4">
                {/* Branch Switcher (Mock) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                            <Building className="h-4 w-4" />
                            <span>{user.branchId ? 'My Branch' : 'All Branches'}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delhi Main</DropdownMenuItem>
                        <DropdownMenuItem>Mumbai Branch</DropdownMenuItem>
                        <DropdownMenuItem>Bangalore</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search students, enquiries..."
                        className="w-64 pl-9"
                    />
                </div>

                {/* Notifications */}
                <NotificationDropdown />

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(user.role === 'superadmin' ? `/superadmin/users/${user.id}` : `/dashboard/profile`)}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(user.role === 'superadmin' ? '/superadmin/settings' : '/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
