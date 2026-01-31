// Mock API Service - Returns mock data without backend connection
import {
  mockHospitals,
  mockDonors,
  mockBloodBanks,
  mockEmergencyRequests,
  type Patient,
  type Donor,
  type BloodBank,
  type EmergencyRequest
} from '@/data/mockData';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response wrapper
const mockResponse = async <T,>(data: T, delayMs: number = 300) => {
  await delay(delayMs);
  return { data, success: true };
};

// ============================================================================
// AUTHENTICATION APIs (MOCK)
// ============================================================================

export const mockAuthAPI = {
  // Hospital Authentication
  hospitalSignup: async (data: {
    name: string;
    location: string;
    hospitalId: string;
    password: string;
    contactEmail: string;
    contactPhone: string;
  }) => {
    await delay(500);
    // Parse city from location (e.g., "Salem, TN" -> "Salem")
    const city = data.location.split(',')[0].trim();
    return {
      success: true,
      message: 'Hospital registered successfully',
      hospital: {
        id: 'mock-hospital-' + Date.now(),
        name: data.name,
        role: 'hospital',
        hospitalId: data.hospitalId,
        location: data.location,
        city: city,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        stats: {
          totalRequests: 0,
          activeRequests: 0,
          fulfilledRequests: 0,
          pendingRequests: 0,
        },
      },
      token: 'mock-token-' + Date.now(),
    };
  },

  hospitalLogin: async (data: { hospitalId: string; password: string }) => {
    await delay(500);
    const hospital = mockHospitals[0];
    return {
      success: true,
      message: 'Login successful',
      hospital: {
        id: hospital.id,
        name: hospital.name,
        role: 'hospital',
        hospitalId: hospital.hospitalId,
        location: hospital.location,
      },
      token: 'mock-token-' + Date.now(),
    };
  },

  // Donor Authentication
  donorSignup: async (data: {
    name: string;
    email: string;
    phone: string;
    bloodGroup: string;
    age?: number;
    lastDonationDate?: string;
    city: string;
    password?: string;
  }) => {
    await delay(500);
    return {
      success: true,
      message: 'Donor registered successfully',
      donor: {
        id: 'mock-donor-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        bloodGroup: data.bloodGroup,
        bloodType: data.bloodGroup, // Add both for compatibility
        city: data.city,
        age: data.age,
        role: 'donor',
        lastDonationDate: data.lastDonationDate || null,
        availability: true,
        reputation: 100,
      },
      token: 'mock-token-' + Date.now(),
    };
  },

  donorVerifyOTP: async (data: { email: string; otp: string }) => {
    await delay(500);
    const donor = mockDonors[0];
    return {
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: donor.id,
        name: donor.name,
        role: 'donor',
        email: donor.email,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
        phone: donor.phone,
      },
      token: 'mock-token-' + Date.now(),
    };
  },

  donorLogin: async (data: { email: string; password?: string }) => {
    await delay(500);
    const donor = mockDonors[0];
    return {
      success: true,
      message: 'Login successful',
      donor: {
        id: donor.id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup,
        bloodType: donor.bloodGroup, // Add both for compatibility
        city: donor.city,
        role: 'donor',
        lastDonationDate: donor.lastDonationDate,
        availability: donor.availability,
        reputation: donor.reputation,
      },
      token: 'mock-token-' + Date.now(),
    };
  },

  // Blood Bank Authentication
  bloodBankSignup: async (data: {
    name: string;
    location: string;
    bloodBankId: string;
    password: string;
    contactEmail: string;
    contactPhone: string;
  }) => {
    await delay(500);
    return {
      success: true,
      message: 'Blood bank registered successfully',
      bloodBank: {
        id: 'mock-bb-' + Date.now(),
        name: data.name,
        bloodBankId: data.bloodBankId,
        location: data.location,
        city: data.location.split(',')[0].trim(),
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        role: 'bloodbank',
      },
      token: 'mock-token-' + Date.now(),
    };
  },

  bloodBankVerifyOTP: async (data: { bankId: string; otp: string }) => {
    await delay(500);
    const bloodBank = mockBloodBanks[0];
    return {
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: bloodBank.id,
        name: bloodBank.name,
        role: 'bloodbank',
        bankId: bloodBank.bankId,
        location: bloodBank.location,
        ownerName: bloodBank.ownerName,
      },
      token: 'mock-token-' + Date.now(),
    };
  },

  bloodBankLogin: async (data: { bloodBankId: string; password: string }) => {
    await delay(500);
    const bloodBank = mockBloodBanks[0];
    return {
      success: true,
      message: 'Login successful',
      bloodBank: {
        id: bloodBank.id,
        name: bloodBank.name,
        bloodBankId: bloodBank.bankId,
        location: bloodBank.location,
        city: bloodBank.location.split(',')[0].trim(),
        contactEmail: bloodBank.contactEmail || 'contact@bloodbank.com',
        contactPhone: bloodBank.contactPhone || '+1-555-0100',
        role: 'bloodbank',
      },
      token: 'mock-token-' + Date.now(),
    };
  },
};

// ============================================================================
// HOSPITAL APIs (MOCK)
// ============================================================================

export const mockHospitalAPI = {
  getDashboard: async (hospitalId: string) => {
    const hospital = mockHospitals[0];
    return mockResponse({
      hospital: {
        id: hospital.id,
        name: hospital.name,
        location: hospital.location,
        hospitalId: hospital.hospitalId,
        totalDonorsConnected: hospital.totalDonorsConnected,
        totalBloodUnitsReceived: hospital.totalBloodUnitsReceived,
        urgentRequests: hospital.urgentRequests,
      },
      patients: hospital.patients,
      stats: {
        totalPatients: hospital.patients.length,
        patientsNeedingBlood: hospital.patients.filter(p => p.status === 'requesting').length,
        patientsReceived: hospital.patients.filter(p => p.status === 'received').length,
      },
    });
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
    await delay(500);
    const newPatient: Patient = {
      id: 'p-' + Date.now(),
      name: data.name,
      age: data.age,
      roomNo: data.roomNumber,
      case: data.caseDescription,
      bloodTypeNeeded: data.bloodType,
      unitsRequired: data.unitsRequired,
      admittedDate: new Date().toISOString().split('T')[0],
      status: 'requesting',
    };
    return {
      success: true,
      message: 'Patient added successfully',
      patient: newPatient,
    };
  },

  getPatients: async (hospitalId: string) => {
    return mockResponse(mockHospitals[0].patients);
  },

  updatePatient: async (
    hospitalId: string,
    patientId: string,
    data: { unitsReceived?: number; status?: string }
  ) => {
    await delay(500);
    return {
      success: true,
      message: 'Patient updated successfully',
    };
  },

  deletePatient: async (hospitalId: string, patientId: string) => {
    await delay(500);
    return {
      success: true,
      message: 'Patient removed successfully',
    };
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
    await delay(500);
    const hospital = mockHospitals[0];
    const newEmergency: EmergencyRequest = {
      id: 'em-' + Date.now(),
      requesterId: hospital.id,
      requesterType: 'hospital',
      requesterName: hospital.name,
      bloodType: data.bloodType,
      unitsRequired: data.unitsNeeded,
      timestamp: new Date().toISOString(),
      status: 'active',
      acknowledgements: [],
    };
    return {
      success: true,
      message: 'Emergency request created and broadcasted',
      emergency: newEmergency,
    };
  },

  getEmergencyStatus: async (hospitalId: string) => {
    const activeEmergencies = mockEmergencyRequests.filter(
      e => e.requesterId === hospitalId && e.status === 'active'
    );
    return mockResponse({
      activeEmergencies,
      totalAcknowledgements: activeEmergencies.reduce(
        (sum, e) => sum + e.acknowledgements.length,
        0
      ),
    });
  },
};

// ============================================================================
// DONOR APIs (MOCK)
// ============================================================================

export const mockDonorAPI = {
  getProfile: async (donorId: string) => {
    const donor = mockDonors.find(d => d.id === donorId) || mockDonors[0];
    return mockResponse(donor);
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
    await delay(500);
    return {
      success: true,
      message: 'Profile updated successfully',
    };
  },

  getNearbyEmergencies: async (donorId: string, city?: string) => {
    const donor = mockDonors.find(d => d.id === donorId) || mockDonors[0];
    const emergencies = mockEmergencyRequests.filter(
      e => e.status === 'active' && (!city || e.requesterName.includes(city))
    );
    return mockResponse(emergencies);
  },

  respondToEmergency: async (
    donorId: string,
    data: {
      emergencyId: string;
      unitsPledged: number;
    }
  ) => {
    await delay(500);
    return {
      success: true,
      message: 'Response sent successfully. Hospital will contact you soon.',
    };
  },

  getHistory: async (donorId: string) => {
    await delay(500);
    return mockResponse({
      donations: [
        {
          id: 'don-1',
          date: '2025-09-15',
          hospital: 'City General Hospital',
          bloodType: 'O+',
          units: 1,
          status: 'completed',
        },
        {
          id: 'don-2',
          date: '2025-07-20',
          hospital: 'Metro Health Center',
          bloodType: 'O+',
          units: 1,
          status: 'completed',
        },
        {
          id: 'don-3',
          date: '2025-05-10',
          hospital: 'City General Hospital',
          bloodType: 'O+',
          units: 1,
          status: 'completed',
        },
      ],
      totalDonations: 3,
      totalUnits: 3,
      lastDonation: '2025-09-15',
    });
  },
};

// ============================================================================
// BLOOD BANK APIs (MOCK)
// ============================================================================

export const mockBloodBankAPI = {
  getDashboard: async (bloodBankId: string) => {
    const bloodBank = mockBloodBanks[0];
    return mockResponse({
      bloodBank: {
        id: bloodBank.id,
        name: bloodBank.name,
        location: bloodBank.location,
        bankId: bloodBank.bankId,
        reputationScore: bloodBank.reputationScore,
        successRate: bloodBank.successRate,
      },
      preservation: bloodBank.preservationList,
      sendRecords: bloodBank.sendRecords,
      stats: {
        totalUnits: bloodBank.preservationList.reduce((sum, p) => sum + p.unitsAvailable, 0),
        availableUnits: bloodBank.preservationList
          .filter(p => p.status === 'available')
          .reduce((sum, p) => sum + p.unitsAvailable, 0),
        totalDispatches: bloodBank.sendRecords.length,
      },
    });
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
    await delay(500);
    return {
      success: true,
      message: 'Blood preservation record added successfully',
      preservation: {
        id: 'bu-' + Date.now(),
        bloodType: data.bloodType,
        unitsAvailable: data.units,
        storageConditions: data.storageLocation || 'Refrigerated 4°C',
        collectionDate: data.collectionDate,
        expiryDate: data.expiryDate,
        batchId: `BATCH-${data.bloodType}-${Date.now()}`,
        status: 'available',
      },
    };
  },

  getPreservation: async (bloodBankId: string) => {
    return mockResponse(mockBloodBanks[0].preservationList);
  },

  updatePreservation: async (
    bloodBankId: string,
    preservationId: string,
    data: { units?: number; status?: string }
  ) => {
    await delay(500);
    return {
      success: true,
      message: 'Preservation record updated successfully',
    };
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
    await delay(500);
    return {
      success: true,
      message: 'Blood dispatched successfully',
      sendRecord: {
        id: 'sr-' + Date.now(),
        hospitalName: 'City General Hospital',
        hospitalId: data.hospitalId,
        bloodTypes: ['O+'],
        unitsSent: data.unitsDispatched,
        dispatchTimestamp: new Date().toISOString(),
        transportConditions: 'Insulated container, 2-8°C maintained',
        responsibleStaff: 'Lab Supervisor',
      },
    };
  },

  getSendRecords: async (bloodBankId: string) => {
    return mockResponse(mockBloodBanks[0].sendRecords);
  },

  updateSendRecord: async (
    bloodBankId: string,
    sendRecordId: string,
    data: { status: string }
  ) => {
    await delay(500);
    return {
      success: true,
      message: 'Send record updated successfully',
    };
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
    await delay(500);
    const bloodBank = mockBloodBanks[0];
    return {
      success: true,
      message: 'Emergency request created and broadcasted',
      emergency: {
        id: 'em-' + Date.now(),
        requesterId: bloodBank.id,
        requesterType: 'bloodBank',
        requesterName: bloodBank.name,
        bloodType: data.bloodType,
        unitsRequired: data.unitsNeeded,
        timestamp: new Date().toISOString(),
        status: 'active',
        acknowledgements: [],
      },
    };
  },
};

// ============================================================================
// STATISTICS APIs (MOCK)
// ============================================================================

export const mockStatsAPI = {
  getOverview: async () => {
    return mockResponse({
      totalHospitals: mockHospitals.length,
      totalDonors: mockDonors.length,
      totalBloodBanks: mockBloodBanks.length,
      totalEmergencies: mockEmergencyRequests.length,
      activeEmergencies: mockEmergencyRequests.filter(e => e.status === 'active').length,
      totalBloodUnits: mockBloodBanks.reduce(
        (sum, bb) => sum + bb.preservationList.reduce((s, p) => s + p.unitsAvailable, 0),
        0
      ),
    });
  },

  getCityStats: async (city: string) => {
    return mockResponse({
      city,
      hospitals: mockHospitals.filter(h => h.location.includes(city)).length,
      donors: mockDonors.filter(d => d.city.includes(city)).length,
      bloodBanks: mockBloodBanks.filter(bb => bb.location.includes(city)).length,
    });
  },
};

// ============================================================================
// EMERGENCY APIs (MOCK)
// ============================================================================

export const mockEmergencyAPI = {
  getLatest: async () => {
    const latestEmergencies = mockEmergencyRequests
      .filter(e => e.status === 'active')
      .slice(0, 10);
    return mockResponse(latestEmergencies);
  },
};

// ============================================================================
// UTILITY APIs (MOCK)
// ============================================================================

export const mockUtilityAPI = {
  healthCheck: async () => {
    return mockResponse({
      status: 'ok',
      message: 'Mock API is running',
      timestamp: new Date().toISOString(),
    });
  },

  seedDatabase: async () => {
    await delay(1000);
    return {
      success: true,
      message: 'Mock database seeded (simulation only)',
    };
  },

  clearDatabase: async () => {
    await delay(500);
    return {
      success: true,
      message: 'Mock database cleared (simulation only)',
    };
  },
};