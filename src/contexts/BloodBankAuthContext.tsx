import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    supabase,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    createBloodBank,
    getBloodBankByAuthId,
    updateBloodBank,
    signInWithGoogle as apiSignInWithGoogle,
    BloodBank,
} from '@/lib/supabase';

interface BloodBankAuthContextType {
    bloodBank: BloodBank | null;
    loading: boolean;
    signUpBloodBank: (email: string, password: string, bloodBankData: Partial<BloodBank>) => Promise<void>;
    signInBloodBank: (email: string, password: string) => Promise<void>;
    signOutBloodBank: () => Promise<void>;
    updateBloodBankProfile: (updates: Partial<BloodBank>) => Promise<void>;
    refreshBloodBank: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const BloodBankAuthContext = createContext<BloodBankAuthContextType | undefined>(undefined);

export const useBloodBankAuth = () => {
    const context = useContext(BloodBankAuthContext);
    if (!context) {
        throw new Error('useBloodBankAuth must be used within BloodBankAuthProvider');
    }
    return context;
};

interface BloodBankAuthProviderProps {
    children: React.ReactNode;
}

export const BloodBankAuthProvider: React.FC<BloodBankAuthProviderProps> = ({ children }) => {
    const [bloodBank, setBloodBank] = useState<BloodBank | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        checkUser();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await loadBloodBankProfile(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                setBloodBank(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        try {
            const { user, error } = await getCurrentUser();
            if (error) throw error;

            if (user) {
                await loadBloodBankProfile(user.id);
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBloodBankProfile = async (authId: string) => {
        try {
            const { data, error } = await getBloodBankByAuthId(authId);
            if (error) throw error;

            if (data) {
                setBloodBank(data);
            }
        } catch (error) {
            console.error('Error loading blood bank profile:', error);
            // Don't toast here as it might be a different user type (e.g. Hospital)
        }
    };

    const signUpBloodBank = async (email: string, password: string, bloodBankData: Partial<BloodBank>) => {
        try {
            setLoading(true);

            // Create auth user
            const { data: authData, error: authError } = await signUp(email, password, {
                user_type: 'blood_bank',
                bank_name: bloodBankData.bank_name,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('Failed to create user');

            // Create blood bank profile
            const { data: bloodBankProfile, error: bloodBankError } = await createBloodBank({
                ...bloodBankData,
                auth_id: authData.user.id,
                email,
                status: 'active',
                created_at: new Date().toISOString(),
            });

            if (bloodBankError) throw bloodBankError;

            setBloodBank(bloodBankProfile);
            toast.success(`Welcome to Vital Drop, ${bloodBankData.bank_name}! 🩸`);
        } catch (error: any) {
            console.error('Signup error:', error);
            toast.error(error.message || 'Failed to create blood bank account');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signInBloodBank = async (email: string, password: string) => {
        try {
            setLoading(true);

            const { data, error } = await signIn(email, password);
            if (error) throw error;
            if (!data.user) throw new Error('Login failed');

            await loadBloodBankProfile(data.user.id);

            if (bloodBank) {
                toast.success(`Welcome back, ${bloodBank.bank_name}! 🩸`);
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid email or password');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOutBloodBank = async () => {
        try {
            const { error } = await signOut();
            if (error) throw error;

            setBloodBank(null);
            toast.success('Logged out successfully');
        } catch (error: any) {
            console.error('Logout error:', error);
            toast.error('Failed to log out');
            throw error;
        }
    };

    const updateBloodBankProfile = async (updates: Partial<BloodBank>) => {
        if (!bloodBank) {
            toast.error('No blood bank profile found');
            return;
        }

        try {
            const { data, error } = await updateBloodBank(bloodBank.id, updates);
            if (error) throw error;

            setBloodBank(data);
            toast.success('Profile updated successfully');
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error('Failed to update profile');
            throw error;
        }
    };

    const refreshBloodBank = async () => {
        if (!bloodBank) return;

        try {
            const { data, error } = await getBloodBankByAuthId(bloodBank.auth_id!); // Assuming ID is linked via auth_id
            if (error) throw error;
            if (data) setBloodBank(data);
        } catch (error) {
            console.error('Error refreshing blood bank:', error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            const { error } = await apiSignInWithGoogle(`${window.location.origin}/bloodbank/dashboard`);
            if (error) throw error;
            // Redirect is handled by Supabase OAuth
        } catch (error: any) {
            console.error('Google login error:', error);
            toast.error(error.message || 'Failed to sign in with Google');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value: BloodBankAuthContextType = {
        bloodBank,
        loading,
        signUpBloodBank,
        signInBloodBank,
        signOutBloodBank,
        updateBloodBankProfile,
        refreshBloodBank,
        signInWithGoogle,
    };

    return <BloodBankAuthContext.Provider value={value}>{children}</BloodBankAuthContext.Provider>;
};
