import axios from 'axios';
import {
  mockAuthAPI,
  mockHospitalAPI,
  mockDonorAPI,
  mockBloodBankAPI,
  mockStatsAPI,
  mockEmergencyAPI,
  mockUtilityAPI,
} from './mockApi';

// Check if mock mode is enabled
const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

// Base API URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log mock mode status
if (IS_MOCK_MODE) {
  console.log('🎭 Mock Mode Enabled - Using mock data without backend');
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// AUTHENTICATION APIs
// ============================================================================

export const authAPI = IS_MOCK_MODE ? mockAuthAPI : {
  // Hospital Authentication
  hospitalSignup: async (data: {
    name: string;
    location: string;
    hospitalId: string;
    password: string;
    contactEmail: string;
    contactPhone: string;
  }) => {
    const response = await api.post('/auth/hospital/signup', data);
    return response.data;
  },

  hospitalLogin: async (data: { hospitalId: string; password: string }) => {
    const response = await api.post('/auth/hospital/login', data);
    return response.data;
  },

  // Donor Authentication
  donorSignup: async (data: {
    name: string;
    email: string;
    phone: string;
    bloodGroup: string;
    lastDonationDate?: string;
    city: string;
  }) => {
    const response = await api.post('/auth/donor/signup', data);
    return response.data;
  },

  donorVerifyOTP: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/donor/verify-otp', data);
    return response.data;
  },

  donorLogin: async (data: { email: string }) => {
    const response = await api.post('/auth/donor/login', data);
    return response.data;
  },

  // Blood Bank Authentication
  bloodBankSignup: async (formData: FormData) => {
    const response = await api.post('/auth/bloodbank/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  bloodBankVerifyOTP: async (data: { bankId: string; otp: string }) => {
    const response = await api.post('/auth/bloodbank/verify-otp', data);
    return response.data;
  },

  bloodBankLogin: async (data: { bankId: string; password: string }) => {
    const response = await api.post('/auth/bloodbank/login', data);
    return response.data;
  },

  // Patient Authentication
  patientSignup: async (data: {
    name: string;
    email: string;
    phone: string;
    age: number;
    bloodGroup: string;
    city: string;
    location: string;
    password: string;
    emergencyContact?: string;
  }) => {
    const response = await api.post('/auth/patient/signup', data);
    return response.data;
  },

  patientVerifyOTP: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/patient/verify-otp', data);
    return response.data;
  },

  patientLogin: async (data: { email: string }) => {
    const response = await api.post('/auth/patient/login', data);
    return response.data;
  },
};

// ============================================================================
// HOSPITAL APIs
// ============================================================================

export const hospitalAPI = IS_MOCK_MODE ? mockHospitalAPI : {
  getDashboard: async (hospitalId: string) => {
    const response = await api.get(`/hospitals/${hospitalId}/dashboard`);
    return response.data;
  },

  addPatient: async (
    hospitalId: string,
    data: {
      name: string;
      age: number;
      roomNumber: string;
      caseDescription: string;
      bloodType: string;
      unitsRequired: number;
    }
  ) => {
    const response = await api.post(`/hospitals/${hospitalId}/patients`, data);
    return response.data;
  },

  getPatients: async (hospitalId: string) => {
    const response = await api.get(`/hospitals/${hospitalId}/patients`);
    return response.data;
  },

  updatePatient: async (
    hospitalId: string,
    patientId: string,
    data: { unitsReceived?: number; status?: string }
  ) => {
    const response = await api.patch(
      `/hospitals/${hospitalId}/patients/${patientId}`,
      data
    );
    return response.data;
  },

  deletePatient: async (hospitalId: string, patientId: string) => {
    const response = await api.delete(
      `/hospitals/${hospitalId}/patients/${patientId}`
    );
    return response.data;
  },

  createEmergency: async (
    hospitalId: string,
    data: {
      bloodType: string;
      unitsNeeded: number;
      urgencyLevel?: string;
      expiresAt?: string;
    }
  ) => {
    const response = await api.post(`/hospitals/${hospitalId}/emergency`, data);
    return response.data;
  },

  getEmergencyStatus: async (hospitalId: string) => {
    const response = await api.get(`/hospitals/${hospitalId}/emergency-status`);
    return response.data;
  },
};

// ============================================================================
// DONOR APIs
// ============================================================================

export const donorAPI = IS_MOCK_MODE ? mockDonorAPI : {
  getProfile: async (donorId: string) => {
    const response = await api.get(`/donors/${donorId}/profile`);
    return response.data;
  },

  updateProfile: async (
    donorId: string,
    data: {
      phone?: string;
      city?: string;
      lastDonationDate?: string;
      isAvailable?: boolean;
    }
  ) => {
    const response = await api.patch(`/donors/${donorId}/profile`, data);
    return response.data;
  },

  getNearbyEmergencies: async (donorId: string, city?: string) => {
    const params = city ? { city } : {};
    const response = await api.get(`/donors/${donorId}/nearby-emergencies`, {
      params,
    });
    return response.data;
  },

  respondToEmergency: async (
    donorId: string,
    data: {
      emergencyId: string;
      unitsPledged: number;
    }
  ) => {
    const response = await api.post(`/donors/${donorId}/respond`, data);
    return response.data;
  },

  getHistory: async (donorId: string) => {
    const response = await api.get(`/donors/${donorId}/history`);
    return response.data;
  },
};

// ============================================================================
// BLOOD BANK APIs
// ============================================================================

export const bloodBankAPI = IS_MOCK_MODE ? mockBloodBankAPI : {
  getDashboard: async (bloodBankId: string) => {
    const response = await api.get(`/bloodbanks/${bloodBankId}/dashboard`);
    return response.data;
  },

  addPreservation: async (
    bloodBankId: string,
    data: {
      bloodType: string;
      units: number;
      collectionDate: string;
      expiryDate: string;
      storageLocation?: string;
    }
  ) => {
    const response = await api.post(
      `/bloodbanks/${bloodBankId}/preservation`,
      data
    );
    return response.data;
  },

  getPreservation: async (bloodBankId: string) => {
    const response = await api.get(`/bloodbanks/${bloodBankId}/preservation`);
    return response.data;
  },

  updatePreservation: async (
    bloodBankId: string,
    preservationId: string,
    data: { units?: number; status?: string }
  ) => {
    const response = await api.patch(
      `/bloodbanks/${bloodBankId}/preservation/${preservationId}`,
      data
    );
    return response.data;
  },

  createDispatch: async (
    bloodBankId: string,
    data: {
      preservationId: string;
      hospitalId: string;
      unitsDispatched: number;
      emergencyId?: string;
    }
  ) => {
    const response = await api.post(`/bloodbanks/${bloodBankId}/dispatch`, data);
    return response.data;
  },

  getSendRecords: async (bloodBankId: string) => {
    const response = await api.get(`/bloodbanks/${bloodBankId}/send-records`);
    return response.data;
  },

  updateSendRecord: async (
    bloodBankId: string,
    sendRecordId: string,
    data: { status: string }
  ) => {
    const response = await api.patch(
      `/bloodbanks/${bloodBankId}/send-records/${sendRecordId}`,
      data
    );
    return response.data;
  },

  createEmergency: async (
    bloodBankId: string,
    data: {
      bloodType: string;
      unitsNeeded: number;
      urgencyLevel?: string;
      expiresAt?: string;
    }
  ) => {
    const response = await api.post(`/bloodbanks/${bloodBankId}/emergency`, data);
    return response.data;
  },

  // Blood Bank - Patient Blood Requests
  getBloodRequests: async (bloodBankId: string) => {
    const response = await api.get(`/bloodbanks/${bloodBankId}/blood-requests`);
    return response.data;
  },

  acceptBloodRequest: async (bloodBankId: string, requestId: string) => {
    const response = await api.post(
      `/bloodbanks/${bloodBankId}/blood-requests/${requestId}/accept`
    );
    return response.data;
  },
};

// ============================================================================
// PATIENT APIs
// ============================================================================

export const patientAPI = {
  getProfile: async (patientId: string) => {
    const response = await api.get(`/patients/${patientId}`);
    return response.data;
  },

  updateProfile: async (
    patientId: string,
    data: {
      name?: string;
      phone?: string;
      age?: number;
      bloodGroup?: string;
      city?: string;
      location?: string;
      emergencyContact?: string;
    }
  ) => {
    const response = await api.put(`/patients/${patientId}`, data);
    return response.data;
  },

  createBloodRequest: async (
    patientId: string,
    data: {
      bloodGroup: string;
      unitsNeeded: number;
      urgencyLevel: string;
      hospitalPreference?: string;
      additionalNotes?: string;
    }
  ) => {
    const response = await api.post(`/patients/${patientId}/blood-request`, data);
    return response.data;
  },

  getBloodRequests: async (patientId: string) => {
    const response = await api.get(`/patients/${patientId}/blood-requests`);
    return response.data;
  },

  cancelBloodRequest: async (patientId: string, requestId: string) => {
    const response = await api.put(
      `/patients/${patientId}/blood-request/${requestId}/cancel`
    );
    return response.data;
  },

  getNearbyBloodBanks: async (patientId: string) => {
    const response = await api.get(`/patients/${patientId}/nearby-bloodbanks`);
    return response.data;
  },
};

// ============================================================================
// STATISTICS APIs
// ============================================================================

export const statsAPI = IS_MOCK_MODE ? mockStatsAPI : {
  getOverview: async () => {
    const response = await api.get('/stats/overview');
    return response.data;
  },

  getCityStats: async (city: string) => {
    const response = await api.get(`/stats/city/${city}`);
    return response.data;
  },
};

// ============================================================================
// EMERGENCY APIs
// ============================================================================

export const emergencyAPI = IS_MOCK_MODE ? mockEmergencyAPI : {
  getLatest: async () => {
    const response = await api.get('/emergencies/latest');
    return response.data;
  },
};

// ============================================================================
// UTILITY APIs
// ============================================================================

export const utilityAPI = IS_MOCK_MODE ? mockUtilityAPI : {
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  seedDatabase: async () => {
    const response = await api.post('/seed');
    return response.data;
  },

  clearDatabase: async () => {
    const response = await api.delete('/seed');
    return response.data;
  },
};

export default api;