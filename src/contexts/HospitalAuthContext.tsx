import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  createHospital,
  getHospitalByAuthId,
  updateHospital,
  signInWithGoogle as apiSignInWithGoogle,
  Hospital,
} from '@/lib/supabase';

interface HospitalAuthContextType {
  hospital: Hospital | null;
  loading: boolean;
  signUpHospital: (email: string, password: string, hospitalData: Partial<Hospital>) => Promise<void>;
  signInHospital: (email: string, password: string) => Promise<void>;
  signOutHospital: () => Promise<void>;
  updateHospitalProfile: (updates: Partial<Hospital>) => Promise<void>;
  refreshHospital: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const HospitalAuthContext = createContext<HospitalAuthContextType | undefined>(undefined);

export const useHospitalAuth = () => {
  const context = useContext(HospitalAuthContext);
  if (!context) {
    throw new Error('useHospitalAuth must be used within HospitalAuthProvider');
  }
  return context;
};

interface HospitalAuthProviderProps {
  children: React.ReactNode;
}

export const HospitalAuthProvider: React.FC<HospitalAuthProviderProps> = ({ children }) => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadHospitalProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setHospital(null);
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
        await loadHospitalProfile(user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHospitalProfile = async (authId: string) => {
    try {
      const { data, error } = await getHospitalByAuthId(authId);
      if (error) throw error;

      if (data) {
        setHospital(data);

        // Update last login
        await updateHospital(data.id, { last_login: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error loading hospital profile:', error);
      toast.error('Failed to load hospital profile');
    }
  };

  const signUpHospital = async (email: string, password: string, hospitalData: Partial<Hospital>) => {
    try {
      setLoading(true);

      // Create auth user
      const { data: authData, error: authError } = await signUp(email, password, {
        user_type: 'hospital',
        hospital_name: hospitalData.hospital_name,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create hospital profile
      const { data: hospitalProfile, error: hospitalError } = await createHospital({
        ...hospitalData,
        auth_id: authData.user.id,
        email,
        status: 'active',
        verified: false,
        created_at: new Date().toISOString(),
      });

      if (hospitalError) throw hospitalError;

      setHospital(hospitalProfile);
      toast.success(`Welcome to Vital Drop, ${hospitalData.hospital_name}! 🏥`);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create hospital account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInHospital = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await signIn(email, password);
      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      await loadHospitalProfile(data.user.id);

      if (hospital) {
        toast.success(`Welcome back, ${hospital.hospital_name}! 🏥`);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutHospital = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;

      setHospital(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      throw error;
    }
  };

  const updateHospitalProfile = async (updates: Partial<Hospital>) => {
    if (!hospital) {
      toast.error('No hospital profile found');
      return;
    }

    try {
      const { data, error } = await updateHospital(hospital.id, updates);
      if (error) throw error;

      setHospital(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const refreshHospital = async () => {
    if (!hospital) return;

    try {
      const { data, error } = await getHospitalByAuthId(hospital.auth_id!);
      if (error) throw error;
      if (data) setHospital(data);
    } catch (error) {
      console.error('Error refreshing hospital:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await apiSignInWithGoogle(`${window.location.origin}/hospital/dashboard`);
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: HospitalAuthContextType = {
    hospital,
    loading,
    signUpHospital,
    signInHospital,
    signOutHospital,
    updateHospitalProfile,
    refreshHospital,
    signInWithGoogle,
  };

  return <HospitalAuthContext.Provider value={value}>{children}</HospitalAuthContext.Provider>;
};