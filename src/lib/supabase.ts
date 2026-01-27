import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database Types
export interface Donor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  blood_type: string;
  age?: number;
  gender?: string;
  location?: string;
  city?: string;
  state?: string;
  created_at: string;
  last_login?: string;
  donation_count: number;
  status: 'active' | 'inactive' | 'suspended';
  reputation_score?: number;
}

export interface DonationApplication {
  id: string;
  donor_id: string;
  blood_type: string;
  age: number;
  weight: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  pulse?: string;
  hb?: string;
  bp?: string;
  temperature?: string;
  has_donated_before: boolean;
  last_donation_date?: string;
  medical_conditions?: string;
  recent_procedures?: any;
  diseases?: any;
  medications?: any;
  surgery_history?: any;
  location?: string;
  camp_id?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at?: string;
  reviewed_by?: string;
  review_notes?: string;
}

export interface BloodBank {
  id: string;
  auth_id?: string;
  bank_name: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  state: string;
  created_at: string;
  status: 'active' | 'inactive';
}

export interface Message {
  id: string;
  donor_id: string;
  bank_id?: string;
  message_text: string;
  message_type: 'acceptance' | 'rejection' | 'reminder' | 'general';
  is_read: boolean;
  created_at: string;
}

export interface BloodCamp {
  id: string;
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  date: string;
  time: string;
  bank_id?: string;
  capacity: number;
  registered_count: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Hospital {
  id: string;
  auth_id?: string;
  hospital_name: string;
  email: string;
  phone: string;
  license_number: string;
  registration_number?: string;
  location: string;
  address: string;
  city: string;
  state: string;
  postal_code?: string;
  hospital_type?: string;
  bed_capacity?: number;
  bio?: string;
  website_url?: string;
  emergency_contact?: string;
  created_at: string;
  last_login?: string;
  status: 'active' | 'inactive' | 'suspended';
  verified: boolean;
}

export interface Patient {
  id: string;
  hospital_id: string;
  patient_name: string;
  patient_age: number;
  blood_group: string;
  gender?: string;
  contact_number?: string;
  emergency_contact?: string;
  medical_record_number?: string;
  admission_date: string;
  condition_description?: string;
  urgency_level: 'critical' | 'urgent' | 'normal';
  status: 'active' | 'discharged' | 'transferred';
  created_at: string;
  updated_at?: string;
}

export interface BloodRequest {
  id: string;
  hospital_id: string;
  patient_id: string;
  blood_bank_id?: string;
  blood_group: string;
  units_needed: number;
  units_received: number;
  urgency_level: 'critical' | 'urgent' | 'normal';
  request_status: 'requesting' | 'pending' | 'approved' | 'fulfilled' | 'rejected' | 'cancelled';
  request_type: 'normal' | 'emergency';
  requested_at: string;
  fulfilled_at?: string;
  notes?: string;
  rejection_reason?: string;
  created_by_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface BloodTransaction {
  id: string;
  hospital_id: string;
  patient_id: string;
  blood_bank_id: string;
  blood_request_id?: string;
  patient_name: string;
  blood_group: string;
  units_received: number;
  blood_bank_name: string;
  transaction_date: string;
  received_by?: string;
  notes?: string;
  created_at: string;
}

export interface EmergencyAlert {
  id: string;
  hospital_id: string;
  hospital_name: string;
  blood_group: string;
  units_needed: number;
  urgency_message?: string;
  alert_status: 'active' | 'resolved' | 'cancelled';
  created_at: string;
  resolved_at?: string;
  created_by?: string;
}

export interface Notification {
  id: string;
  recipient_type: 'hospital' | 'blood_bank' | 'donor' | 'all';
  recipient_id?: string;
  sender_type?: 'hospital' | 'blood_bank' | 'donor' | 'system';
  sender_id?: string;
  notification_type: 'emergency_alert' | 'blood_request' | 'request_approved' | 'request_rejected' | 'blood_received' | 'new_connection' | 'general';
  title: string;
  message: string;
  related_id?: string;
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'critical';
  created_at: string;
  read_at?: string;
}

export interface HospitalBloodBankConnection {
  id: string;
  hospital_id: string;
  blood_bank_id: string;
  connection_status: 'active' | 'inactive' | 'pending';
  connected_at: string;
  last_transaction_at?: string;
  total_transactions: number;
}

export interface BloodUnit {
  id: string;
  blood_bank_id: string;
  blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  component_type: 'Whole Blood' | 'Red Blood Cells' | 'Platelets' | 'Plasma' | 'Cryoprecipitate';
  units_available: number;
  initial_units: number;
  collection_date: string;
  expiry_date: string;
  batch_id: string;
  donor_id?: string;
  storage_location: string;
  storage_temperature: number;
  storage_conditions?: string;
  status: 'available' | 'reserved' | 'dispatched' | 'expired' | 'discarded';
  quality_check_passed: boolean;
  quality_check_date?: string;
  quality_check_notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface BloodStockTransaction {
  id: string;
  blood_unit_id: string;
  blood_bank_id: string;
  transaction_type: 'collection' | 'dispatch' | 'reserve' | 'unreserve' | 'expire' | 'discard' | 'return';
  units_affected: number;
  hospital_id?: string;
  patient_id?: string;
  transaction_date: string;
  performed_by?: string;
  notes?: string;
  created_at: string;
}

export interface BloodStockAlert {
  id: string;
  blood_bank_id: string;
  blood_unit_id?: string;
  alert_type: 'expiring_soon' | 'expired' | 'low_stock' | 'critical_stock' | 'quality_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  blood_type?: string;
  message: string;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface BloodStockSummary {
  blood_type: string;
  total_units: number;
  available_units: number;
  reserved_units: number;
  expiring_soon: number;
  expired_units: number;
}

// Helper functions for authentication
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const signInWithGoogle = async (redirectTo?: string) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${window.location.origin}/donor/dashboard`
    }
  });
  return { data, error };
};

// Helper functions for donors
export const createDonor = async (donorData: Partial<Donor>) => {
  const { data, error } = await supabase
    .from('donors')
    .insert([donorData])
    .select()
    .single();
  return { data, error };
};

export const updateDonor = async (donorId: string, updates: Partial<Donor>) => {
  const { data, error } = await supabase
    .from('donors')
    .update(updates)
    .eq('id', donorId)
    .select()
    .single();
  return { data, error };
};

export const getDonorById = async (donorId: string) => {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('id', donorId)
    .single();
  return { data, error };
};

// Helper functions for donation applications
export const createDonationApplication = async (applicationData: Partial<DonationApplication>) => {
  const { data, error } = await supabase
    .from('donation_applications')
    .insert([applicationData])
    .select()
    .single();
  return { data, error };
};

export const getDonationApplications = async (filters?: any) => {
  let query = supabase.from('donation_applications').select('*, donors(*)');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.donor_id) {
    query = query.eq('donor_id', filters.donor_id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const updateDonationApplication = async (
  applicationId: string,
  updates: Partial<DonationApplication>
) => {
  const { data, error } = await supabase
    .from('donation_applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single();
  return { data, error };
};

// Helper functions for messages
export const createMessage = async (messageData: Partial<Message>) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single();
  return { data, error };
};

export const getMessages = async (donorId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('donor_id', donorId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const markMessageAsRead = async (messageId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId)
    .select()
    .single();
  return { data, error };
};

// Helper functions for blood camps
export const getBloodCamps = async () => {
  const { data, error } = await supabase
    .from('blood_camps')
    .select('*')
    .eq('status', 'upcoming')
    .order('date', { ascending: true });
  return { data, error };
};

// Real-time subscriptions
export const subscribeToApplications = (callback: (payload: any) => void) => {
  return supabase
    .channel('donation_applications_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'donation_applications' },
      callback
    )
    .subscribe();
};

export const subscribeToMessages = (donorId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages_${donorId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `donor_id=eq.${donorId}`,
      },
      callback
    )
    .subscribe();
};

// =====================================================
// HOSPITAL HELPER FUNCTIONS
// =====================================================

// Hospital Authentication & Profile
export const createHospital = async (hospitalData: Partial<Hospital>) => {
  const { data, error } = await supabase
    .from('hospitals')
    .insert([hospitalData])
    .select()
    .single();
  return { data, error };
};

export const getHospitalById = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('id', hospitalId)
    .single();
  return { data, error };
};

export const getHospitalByAuthId = async (authId: string) => {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('auth_id', authId)
    .single();
  return { data, error };
};

export const updateHospital = async (hospitalId: string, updates: Partial<Hospital>) => {
  const { data, error } = await supabase
    .from('hospitals')
    .update(updates)
    .eq('id', hospitalId)
    .select()
    .single();
  return { data, error };
};

// Patient Management
export const createPatient = async (patientData: Partial<Patient>) => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single();
  return { data, error };
};

export const getPatientsByHospital = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('hospital_id', hospitalId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updatePatient = async (patientId: string, updates: Partial<Patient>) => {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', patientId)
    .select()
    .single();
  return { data, error };
};

// Blood Request Management
export const createBloodRequest = async (requestData: Partial<BloodRequest>) => {
  const { data, error } = await supabase
    .from('blood_requests')
    .insert([requestData])
    .select()
    .single();
  return { data, error };
};

export const getBloodRequestsByHospital = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from('blood_requests')
    .select(`
      *,
      patients (*),
      blood_banks (bank_name, phone, location)
    `)
    .eq('hospital_id', hospitalId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateBloodRequest = async (requestId: string, updates: Partial<BloodRequest>) => {
  const { data, error } = await supabase
    .from('blood_requests')
    .update(updates)
    .eq('id', requestId)
    .select()
    .single();
  return { data, error };
};

// Blood Transactions (Patient Records)
export const getBloodTransactionsByHospital = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from('blood_transactions')
    .select('*')
    .eq('hospital_id', hospitalId)
    .order('transaction_date', { ascending: false });
  return { data, error };
};

// Emergency Alerts
export const createEmergencyAlert = async (alertData: Partial<EmergencyAlert>) => {
  const { data, error } = await supabase
    .from('emergency_alerts')
    .insert([alertData])
    .select()
    .single();
  return { data, error };
};

export const getEmergencyAlertsByHospital = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from('emergency_alerts')
    .select('*')
    .eq('hospital_id', hospitalId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateEmergencyAlert = async (alertId: string, updates: Partial<EmergencyAlert>) => {
  const { data, error } = await supabase
    .from('emergency_alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single();
  return { data, error };
};

// Notifications
export const getNotificationsByRecipient = async (recipientType: string, recipientId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`recipient_type.eq.${recipientType},recipient_type.eq.all`)
    .or(`recipient_id.eq.${recipientId},recipient_id.is.null`)
    .order('created_at', { ascending: false })
    .limit(50);
  return { data, error };
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single();
  return { data, error };
};

export const markAllNotificationsAsRead = async (recipientType: string, recipientId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('recipient_type', recipientType)
    .eq('recipient_id', recipientId)
    .eq('is_read', false);
  return { data, error };
};

// Hospital-Blood Bank Connections
export const getHospitalConnections = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from('hospital_blood_bank_connections')
    .select(`
      *,
      blood_banks (*)
    `)
    .eq('hospital_id', hospitalId)
    .eq('connection_status', 'active')
    .order('connected_at', { ascending: false });
  return { data, error };
};

export const getAllBloodBanks = async () => {
  const { data, error } = await supabase
    .from('blood_banks')
    .select('*')
    .eq('status', 'active')
    .order('bank_name', { ascending: true });
  return { data, error };
};

export const createBloodBank = async (bloodBankData: Partial<BloodBank>) => {
  const { data, error } = await supabase
    .from('blood_banks')
    .insert([bloodBankData])
    .select()
    .single();
  return { data, error };
};

export const getBloodBankByAuthId = async (authId: string) => {
  const { data, error } = await supabase
    .from('blood_banks')
    .select('*')
    .eq('auth_id', authId)
    .single();
  return { data, error };
};

export const updateBloodBank = async (bloodBankId: string, updates: Partial<BloodBank>) => {
  const { data, error } = await supabase
    .from('blood_banks')
    .update(updates)
    .eq('id', bloodBankId)
    .select()
    .single();
  return { data, error };
};

// Dashboard Statistics
export const getHospitalDashboardStats = async (hospitalId: string) => {
  // Get total patients
  const { data: patients, error: patientsError } = await supabase
    .from('patients')
    .select('id', { count: 'exact' })
    .eq('hospital_id', hospitalId)
    .eq('status', 'active');

  // Get active blood requests
  const { data: requests, error: requestsError } = await supabase
    .from('blood_requests')
    .select('id', { count: 'exact' })
    .eq('hospital_id', hospitalId)
    .in('request_status', ['requesting', 'pending', 'approved']);

  // Get connected blood banks
  const { data: connections, error: connectionsError } = await supabase
    .from('hospital_blood_bank_connections')
    .select('id', { count: 'exact' })
    .eq('hospital_id', hospitalId)
    .eq('connection_status', 'active');

  // Get total blood units received
  const { data: transactions, error: transactionsError } = await supabase
    .from('blood_transactions')
    .select('units_received')
    .eq('hospital_id', hospitalId);

  const totalUnits = transactions?.reduce((sum, t) => sum + t.units_received, 0) || 0;

  return {
    totalPatients: patients?.length || 0,
    activeRequests: requests?.length || 0,
    connectedBloodBanks: connections?.length || 0,
    totalUnitsReceived: totalUnits,
    errors: {
      patientsError,
      requestsError,
      connectionsError,
      transactionsError,
    },
  };
};

// =====================================================
// BLOOD STOCK MANAGEMENT FUNCTIONS
// =====================================================

// Get all blood units for a blood bank
export const getBloodUnits = async (bloodBankId: string) => {
  const { data, error } = await supabase
    .from('blood_units')
    .select('*')
    .eq('blood_bank_id', bloodBankId)
    .order('expiry_date', { ascending: true });
  return { data, error };
};

// Get blood units by status
export const getBloodUnitsByStatus = async (bloodBankId: string, status: string) => {
  const { data, error } = await supabase
    .from('blood_units')
    .select('*')
    .eq('blood_bank_id', bloodBankId)
    .eq('status', status)
    .order('expiry_date', { ascending: true });
  return { data, error };
};

// Create a new blood unit
export const createBloodUnit = async (unitData: Partial<BloodUnit>) => {
  const { data, error } = await supabase
    .from('blood_units')
    .insert([unitData])
    .select()
    .single();
  return { data, error };
};

// Update blood unit
export const updateBloodUnit = async (unitId: string, updates: Partial<BloodUnit>) => {
  const { data, error } = await supabase
    .from('blood_units')
    .update(updates)
    .eq('id', unitId)
    .select()
    .single();
  return { data, error };
};

// Delete blood unit
export const deleteBloodUnit = async (unitId: string) => {
  const { error } = await supabase
    .from('blood_units')
    .delete()
    .eq('id', unitId);
  return { error };
};

// Get blood stock summary
export const getBloodStockSummary = async (bloodBankId: string) => {
  const { data, error } = await supabase
    .rpc('get_blood_stock_summary', { bank_id: bloodBankId });
  return { data, error };
};

// Get blood stock transactions
export const getBloodStockTransactions = async (bloodBankId: string, limit: number = 50) => {
  const { data, error } = await supabase
    .from('blood_stock_transactions')
    .select('*')
    .eq('blood_bank_id', bloodBankId)
    .order('transaction_date', { ascending: false })
    .limit(limit);
  return { data, error };
};

// Create blood stock transaction
export const createBloodStockTransaction = async (transactionData: Partial<BloodStockTransaction>) => {
  const { data, error } = await supabase
    .from('blood_stock_transactions')
    .insert([transactionData])
    .select()
    .single();
  return { data, error };
};

// Get blood stock alerts
export const getBloodStockAlerts = async (bloodBankId: string, includeResolved: boolean = false) => {
  let query = supabase
    .from('blood_stock_alerts')
    .select('*')
    .eq('blood_bank_id', bloodBankId);

  if (!includeResolved) {
    query = query.eq('is_resolved', false);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

// Resolve blood stock alert
export const resolveBloodStockAlert = async (alertId: string, resolvedBy: string, resolutionNotes?: string) => {
  const { data, error } = await supabase
    .from('blood_stock_alerts')
    .update({
      is_resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: resolvedBy,
      resolution_notes: resolutionNotes
    })
    .eq('id', alertId)
    .select()
    .single();
  return { data, error };
};

// Calculate days until expiry (client-side helper)
export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if blood unit is expiring soon (within 7 days)
export const isExpiringSoon = (expiryDate: string): boolean => {
  const daysLeft = calculateDaysUntilExpiry(expiryDate);
  return daysLeft > 0 && daysLeft <= 7;
};

// Check if blood unit is expired
export const isExpired = (expiryDate: string): boolean => {
  return calculateDaysUntilExpiry(expiryDate) < 0;
};

// Get expiry status color
export const getExpiryStatusColor = (expiryDate: string): 'green' | 'yellow' | 'red' => {
  const daysLeft = calculateDaysUntilExpiry(expiryDate);
  if (daysLeft < 0) return 'red'; // Expired
  if (daysLeft <= 7) return 'yellow'; // Expiring soon
  return 'green'; // Safe
};

// Subscribe to blood units changes (real-time)
export const subscribeToBloodUnits = (bloodBankId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`blood_units_${bloodBankId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blood_units',
        filter: `blood_bank_id=eq.${bloodBankId}`,
      },
      callback
    )
    .subscribe();
};

// Subscribe to blood stock alerts (real-time)
export const subscribeToBloodStockAlerts = (bloodBankId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`blood_stock_alerts_${bloodBankId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blood_stock_alerts',
        filter: `blood_bank_id=eq.${bloodBankId}`,
      },
      callback
    )
    .subscribe();
};

// Subscribe to blood stock transactions (real-time)
export const subscribeToBloodStockTransactions = (bloodBankId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`blood_stock_transactions_${bloodBankId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'blood_stock_transactions',
        filter: `blood_bank_id=eq.${bloodBankId}`,
      },
      callback
    )
    .subscribe();
};

// Real-time Subscriptions for Hospitals
export const subscribeToNotifications = (recipientType: string, recipientId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`notifications_${recipientType}_${recipientId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${recipientId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToBloodRequests = (hospitalId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`blood_requests_${hospitalId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blood_requests',
        filter: `hospital_id=eq.${hospitalId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToEmergencyAlerts = (callback: (payload: any) => void) => {
  return supabase
    .channel('emergency_alerts_all')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'emergency_alerts',
      },
      callback
    )
    .subscribe();
};