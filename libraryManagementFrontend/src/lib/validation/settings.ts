import { z } from 'zod';
import { emailSchema, urlSchema } from './common';

/**
 * Settings validation schemas for all 6 tabs
 */

// General Settings Schema
export const generalSettingsSchema = z.object({
    systemName: z
        .string()
        .min(3, 'System name must be at least 3 characters')
        .max(100, 'System name must not exceed 100 characters'),
    currency: z.string().min(1, 'Currency is required'),
    dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'], {
        errorMap: () => ({ message: 'Please select a valid date format' }),
    }),
    timezone: z.string().min(1, 'Timezone is required'),
    supportEmail: emailSchema,
    supportPhone: z
        .string()
        .min(10, 'Support phone must be at least 10 digits')
        .regex(/^[0-9+\s()-]+$/, 'Invalid phone number format'),
    language: z.string().default('en'),
});

// Security & Access Settings Schema
export const securitySettingsSchema = z.object({
    // Password Policy
    minPasswordLength: z
        .number()
        .int()
        .min(6, 'Minimum password length must be at least 6')
        .max(32, 'Minimum password length cannot exceed 32'),
    requireUppercase: z.boolean().default(true),
    requireNumbers: z.boolean().default(true),
    requireSpecialChars: z.boolean().default(true),
    maxPasswordAge: z
        .number()
        .int()
        .min(0, 'Password age cannot be negative')
        .max(365, 'Password age cannot exceed 365 days')
        .optional(),

    // Session Management
    sessionTimeout: z
        .number()
        .int()
        .min(5, 'Session timeout must be at least 5 minutes')
        .max(1440, 'Session timeout cannot exceed 24 hours (1440 minutes)'),
    maxConcurrentSessions: z
        .number()
        .int()
        .min(1, 'Must allow at least 1 session')
        .max(10, 'Cannot exceed 10 concurrent sessions'),
    enable2FA: z.boolean().default(false),

    // IP Whitelist
    ipWhitelist: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val || val.trim() === '') return true;
                const ips = val.split(',').map(ip => ip.trim());
                const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
                return ips.every(ip => ipRegex.test(ip));
            },
            { message: 'Invalid IP address format. Use comma-separated IPs (e.g., 192.168.1.1, 10.0.0.1)' }
        ),

    // Account Lockout
    maxFailedAttempts: z
        .number()
        .int()
        .min(3, 'Must allow at least 3 attempts')
        .max(10, 'Cannot exceed 10 attempts'),
    lockoutDuration: z
        .number()
        .int()
        .min(5, 'Lockout duration must be at least 5 minutes')
        .max(1440, 'Lockout duration cannot exceed 24 hours'),
});

// Billing & Subscription Settings Schema
export const billingSettingsSchema = z.object({
    // Payment Gateways
    enableRazorpay: z.boolean().default(false),
    razorpayKeyId: z.string().optional(),
    razorpayKeySecret: z.string().optional(),

    enablePayU: z.boolean().default(false),
    payuMerchantKey: z.string().optional(),
    payuMerchantSalt: z.string().optional(),

    // Invoice Settings
    invoicePrefix: z
        .string()
        .min(2, 'Invoice prefix must be at least 2 characters')
        .max(10, 'Invoice prefix cannot exceed 10 characters')
        .regex(/^[A-Z0-9-]+$/, 'Invoice prefix can only contain uppercase letters, numbers, and hyphens'),
    taxRate: z
        .number()
        .min(0, 'Tax rate cannot be negative')
        .max(100, 'Tax rate cannot exceed 100%'),
    autoSendInvoice: z.boolean().default(true),
    invoiceFooterText: z.string().max(500, 'Footer text cannot exceed 500 characters').optional(),

    // Late Fees
    enableLateFees: z.boolean().default(false),
    lateFeeAmount: z.number().min(0, 'Late fee amount cannot be negative').optional(),
    lateFeeGracePeriod: z.number().int().min(0, 'Grace period cannot be negative').optional(),
}).refine(
    (data) => {
        // If Razorpay is enabled, keys are required
        if (data.enableRazorpay) {
            return !!(data.razorpayKeyId && data.razorpayKeySecret);
        }
        return true;
    },
    {
        message: 'Razorpay API keys are required when Razorpay is enabled',
        path: ['razorpayKeyId'],
    }
).refine(
    (data) => {
        // If PayU is enabled, credentials are required
        if (data.enablePayU) {
            return !!(data.payuMerchantKey && data.payuMerchantSalt);
        }
        return true;
    },
    {
        message: 'PayU credentials are required when PayU is enabled',
        path: ['payuMerchantKey'],
    }
);

// Communication Settings Schema
export const communicationSettingsSchema = z.object({
    // Email Settings (SMTP)
    smtpHost: z.string().min(1, 'SMTP host is required').optional(),
    smtpPort: z
        .number()
        .int()
        .min(1, 'Port must be greater than 0')
        .max(65535, 'Port must not exceed 65535')
        .optional(),
    smtpUsername: z.string().optional(),
    smtpPassword: z.string().optional(),
    smtpFromEmail: emailSchema.optional(),
    smtpFromName: z.string().optional(),
    smtpSecure: z.boolean().default(true),

    // SMS Settings
    smsProvider: z.enum(['twilio', 'msg91', 'none']).default('none'),
    twilioAccountSid: z.string().optional(),
    twilioAuthToken: z.string().optional(),
    twilioPhoneNumber: z.string().optional(),
    msg91AuthKey: z.string().optional(),
    msg91SenderId: z.string().optional(),

    // WhatsApp Business API
    enableWhatsApp: z.boolean().default(false),
    whatsappBusinessId: z.string().optional(),
    whatsappAccessToken: z.string().optional(),
    whatsappPhoneNumber: z.string().optional(),
});

// Backup & Maintenance Settings Schema
export const backupSettingsSchema = z.object({
    // Auto Backup
    enableAutoBackup: z.boolean().default(true),
    backupFrequency: z.enum(['hourly', 'daily', 'weekly'], {
        errorMap: () => ({ message: 'Please select a valid backup frequency' }),
    }).default('daily'),
    backupRetentionDays: z
        .number()
        .int()
        .min(1, 'Must retain backups for at least 1 day')
        .max(365, 'Cannot retain backups for more than 365 days')
        .default(30),

    // Backup Storage
    backupStorageProvider: z.enum(['local', 's3', 'google-cloud', 'azure']).default('local'),
    s3BucketName: z.string().optional(),
    s3AccessKey: z.string().optional(),
    s3SecretKey: z.string().optional(),

    // Maintenance Mode
    maintenanceMode: z.boolean().default(false),
    maintenanceMessage: z
        .string()
        .max(500, 'Maintenance message cannot exceed 500 characters')
        .optional(),
    scheduledMaintenanceDate: z.string().optional(), // ISO date string
});

// Advanced Features Settings Schema
export const advancedSettingsSchema = z.object({
    // Experimental Features
    enableAIAssistant: z.boolean().default(false),
    enableBiometricAttendance: z.boolean().default(false),
    enableMobileApp: z.boolean().default(false),
    enableFamilyPhoneSharing: z.boolean().default(false),
    enableTrustScoreAlgorithm: z.boolean().default(false),
    enableAutomatedFollowUps: z.boolean().default(false),
    enableAdvancedAnalytics: z.boolean().default(false),

    // API & Webhooks
    apiEnabled: z.boolean().default(false),
    apiKey: z.string().optional(),
    webhookUrl: urlSchema.optional(),
    webhookEvents: z.array(z.string()).optional(),

    // Developer Options
    enableDebugMode: z.boolean().default(false),
    logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    enablePerformanceMonitoring: z.boolean().default(false),
});

// Combined all settings schema
export const allSettingsSchema = z.object({
    general: generalSettingsSchema,
    security: securitySettingsSchema,
    billing: billingSettingsSchema,
    communication: communicationSettingsSchema,
    backup: backupSettingsSchema,
    advanced: advancedSettingsSchema,
});

// Type exports
export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type SecuritySettings = z.infer<typeof securitySettingsSchema>;
export type BillingSettings = z.infer<typeof billingSettingsSchema>;
export type CommunicationSettings = z.infer<typeof communicationSettingsSchema>;
export type BackupSettings = z.infer<typeof backupSettingsSchema>;
export type AdvancedSettings = z.infer<typeof advancedSettingsSchema>;
export type AllSettings = z.infer<typeof allSettingsSchema>;

// Default settings values
export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
    systemName: 'Smart Library 360',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata',
    supportEmail: 'support@smartlibrary360.com',
    supportPhone: '+91 9876543210',
    language: 'en',
};

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxPasswordAge: 90,
    sessionTimeout: 120,
    maxConcurrentSessions: 3,
    enable2FA: false,
    ipWhitelist: '',
    maxFailedAttempts: 5,
    lockoutDuration: 30,
};

export const DEFAULT_BILLING_SETTINGS: BillingSettings = {
    enableRazorpay: false,
    enablePayU: false,
    invoicePrefix: 'INV',
    taxRate: 18,
    autoSendInvoice: true,
    enableLateFees: false,
};

export const DEFAULT_BACKUP_SETTINGS: BackupSettings = {
    enableAutoBackup: true,
    backupFrequency: 'daily',
    backupRetentionDays: 30,
    backupStorageProvider: 'local',
    maintenanceMode: false,
};
