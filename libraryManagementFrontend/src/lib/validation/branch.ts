import { z } from 'zod';
import {
    nameSchema,
    phoneSchema,
    emailSchema,
    gstSchema,
    panSchema,
    addressSchema,
    pincodeSchema,
    amountSchema,
    timeSchema,
} from './common';

/**
 * Branch validation schemas
 */

// Shift timing schema
export const shiftTimingSchema = z.object({
    start: timeSchema,
    end: timeSchema,
}).refine(
    (data) => {
        const [startH, startM] = data.start.split(':').map(Number);
        const [endH, endM] = data.end.split(':').map(Number);
        return startH * 60 + startM < endH * 60 + endM;
    },
    { message: 'End time must be after start time', path: ['end'] }
);

// Branch basic info schema (Step 1)
export const branchBasicInfoSchema = z.object({
    name: z
        .string()
        .min(3, 'Branch name must be at least 3 characters')
        .max(100, 'Branch name must not exceed 100 characters')
        .regex(/^[a-zA-Z0-9\s-]+$/, 'Branch name can only contain letters, numbers, spaces, and hyphens'),
    city: z.string().min(1, 'City is required'),
    address: addressSchema,
    pincode: pincodeSchema,
});

// Branch contact & legal schema (Step 2)
export const branchContactLegalSchema = z.object({
    phone: phoneSchema,
    email: emailSchema,
    ownerName: nameSchema,
    gstNumber: gstSchema.optional().or(z.literal('')),
    panNumber: panSchema.optional().or(z.literal('')),
});

// Branch configuration schema (Step 3)
export const branchConfigurationSchema = z.object({
    totalCapacity: z
        .number()
        .int('Capacity must be a whole number')
        .min(10, 'Minimum capacity is 10 seats')
        .max(1000, 'Maximum capacity is 1000 seats'),
    acSeats: z
        .number()
        .int('AC seats must be a whole number')
        .min(0, 'AC seats cannot be negative')
        .optional(),
    nonAcSeats: z
        .number()
        .int('Non-AC seats must be a whole number')
        .min(0, 'Non-AC seats cannot be negative')
        .optional(),
    monthlyRent: z.number().nonnegative('Monthly rent must be non-negative'),
    securityDeposit: z.number().nonnegative('Security deposit must be non-negative').optional(),
    operationalSince: z.string().optional(),
}).refine(
    (data) => {
        if (data.acSeats !== undefined && data.nonAcSeats !== undefined) {
            return data.acSeats + data.nonAcSeats <= data.totalCapacity;
        }
        return true;
    },
    {
        message: 'AC + Non-AC seats cannot exceed total capacity',
        path: ['totalCapacity'],
    }
);

// Branch manager assignment schema (Step 4)
export const branchManagerSchema = z.object({
    managerId: z.string().optional(),
});

// Branch default settings schema (Step 5)
export const branchDefaultSettingsSchema = z.object({
    morningShift: shiftTimingSchema.optional(),
    eveningShift: shiftTimingSchema.optional(),
    defaultPlanId: z.string().optional(),
    allowWaitlist: z.boolean().optional(),
    requireSecurityDeposit: z.boolean().optional(),
    lateFeePerDay: z.number().nonnegative('Late fee must be non-negative').optional(),
});

// Combined create branch schema (all steps)
export const createBranchSchema = branchBasicInfoSchema
    .merge(branchContactLegalSchema)
    .merge(branchConfigurationSchema)
    .merge(branchManagerSchema)
    .merge(branchDefaultSettingsSchema);

// Edit branch schema (all fields optional except id)
export const editBranchSchema = z.object({
    id: z.string().min(1, 'Branch ID is required'),
    name: branchBasicInfoSchema.shape.name.optional(),
    city: z.string().optional(),
    address: addressSchema.optional(),
    pincode: pincodeSchema.optional(),
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
    ownerName: nameSchema.optional(),
    gstNumber: gstSchema.optional().or(z.literal('')),
    panNumber: panSchema.optional().or(z.literal('')),
    totalCapacity: z.number().int().min(10).max(1000).optional(),
    acSeats: z.number().int().min(0).optional(),
    nonAcSeats: z.number().int().min(0).optional(),
    monthlyRent: z.number().nonnegative().optional(),
    securityDeposit: z.number().nonnegative().optional(),
    managerId: z.string().optional(),
    morningShift: shiftTimingSchema.optional(),
    eveningShift: shiftTimingSchema.optional(),
    defaultPlanId: z.string().optional(),
    allowWaitlist: z.boolean().optional(),
    requireSecurityDeposit: z.boolean().optional(),
    lateFeePerDay: z.number().nonnegative().optional(),
});

// Deactivate branch schema
export const deactivateBranchSchema = z.object({
    id: z.string().min(1, 'Branch ID is required'),
    reason: z.enum(['closed', 'relocated', 'poor_performance', 'other']),
    reasonNotes: z.string().min(10, 'Please provide detailed notes (minimum 10 characters)'),
    migrateStudentsTo: z.string().optional(),
    archiveData: z.boolean().optional(),
});

// Branch filter schema
export const branchFilterSchema = z.object({
    status: z.enum(['all', 'active', 'inactive']).default('all'),
    city: z.string().optional(),
    managerId: z.string().optional(),
    dateRange: z
        .object({
            from: z.date(),
            to: z.date(),
        })
        .optional(),
    search: z.string().optional(),
});

// Type exports
export type BranchBasicInfo = z.infer<typeof branchBasicInfoSchema>;
export type BranchContactLegal = z.infer<typeof branchContactLegalSchema>;
export type BranchConfiguration = z.infer<typeof branchConfigurationSchema>;
export type BranchManager = z.infer<typeof branchManagerSchema>;
export type BranchDefaultSettings = z.infer<typeof branchDefaultSettingsSchema>;
export type CreateBranchFormData = z.infer<typeof createBranchSchema>;
export type EditBranchFormData = z.infer<typeof editBranchSchema>;
export type DeactivateBranchFormData = z.infer<typeof deactivateBranchSchema>;
export type BranchFilter = z.infer<typeof branchFilterSchema>;
