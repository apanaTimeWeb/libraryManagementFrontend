import { z } from 'zod';
import { nameSchema, phoneSchema, emailSchema, passwordSchema } from './common';

/**
 * User validation schemas
 */

// Available user roles
export const userRoleSchema = z.enum(['superadmin', 'owner', 'manager', 'staff'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
});

// Available permissions
export const permissionSchema = z.enum([
    'view_dashboard',
    'view_students',
    'create_student',
    'edit_student',
    'delete_student',
    'view_payments',
    'create_payment',
    'edit_payment',
    'delete_payment',
    'view_enquiries',
    'create_enquiry',
    'edit_enquiry',
    'delete_enquiry',
    'view_staff',
    'create_staff',
    'edit_staff',
    'delete_staff',
    'view_reports',
    'export_reports',
    'view_settings',
    'edit_settings',
    'view_audit_logs',
    'manage_branches',
    'manage_plans',
    'manage_coupons',
    'send_notifications',
    'manage_assets',
    'view_complaints',
    'resolve_complaints',
]);

// User basic info schema (Step 1)
export const userBasicInfoSchema = z.object({
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// User role & permissions schema (Step 2)
export const userRolePermissionsSchema = z.object({
    role: userRoleSchema,
    permissions: z.array(permissionSchema).min(1, 'At least one permission is required'),
});

// User branch assignment schema (Step 3)
export const userBranchAssignmentSchema = z.object({
    branchId: z.string().optional(), // Optional for superadmin
}).superRefine((data, ctx) => {
    // Branch assignment is required for non-superadmin roles
    // This will be validated in the form based on selected role
    return true;
});

// User review schema (Step 4)
export const userReviewSchema = z.object({
    sendWelcomeEmail: z.boolean().optional(),
    requirePasswordReset: z.boolean().optional(),
});

// Combined create user schema (all steps)
export const createUserSchema = z.object({
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: userRoleSchema,
    permissions: z.array(permissionSchema).min(1),
    branchId: z.string().optional(),
    sendWelcomeEmail: z.boolean().optional(),
    requirePasswordReset: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
}).refine((data) => {
    // SuperAdmin doesn't need branch assignment
    if (data.role === 'superadmin') return true;
    // Other roles require branch assignment
    return !!data.branchId;
}, {
    message: 'Branch assignment is required for this role',
    path: ['branchId'],
});

// Edit user schema (all fields optional except id)
export const editUserSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
    name: nameSchema.optional(),
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(), // Only if changing password
    confirmPassword: z.string().optional(),
    role: userRoleSchema.optional(),
    permissions: z.array(permissionSchema).optional(),
    branchId: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
}).refine((data) => {
    // If password is provided, confirmPassword must match
    if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

// Reset password schema
export const resetPasswordSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    newPassword: passwordSchema.optional(), // Optional if auto-generating
    autoGenerate: z.boolean().optional(),
    sendEmail: z.boolean().optional(),
    forceChangeOnNextLogin: z.boolean().optional(),
}).refine((data) => {
    // Either auto-generate or provide new password
    return data.autoGenerate || (data.newPassword && data.newPassword.length > 0);
}, {
    message: 'Either enable auto-generate or provide a new password',
    path: ['newPassword'],
});

// User filter schema
export const userFilterSchema = z.object({
    role: z.enum(['all', 'superadmin', 'owner', 'manager', 'staff']).default('all'),
    status: z.enum(['all', 'active', 'inactive']).default('all'),
    branchId: z.string().optional(),
    search: z.string().optional(),
});

// Update permissions schema
export const updatePermissionsSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    permissions: z.array(permissionSchema).min(1, 'At least one permission is required'),
});

// Type exports
export type UserRole = z.infer<typeof userRoleSchema>;
export type Permission = z.infer<typeof permissionSchema>;
export type UserBasicInfo = z.infer<typeof userBasicInfoSchema>;
export type UserRolePermissions = z.infer<typeof userRolePermissionsSchema>;
export type UserBranchAssignment = z.infer<typeof userBranchAssignmentSchema>;
export type UserReview = z.infer<typeof userReviewSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;
export type UpdatePermissionsFormData = z.infer<typeof updatePermissionsSchema>;

// Default permissions by role
export const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
    superadmin: [
        'view_dashboard',
        'view_students',
        'create_student',
        'edit_student',
        'delete_student',
        'view_payments',
        'create_payment',
        'edit_payment',
        'delete_payment',
        'view_enquiries',
        'create_enquiry',
        'edit_enquiry',
        'delete_enquiry',
        'view_staff',
        'create_staff',
        'edit_staff',
        'delete_staff',
        'view_reports',
        'export_reports',
        'view_settings',
        'edit_settings',
        'view_audit_logs',
        'manage_branches',
        'manage_plans',
        'manage_coupons',
        'send_notifications',
        'manage_assets',
        'view_complaints',
        'resolve_complaints',
    ],
    owner: [
        'view_dashboard',
        'view_students',
        'create_student',
        'edit_student',
        'view_payments',
        'create_payment',
        'edit_payment',
        'view_enquiries',
        'create_enquiry',
        'edit_enquiry',
        'view_staff',
        'create_staff',
        'edit_staff',
        'view_reports',
        'export_reports',
        'view_settings',
        'edit_settings',
        'manage_plans',
        'manage_coupons',
        'send_notifications',
        'manage_assets',
        'view_complaints',
        'resolve_complaints',
    ],
    manager: [
        'view_dashboard',
        'view_students',
        'create_student',
        'edit_student',
        'view_payments',
        'create_payment',
        'edit_payment',
        'view_enquiries',
        'create_enquiry',
        'edit_enquiry',
        'view_staff',
        'view_reports',
        'export_reports',
        'send_notifications',
        'view_complaints',
        'resolve_complaints',
    ],
    staff: [
        'view_dashboard',
        'view_students',
        'create_student',
        'edit_student',
        'view_payments',
        'create_payment',
        'view_enquiries',
        'create_enquiry',
        'view_complaints',
    ],
};
