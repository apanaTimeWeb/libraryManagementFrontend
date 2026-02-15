'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { authService } from '@/lib/auth-service';
import { LoginFormValues, SetupFormValues } from '@/lib/validation/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';

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
    const { setAuth, clearAuth } = useAuthStore();

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
            setAuth(user, 'mock-token-' + user.id);
            toast.success('Successfully logged in');

            // Redirect based on role
            if (user.role === 'superadmin') {
                router.push('/superadmin/dashboard');
            } else if (user.role === 'owner') {
                router.push('/owner/dashboard');
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
            clearAuth();
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
            setAuth(newUser, 'mock-token-' + newUser.id);
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
