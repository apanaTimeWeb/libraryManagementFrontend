'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    forgotPasswordRequestSchema,
    resetPasswordSchema,
    ForgotPasswordRequestValues,
    ResetPasswordValues,
} from '@/lib/validation/auth';
import { authService } from '@/lib/auth-service';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ForgotPasswordForm() {
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const router = useRouter();

    // Form 1: Request OTP
    const requestForm = useForm<ForgotPasswordRequestValues>({
        resolver: zodResolver(forgotPasswordRequestSchema),
        defaultValues: {
            phone: '',
        },
    });

    // Form 2: Reset Password
    const resetForm = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            phone: '',
            otp: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    async function onRequestSubmit(data: ForgotPasswordRequestValues) {
        try {
            setIsLoading(true);
            await authService.requestPasswordReset(data);
            setPhoneNumber(data.phone);
            // Pre-fill phone in second form
            resetForm.setValue('phone', data.phone);
            setStep(2);
            toast.success('OTP sent successfully');
        } catch (error) {
            toast.error('Failed to send OTP. Try again.');
        } finally {
            setIsLoading(false);
        }
    }

    async function onResetSubmit(data: ResetPasswordValues) {
        try {
            setIsLoading(true);
            await authService.resetPassword(data);
            toast.success('Password reset successfully. Please login.');
            router.push('/login');
        } catch (error) {
            toast.error('Failed to reset password. Check OTP.');
        } finally {
            setIsLoading(false);
        }
    }

    if (step === 1) {
        return (
            <Form {...requestForm}>
                <form
                    onSubmit={requestForm.handleSubmit(onRequestSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={requestForm.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+919876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending OTP...
                            </>
                        ) : (
                            'Send OTP'
                        )}
                    </Button>
                    <div className="text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>
                </form>
            </Form>
        );
    }

    return (
        <Form {...resetForm}>
            <form
                onSubmit={resetForm.handleSubmit(onResetSubmit)}
                className="space-y-6"
            >
                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-200">
                    <p className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        OTP sent to {phoneNumber}
                    </p>
                </div>

                <FormField
                    control={resetForm.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter 6-digit OTP</FormLabel>
                            <FormControl>
                                <div className="flex gap-2">
                                    {/* Simplified OTP input for now, usually use Input OTP component */}
                                    <Input placeholder="123456" maxLength={6} className="text-center tracking-widest text-lg" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="New secure password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Confirm new password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting...
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>

                <div className="text-center">
                    <Button variant="link" size="sm" onClick={() => setStep(1)} type="button">
                        Change Phone Number
                    </Button>
                </div>
            </form>
        </Form>
    );
}
