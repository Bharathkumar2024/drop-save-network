// Mock data for the LifeLink platform

export interface Patient {
  id: string;
  name: string;
  age: number;
  roomNo: string;
  case: string;
  bloodTypeNeeded: string;
  unitsRequired: number;
  admittedDate: string;
  status: 'requesting' | 'received';
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  lastDonationDate: string;
  city: string;
  phone: string;
  email: string;
  healthCertificate?: string;
  reputation: number;
  availability: boolean;
}

export interface BloodUnit {
  id: string;
  bloodType: string;
  unitsAvailable: number;
  storageConditions: string;
  collectionDate: string;
  expiryDate: string;
  batchId: string;
  status: 'available' | 'reserved' | 'dispatched';
}

export interface SendRecord {
  id: string;
  hospitalName: string;
  hospitalId: string;
  bloodTypes: string[];
  unitsSent: number;
  dispatchTimestamp: string;
  transportConditions: string;
  responsibleStaff: string;
}

export interface BloodBank {
  id: string;
  name: string;
  ownerName: string;
  location: string;
  bankId: string;
  approvedCertificates: string[];
  otpVerified: boolean;
  preservationList: BloodUnit[];
  sendRecords: SendRecord[];
  reputationScore: number;
  successRate: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  hospitalId: string;
  patients: Patient[];
  totalDonorsConnected: number;
  totalBloodUnitsReceived: number;
  urgentRequests: number;
}

export interface EmergencyRequest {
  id: string;
  requesterId: string;
  requesterType: 'hospital' | 'bloodBank';
  requesterName: string;
  bloodType: string;
  unitsRequired: number;
  timestamp: string;
  status: 'active' | 'fulfilled' | 'expired';
  acknowledgements: {
    donorId: string;
    donorName: string;
    unitsPledged: number;
    timestamp: string;
  }[];
}

// Mock Hospitals
export const mockHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'City General Hospital',
    location: 'Downtown, Metro City',
    hospitalId: 'CGH001',
    totalDonorsConnected: 342,
    totalBloodUnitsReceived: 1250,
    urgentRequests: 3,
    patients: [
      {
        id: 'p1',
        name: 'John Anderson',
        age: 45,
        roomNo: '302A',
        case: 'Severe accident trauma',
        bloodTypeNeeded: 'O+',
        unitsRequired: 4,
        admittedDate: '2025-10-08',
        status: 'requesting'
      },
      {
        id: 'p2',
        name: 'Sarah Mitchell',
        age: 32,
        roomNo: '405B',
        case: 'Post-surgical recovery',
        bloodTypeNeeded: 'A+',
        unitsRequired: 2,
        admittedDate: '2025-10-07',
        status: 'received'
      },
      {
        id: 'p3',
        name: 'Michael Chen',
        age: 28,
        roomNo: '201C',
        case: 'Internal bleeding',
        bloodTypeNeeded: 'B+',
        unitsRequired: 3,
        admittedDate: '2025-10-09',
        status: 'requesting'
      },
      {
        id: 'p4',
        name: 'Emily Rodriguez',
        age: 56,
        roomNo: '508A',
        case: 'Cancer treatment',
        bloodTypeNeeded: 'AB+',
        unitsRequired: 2,
        admittedDate: '2025-10-06',
        status: 'received'
      },
      {
        id: 'p5',
        name: 'David Thompson',
        age: 41,
        roomNo: '310D',
        case: 'Emergency surgery',
        bloodTypeNeeded: 'O-',
        unitsRequired: 5,
        admittedDate: '2025-10-10',
        status: 'requesting'
      },
      {
        id: 'p6',
        name: 'Lisa Wang',
        age: 35,
        roomNo: '412B',
        case: 'Childbirth complications',
        bloodTypeNeeded: 'A-',
        unitsRequired: 3,
        admittedDate: '2025-10-09',
        status: 'requesting'
      },
      {
        id: 'p7',
        name: 'Robert Kumar',
        age: 52,
        roomNo: '204A',
        case: 'Cardiac surgery',
        bloodTypeNeeded: 'B-',
        unitsRequired: 4,
        admittedDate: '2025-10-08',
        status: 'received'
      },
      {
        id: 'p8',
        name: 'Jennifer Lee',
        age: 29,
        roomNo: '315C',
        case: 'Accident victim',
        bloodTypeNeeded: 'O+',
        unitsRequired: 2,
        admittedDate: '2025-10-10',
        status: 'requesting'
      },
      {
        id: 'p9',
        name: 'James Wilson',
        age: 48,
        roomNo: '501B',
        case: 'Organ transplant',
        bloodTypeNeeded: 'AB-',
        unitsRequired: 6,
        admittedDate: '2025-10-07',
        status: 'requesting'
      },
      {
        id: 'p10',
        name: 'Maria Garcia',
        age: 38,
        roomNo: '210D',
        case: 'Severe anemia',
        bloodTypeNeeded: 'A+',
        unitsRequired: 3,
        admittedDate: '2025-10-09',
        status: 'requesting'
      }
    ]
  }
];

// Mock Donors
export const mockDonors: Donor[] = [
  {
    id: 'd1',
    name: 'Alex Turner',
    bloodGroup: 'O+',
    lastDonationDate: '2025-08-15',
    city: 'Metro City',
    phone: '+1-555-0101',
    email: 'alex.turner@email.com',
    reputation: 95,
    availability: true
  },
  {
    id: 'd2',
    name: 'Priya Sharma',
    bloodGroup: 'A+',
    lastDonationDate: '2025-09-20',
    city: 'Metro City',
    phone: '+1-555-0102',
    email: 'priya.sharma@email.com',
    reputation: 88,
    availability: true
  },
  {
    id: 'd3',
    name: 'Marcus Johnson',
    bloodGroup: 'B+',
    lastDonationDate: '2025-07-10',
    city: 'Metro City',
    phone: '+1-555-0103',
    email: 'marcus.j@email.com',
    reputation: 92,
    availability: false
  },
  {
    id: 'd4',
    name: 'Sofia Martinez',
    bloodGroup: 'AB+',
    lastDonationDate: '2025-09-05',
    city: 'Metro City',
    phone: '+1-555-0104',
    email: 'sofia.m@email.com',
    reputation: 90,
    availability: true
  },
  {
    id: 'd5',
    name: 'Chen Wei',
    bloodGroup: 'O-',
    lastDonationDate: '2025-08-28',
    city: 'Metro City',
    phone: '+1-555-0105',
    email: 'chen.wei@email.com',
    reputation: 97,
    availability: true
  }
];

// Mock Blood Banks
export const mockBloodBanks: BloodBank[] = [
  {
    id: 'bb1',
    name: 'Central Blood Bank',
    ownerName: 'Dr. Rachel Green',
    location: 'Central District, Metro City',
    bankId: 'CBB001',
    approvedCertificates: ['ISO-9001.pdf', 'Health-License-2025.pdf', 'Safety-Certificate.pdf'],
    otpVerified: true,
    reputationScore: 94,
    successRate: 96,
    preservationList: [
      {
        id: 'bu1',
        bloodType: 'O+',
        unitsAvailable: 45,
        storageConditions: 'Refrigerated 4°C, Unit FR-12',
        collectionDate: '2025-09-25',
        expiryDate: '2025-11-25',
        batchId: 'BATCH-O-POS-092025',
        status: 'available'
      },
      {
        id: 'bu2',
        bloodType: 'A+',
        unitsAvailable: 32,
        storageConditions: 'Refrigerated 4°C, Unit FR-13',
        collectionDate: '2025-09-28',
        expiryDate: '2025-11-28',
        batchId: 'BATCH-A-POS-092025',
        status: 'available'
      },
      {
        id: 'bu3',
        bloodType: 'B+',
        unitsAvailable: 28,
        storageConditions: 'Refrigerated 4°C, Unit FR-14',
        collectionDate: '2025-09-30',
        expiryDate: '2025-11-30',
        batchId: 'BATCH-B-POS-092025',
        status: 'available'
      },
      {
        id: 'bu4',
        bloodType: 'AB+',
        unitsAvailable: 15,
        storageConditions: 'Refrigerated 4°C, Unit FR-15',
        collectionDate: '2025-10-01',
        expiryDate: '2025-12-01',
        batchId: 'BATCH-AB-POS-102025',
        status: 'available'
      },
      {
        id: 'bu5',
        bloodType: 'O-',
        unitsAvailable: 22,
        storageConditions: 'Refrigerated 4°C, Unit FR-16',
        collectionDate: '2025-09-26',
        expiryDate: '2025-11-26',
        batchId: 'BATCH-O-NEG-092025',
        status: 'available'
      },
      {
        id: 'bu6',
        bloodType: 'A-',
        unitsAvailable: 18,
        storageConditions: 'Refrigerated 4°C, Unit FR-17',
        collectionDate: '2025-09-29',
        expiryDate: '2025-11-29',
        batchId: 'BATCH-A-NEG-092025',
        status: 'available'
      },
      {
        id: 'bu7',
        bloodType: 'B-',
        unitsAvailable: 12,
        storageConditions: 'Refrigerated 4°C, Unit FR-18',
        collectionDate: '2025-10-02',
        expiryDate: '2025-12-02',
        batchId: 'BATCH-B-NEG-102025',
        status: 'reserved'
      },
      {
        id: 'bu8',
        bloodType: 'AB-',
        unitsAvailable: 8,
        storageConditions: 'Refrigerated 4°C, Unit FR-19',
        collectionDate: '2025-10-03',
        expiryDate: '2025-12-03',
        batchId: 'BATCH-AB-NEG-102025',
        status: 'available'
      }
    ],
    sendRecords: [
      {
        id: 'sr1',
        hospitalName: 'City General Hospital',
        hospitalId: 'CGH001',
        bloodTypes: ['O+', 'A+'],
        unitsSent: 12,
        dispatchTimestamp: '2025-10-09T14:30:00Z',
        transportConditions: 'Insulated container, 2-8°C maintained',
        responsibleStaff: 'Dr. Rachel Green'
      },
      {
        id: 'sr2',
        hospitalName: 'City General Hospital',
        hospitalId: 'CGH001',
        bloodTypes: ['B+', 'AB+'],
        unitsSent: 8,
        dispatchTimestamp: '2025-10-08T09:15:00Z',
        transportConditions: 'Insulated container, 2-8°C maintained',
        responsibleStaff: 'Dr. Rachel Green'
      },
      {
        id: 'sr3',
        hospitalName: 'Metro Health Center',
        hospitalId: 'MHC002',
        bloodTypes: ['O-', 'A-'],
        unitsSent: 15,
        dispatchTimestamp: '2025-10-07T16:45:00Z',
        transportConditions: 'Insulated container, 2-8°C maintained',
        responsibleStaff: 'Lab Supervisor - Mark Stevens'
      }
    ]
  }
];

// Mock Emergency Requests
export const mockEmergencyRequests: EmergencyRequest[] = [
  {
    id: 'er1',
    requesterId: 'h1',
    requesterType: 'hospital',
    requesterName: 'City General Hospital',
    bloodType: 'O-',
    unitsRequired: 5,
    timestamp: '2025-10-10T08:30:00Z',
    status: 'active',
    acknowledgements: [
      {
        donorId: 'd5',
        donorName: 'Chen Wei',
        unitsPledged: 1,
        timestamp: '2025-10-10T08:35:00Z'
      }
    ]
  },
  {
    id: 'er2',
    requesterId: 'h1',
    requesterType: 'hospital',
    requesterName: 'City General Hospital',
    bloodType: 'AB-',
    unitsRequired: 6,
    timestamp: '2025-10-09T15:20:00Z',
    status: 'active',
    acknowledgements: []
  }
];

// Blood type statistics for charts
export const bloodTypeDistribution = [
  { type: 'O+', percentage: 35, units: 45 },
  { type: 'A+', percentage: 25, units: 32 },
  { type: 'B+', percentage: 18, units: 28 },
  { type: 'AB+', percentage: 8, units: 15 },
  { type: 'O-', percentage: 7, units: 22 },
  { type: 'A-', percentage: 4, units: 18 },
  { type: 'B-', percentage: 2, units: 12 },
  { type: 'AB-', percentage: 1, units: 8 }
];

// Success rate time series (last 7 days)
export const successRateTimeSeries = [
  { day: 'Mon', rate: 92 },
  { day: 'Tue', rate: 95 },
  { day: 'Wed', rate: 93 },
  { day: 'Thu', rate: 97 },
  { day: 'Fri', rate: 94 },
  { day: 'Sat', rate: 96 },
  { day: 'Sun', rate: 96 }
];
