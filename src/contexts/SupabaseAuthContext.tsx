import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  supabase,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  getDonorById,
  createDonor,
  updateDonor,
  signInWithGoogle,
  Donor
} from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  role: 'hospital' | 'donor' | 'bloodbank';
  email?: string;
  hospitalId?: string;
  bankId?: string;
  location?: string;
  city?: string;
  bloodGroup?: string;
  [key: string]: any;
}

interface SupabaseAuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  donorData: Donor | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  signup: (email: string, password: string, userData: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Donor>) => Promise<void>;
  isAuthenticated: boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [donorData, setDonorData] = useState<Donor | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load donor data from Supabase
  const loadDonorData = async (authUserId: string) => {
    try {
      // First try to get donor by auth_id
      const { data: donors, error } = await supabase
        .from('donors')
        .select('*')
        .eq('auth_id', authUserId)
        .single();

      if (error) {
        console.error('Error loading donor data:', error);
        return null;
      }

      return donors;
    } catch (error) {
      console.error('Error in loadDonorData:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        
        if (error) {
          console.error('Error getting current user:', error);
          setLoading(false);
          return;
        }

        if (currentUser) {
          setSupabaseUser(currentUser);
          
          // Get session token
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setToken(session.access_token);
          }

          // Load donor data
          const donor = await loadDonorData(currentUser.id);
          
          if (donor) {
            setDonorData(donor);
            
            // Update last login
            await updateDonor(donor.id, { last_login: new Date().toISOString() });
            
            // Set user object for compatibility
            setUser({
              id: donor.id,
              name: donor.full_name,
              role: 'donor',
              email: donor.email,
              bloodGroup: donor.blood_type,
              location: donor.location,
              city: donor.city,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          setSupabaseUser(session.user);
          setToken(session.access_token);

          // Load donor data
          let donor = await loadDonorData(session.user.id);

          // If no donor profile exists (e.g., first Google sign in), create one
          if (!donor && session.user.email) {
            const donorData = {
              auth_id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
              email: session.user.email,
              phone: '',
              blood_type: 'O+', // Default blood type
              city: '',
              state: '',
              location: '',
              status: 'active' as const,
              donation_count: 0,
              reputation_score: 0,
            };

            const { data: newDonor, error: createError } = await createDonor(donorData);
            if (createError) {
              console.error('Error creating donor profile:', createError);
              toast({
                title: "Profile Creation Failed",
                description: "Could not create your donor profile. Please try again.",
                variant: "destructive",
              });
              return;
            }
            donor = newDonor;
          }

          if (donor) {
            setDonorData(donor);
            setUser({
              id: donor.id,
              name: donor.full_name,
              role: 'donor',
              email: donor.email,
              bloodGroup: donor.blood_type,
              location: donor.location,
              city: donor.city,
            });

            toast({
              title: "Login Successful! 🎉",
              description: `Welcome${donor.donation_count === 0 ? '' : ' back'}, ${donor.full_name}!`,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSupabaseUser(null);
          setDonorData(null);
          setToken(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: string) => {
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);

      if (error) {
        throw error;
      }

      if (data.user) {
        setSupabaseUser(data.user);
        setToken(data.session?.access_token || null);

        // Load donor data
        const donor = await loadDonorData(data.user.id);
        
        if (donor) {
          setDonorData(donor);
          
          // Update last login
          await updateDonor(donor.id, { last_login: new Date().toISOString() });
          
          setUser({
            id: donor.id,
            name: donor.full_name,
            role: role as any,
            email: donor.email,
            bloodGroup: donor.blood_type,
            location: donor.location,
            city: donor.city,
          });

          toast({
            title: "Login Successful! 🎉",
            description: `Welcome back, ${donor.full_name}!`,
          });
        } else {
          throw new Error('Donor profile not found');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      
      // Sign up with Supabase Auth
      const { data, error } = await signUp(email, password, {
        full_name: userData.name,
        role: userData.role,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create donor profile
        const donorData = {
          auth_id: data.user.id,
          full_name: userData.name,
          email: email,
          phone: userData.phone || '',
          blood_type: userData.bloodGroup || 'O+',
          city: userData.city || '',
          state: userData.state || '',
          location: userData.location || '',
          status: 'active' as const,
          donation_count: 0,
          reputation_score: 0,
        };

        const { data: donor, error: donorError } = await createDonor(donorData);

        if (donorError) {
          console.error('Error creating donor profile:', donorError);
          throw donorError;
        }

        toast({
          title: "Signup Successful! 🎉",
          description: "Please check your email to verify your account.",
        });

        // Auto login after signup
        if (data.session) {
          setSupabaseUser(data.user);
          setToken(data.session.access_token);
          setDonorData(donor);
          setUser({
            id: donor.id,
            name: donor.full_name,
            role: userData.role,
            email: donor.email,
            bloodGroup: donor.blood_type,
            location: donor.location,
            city: donor.city,
          });
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();

      if (error) {
        throw error;
      }

      // Note: Google OAuth will redirect, so we don't need to handle the response here
      // The auth state change listener will handle the login when the user returns
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google Sign In Failed",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;

      setUser(null);
      setSupabaseUser(null);
      setDonorData(null);
      setToken(null);

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });

      // Redirect to landing page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Donor>) => {
    if (!donorData) return;

    try {
      const { data, error } = await updateDonor(donorData.id, updates);
      
      if (error) throw error;

      if (data) {
        setDonorData(data);
        setUser(prev => prev ? {
          ...prev,
          name: data.full_name,
          bloodGroup: data.blood_type,
          location: data.location,
          city: data.city,
        } : null);

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const isAuthenticated = !!user && !!supabaseUser;

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        supabaseUser,
        donorData,
        token,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        isAuthenticated,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  }
  return context;
};