
import { User } from './types/index';
import { users } from './mockData';
import { LoginFormValues, ForgotPasswordRequestValues, ResetPasswordValues, SetupFormValues } from './validation/auth';

const STORAGE_KEY = 'smart_library_user';

export const authService = {
    login: async (data: LoginFormValues): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(
                    (u) => (u.email === data.identifier || u.phone === data.identifier) && 'Admin@123' === data.password // Mock password check
                );

                if (user) {
                    if (data.rememberMe) {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                    } else {
                        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                    }
                    resolve(user);
                } else {
                    // Fallback for demo purposes if specific user not found in mock data list but want to allow generic entry
                    if (data.password === 'Admin@123') {
                        // Return first superadmin
                        resolve(users[0]);
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }
            }, 1000);
        });
    },

    logout: async () => {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        return Promise.resolve();
    },

    getCurrentUser: async (): Promise<User | null> => {
        // Check local or session storage
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    requestPasswordReset: async (data: ForgotPasswordRequestValues): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
        });
    },

    resetPassword: async (data: ResetPasswordValues): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
        });
    },

    checkFirstUser: async (): Promise<{ firstUser: boolean }> => {
        return new Promise((resolve) => {
            // Mock logic: if mock users array is empty (which it isn't), return true.
            // For setup page testing, we can force this to true manually or via a debug flag.
            // For now, let's say false as we have mock users.
            setTimeout(() => resolve({ firstUser: false }), 500);
        });
    },

    setupSystem: async (data: SetupFormValues): Promise<User> => {
        return new Promise((resolve) => {
            const newUser: User = {
                id: 'usr-new-sa',
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: 'superadmin',
                permissions: ['all'],
                isActive: true,
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
            setTimeout(() => resolve(newUser), 1500);
        });
    }
};
