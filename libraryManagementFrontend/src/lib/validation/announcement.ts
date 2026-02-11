import { z } from 'zod';
import { emailSchema } from './common';

/**
 * Announcement validation schema
 */

export const sendAnnouncementSchema = z.object({
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must not exceed 200 characters'),

    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message must not exceed 2000 characters'),

    targetAudience: z.enum(['all', 'branch', 'role', 'custom'], {
        errorMap: () => ({ message: 'Please select a target audience' }),
    }),

    targetBranchId: z.string().optional(),
    targetRole: z.enum(['superadmin', 'owner', 'manager', 'staff']).optional(),
    targetUserIds: z.array(z.string()).optional(),

    channels: z.array(z.enum(['email', 'sms', 'whatsapp', 'in-app'])).min(1, 'Select at least one channel'),

    scheduleType: z.enum(['immediate', 'scheduled']).default('immediate'),
    scheduledDate: z.string().optional(), // ISO date string
    scheduledTime: z.string().optional(), // HH:MM format

    priority: z.enum(['low', 'medium', 'high']).default('medium'),

    allowReplies: z.boolean().default(false),
}).refine((data) => {
    // If target is branch, branchId is required
    if (data.targetAudience === 'branch') {
        return !!data.targetBranchId;
    }
    return true;
}, {
    message: 'Please select a branch',
    path: ['targetBranchId'],
}).refine((data) => {
    // If target is role, role is required
    if (data.targetAudience === 'role') {
        return !!data.targetRole;
    }
    return true;
}, {
    message: 'Please select a role',
    path: ['targetRole'],
}).refine((data) => {
    // If target is custom, userIds are required
    if (data.targetAudience === 'custom') {
        return data.targetUserIds && data.targetUserIds.length > 0;
    }
    return true;
}, {
    message: 'Please select at least one user',
    path: ['targetUserIds'],
}).refine((data) => {
    // If scheduled, date and time are required
    if (data.scheduleType === 'scheduled') {
        return !!data.scheduledDate && !!data.scheduledTime;
    }
    return true;
}, {
    message: 'Please provide scheduled date and time',
    path: ['scheduledDate'],
});

export type SendAnnouncementFormData = z.infer<typeof sendAnnouncementSchema>;
