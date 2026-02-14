'use client';

import { useEffect, useCallback } from 'react';
import { useNotificationStore } from '@/lib/stores/notification-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useRealTimeNotifications() {
  const { user } = useAuthStore();
  const { addNotification, markAsRead } = useNotificationStore();

  const connectSocket = useCallback(() => {
    if (!user || socket?.connected) return;

    // Connect to Socket.io server (mock for now)
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId: user.id,
        role: user.role,
      },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    // Listen for new notifications
    socket.on('notification', (notification: any) => {
      addNotification({
        id: notification.id || `notif-${Date.now()}`,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        read: false,
        timestamp: notification.timestamp || new Date().toISOString(),
      });

      // Show toast for important notifications
      if (notification.type === 'urgent' || notification.type === 'warning') {
        toast.warning(notification.title, {
          description: notification.message,
        });
      } else {
        toast.info(notification.title, {
          description: notification.message,
        });
      }
    });

    // Listen for audit log updates
    socket.on('audit:new', (log: any) => {
      console.log('📝 New audit log:', log);
      // You can update audit log store here
    });

    // Listen for branch updates
    socket.on('branch:updated', (data: any) => {
      console.log('🏢 Branch updated:', data);
      toast.info('Branch Updated', {
        description: `${data.branchName} has been updated`,
      });
    });

    // Listen for user updates
    socket.on('user:updated', (data: any) => {
      console.log('👤 User updated:', data);
    });

    socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    return socket;
  }, [user, addNotification]);

  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }, []);

  const emitEvent = useCallback((event: string, data: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, []);

  useEffect(() => {
    if (user) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, connectSocket, disconnectSocket]);

  return {
    isConnected: socket?.connected || false,
    emitEvent,
    socket,
  };
}

// Mock notification generator for testing
export function useMockNotifications() {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    // Simulate random notifications every 30 seconds
    const interval = setInterval(() => {
      const types = ['info', 'warning', 'urgent', 'announcement'] as const;
      const titles = [
        'New Student Admission',
        'Payment Received',
        'Seat Expiring Soon',
        'System Maintenance',
        'New Enquiry',
      ];
      const messages = [
        'A new student has been admitted to your branch',
        'Payment of ₹1,200 received from John Doe',
        '5 seats are expiring in the next 3 days',
        'System maintenance scheduled for tonight',
        'New enquiry from walk-in customer',
      ];

      const randomIndex = Math.floor(Math.random() * titles.length);

      addNotification({
        id: `mock-${Date.now()}`,
        title: titles[randomIndex],
        message: messages[randomIndex],
        type: types[Math.floor(Math.random() * types.length)],
        read: false,
        timestamp: new Date().toISOString(),
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);
}
