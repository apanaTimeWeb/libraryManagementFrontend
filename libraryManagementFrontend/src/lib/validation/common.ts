import { z } from 'zod';

/**
 * Common validation schemas used across multiple forms
 */

// Phone number validation (Indian format)
export const phoneSchema = z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[0-9+\s()-]+$/, 'Invalid phone number format');

// Email validation
export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address');

// GST Number validation (15 characters)
export const gstSchema = z
    .string()
    .length(15, 'GST number must be exactly 15 characters')
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format');

// PAN Number validation (10 characters)
export const panSchema = z
    .string()
    .length(10, 'PAN must be exactly 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format');

// Pincode validation (6 digits)
export const pincodeSchema = z
    .string()
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^[0-9]{6}$/, 'Pincode must contain only numbers');

// Password validation
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@$!%*?&#]/, 'Password must contain at least one special character');

// Name validation
export const nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, dots, hyphens, and apostrophes');

// Address validation
export const addressSchema = z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must not exceed 500 characters');

// URL validation
export const urlSchema = z
    .string()
    .url('Invalid URL format')
    .or(z.literal(''));

// Time validation (HH:MM format)
export const timeSchema = z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)');

// Currency amount validation
export const amountSchema = z
    .number()
    .nonnegative('Amount must be non-negative')
    .or(
        z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format').transform(Number)
    );

// Percentage validation
export const percentageSchema = z
    .number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage must not exceed 100');

// Optional fields helpers
export const optionalPhone = phoneSchema.optional().or(z.literal(''));
export const optionalEmail = emailSchema.optional().or(z.literal(''));
export const optionalGst = gstSchema.optional().or(z.literal(''));
export const optionalPan = panSchema.optional().or(z.literal(''));
export const optionalUrl = urlSchema.optional();
