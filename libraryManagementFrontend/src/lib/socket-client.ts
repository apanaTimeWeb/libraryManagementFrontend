'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/lib/stores/notification-store';
import { toast } from 'sonner';

// Mock Socket Client
class MockSocket {
    private handlers: { [key: string]: Function[] } = {};
    private connected = false;

    connect() {
        this.connected = true;
        console.log('Mock Socket connected');
        this.startSimulation();
    }

    disconnect() {
        this.connected = false;
        console.log('Mock Socket disconnected');
        this.stopSimulation();
    }

    on(event: string, handler: Function) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    }

    off(event: string, handler: Function) {
        if (!this.handlers[event]) return;
        this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }

    emit(event: string, data: any) {
        if (this.handlers[event]) {
            this.handlers[event].forEach(handler => handler(data));
        }
    }

    private intervalId: NodeJS.Timeout | null = null;

    private startSimulation() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            const events = [
                {
                    type: 'notification',
                    data: {
                        title: 'New Student Admission',
                        message: 'Amit Kumar joined Delhi Branch',
                        type: 'success',
                        timestamp: new Date(),
                    }
                },
                {
                    type: 'notification',
                    data: {
                        title: 'Payment Received',
                        message: 'Received ₹1500 from Priya Singh',
                        type: 'info',
                        timestamp: new Date(),
                    }
                },
                {
                    type: 'notification',
                    data: {
                        title: 'High Occupancy Alert',
                        message: 'Mumbai Branch reached 90% capacity',
                        type: 'warning',
                        timestamp: new Date(),
                    }
                },
                {
                    type: 'notification',
                    data: {
                        title: 'System Alert',
                        message: 'Scheduled maintenance in 10 mins',
                        type: 'critical',
                        timestamp: new Date(),
                    }
                }
            ];

            // 30% chance to trigger an event every 30 seconds
            if (Math.random() < 0.3) {
                const event = events[Math.floor(Math.random() * events.length)];
                this.emit(event.type, event.data);
            }

        }, 10000); // Check every 10 seconds
    }

    private stopSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

export const socket = new MockSocket();

export function useSocketForNotifications() {
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        socket.connect();

        const handleNotification = (data: any) => {
            // Add to store
            addNotification({
                title: data.title,
                message: data.message,
                type: data.type,
                link: '/dashboard/notifications' // basic link
            });

            // Show toast
            toast(data.title, {
                description: data.message,
                action: {
                    label: 'View',
                    onClick: () => console.log('View notification')
                }
            });
        };

        socket.on('notification', handleNotification);

        return () => {
            socket.off('notification', handleNotification);
            socket.disconnect();
        };
    }, [addNotification]);
}
