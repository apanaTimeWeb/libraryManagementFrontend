'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificationStore } from '@/lib/stores/notification-store';
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
    const router = useRouter();
    const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotificationStore();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = filter === 'unread' 
        ? notifications.filter(n => !n.read)
        : notifications;

    const getIcon = (type: string) => {
        switch (type) {
            case 'info': return <Info className="h-5 w-5 text-blue-500" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
            default: return <Bell className="h-5 w-5" />;
        }
    };

    const handleNotificationClick = (notification: typeof notifications[0]) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            router.push(notification.link);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">
                        {notifications.filter(n => !n.read).length} unread notifications
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                        <CheckCheck className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Mark All Read</span>
                        <span className="sm:hidden">Mark Read</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAll}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Clear All</span>
                        <span className="sm:hidden">Clear</span>
                    </Button>
                </div>
            </div>

            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
                <TabsList>
                    <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                    <TabsTrigger value="unread">Unread ({notifications.filter(n => !n.read).length})</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6">
                    {filteredNotifications.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No notifications</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {filteredNotifications.map((notification) => (
                                <Card 
                                    key={notification.id}
                                    className={`cursor-pointer transition-colors hover:bg-accent ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <CardContent className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4">
                                        <div className="mt-1 shrink-0">{getIcon(notification.type)}</div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <h3 className="font-semibold break-words">{notification.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    {!notification.read && (
                                                        <Badge variant="default" className="h-5">New</Badge>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notification.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground break-words">{notification.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
