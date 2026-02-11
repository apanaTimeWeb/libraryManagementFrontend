'use client';

import { useNotificationStore } from '@/lib/stores/notification-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            title="Mark all as read"
                            onClick={(e) => {
                                e.stopPropagation();
                                markAllAsRead();
                            }}
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            title="Clear all"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearAll();
                            }}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${notification.read ? 'opacity-60' : 'bg-muted/50'}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <span className={`font-medium text-sm ${getNodeColor(notification.type)}`}>
                                        {notification.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer justify-center text-center font-medium">
                    <Link href="/notifications">View all notifications</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function getNodeColor(type: string) {
    switch (type) {
        case 'success': return 'text-green-600';
        case 'warning': return 'text-yellow-600';
        case 'critical': return 'text-red-600';
        default: return 'text-foreground';
    }
}
