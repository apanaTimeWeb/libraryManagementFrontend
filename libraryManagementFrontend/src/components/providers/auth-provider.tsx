'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { authService } from '@/lib/auth-service';
import { LoginFormValues, SetupFormValues } from '@/lib/validation/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginFormValues) => Promise<void>;
    logout: () => Promise<void>;
    setup: (data: SetupFormValues) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (data: LoginFormValues) => {
        try {
            setIsLoading(true);
            const user = await authService.login(data);
            setUser(user);
            toast.success('Successfully logged in');

            // Redirect based on role
            if (user.role === 'superadmin') {
                router.push('/superadmin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error('Invalid credentials');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            router.push('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const setup = async (data: SetupFormValues) => {
        try {
            setIsLoading(true);
            const newUser = await authService.setupSystem(data);
            setUser(newUser);
            toast.success('System setup complete');
            router.push('/superadmin/dashboard');
        } catch (error) {
            toast.error('Setup failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, setup }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
