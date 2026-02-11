import { z } from 'zod';

export const loginSchema = z.object({
    identifier: z.string().min(1, 'Email or Phone is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean(),
    deviceInfo: z.any().optional(),
});

export const forgotPasswordRequestSchema = z.object({
    phone: z.string().min(10, 'Valid phone number is required'),
});

export const resetPasswordSchema = z
    .object({
        phone: z.string(),
        otp: z.string().length(6, 'OTP must be 6 digits'),
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export const setupSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        phone: z.string().min(10, 'Valid phone number is required'),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordRequestValues = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type SetupFormValues = z.infer<typeof setupSchema>;
