'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth-service';
import { SetupForm } from '@/components/forms/setup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

export default function SetupPage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [canSetup, setCanSetup] = useState(false);

    useEffect(() => {
        const check = async () => {
            try {
                const { firstUser } = await authService.checkFirstUser();
                if (!firstUser) {
                    router.push('/login');
                } else {
                    setCanSetup(true);
                }
            } catch (error) {
                router.push('/login');
            } finally {
                setChecking(false);
            }
        };
        check();
    }, [router]);

    if (checking) {
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    if (!canSetup) {
        return null;
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <Card className="w-full max-w-[600px] shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Rocket className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">System Initialization</CardTitle>
                    <CardDescription>
                        Create the first Super Admin account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SetupForm />
                </CardContent>
            </Card>
        </div>
    );
}
