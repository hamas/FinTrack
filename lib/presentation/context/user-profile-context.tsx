'use client';

import * as React from 'react';

interface UserProfile {
    name: string;
    username: string;
    avatarUrl: string | null;
    email: string;
    phone: string;
}

interface UserProfileContextType {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultProfile: UserProfile = {
    name: 'Alex Sterling',
    username: '@alexsterling',
    avatarUrl: null,
    email: 'alex.sterling@example.com',
    phone: '+1 (555) 019-2834'
};

const UserProfileContext = React.createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = React.useState<UserProfile>(defaultProfile);

    // Hydrate from localStorage if available (optional for persistence)
    React.useEffect(() => {
        const saved = localStorage.getItem('fintrack_user_profile');
        if (saved) {
            try {
                setProfile(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved profile', e);
            }
        }
    }, []);

    const updateProfile = React.useCallback((updates: Partial<UserProfile>) => {
        setProfile(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem('fintrack_user_profile', JSON.stringify(next));
            return next;
        });
    }, []);

    return (
        <UserProfileContext.Provider value={{ profile, updateProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    const context = React.useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
}
