import express from 'express';
import Hospital from '../models/Hospital.js';
import Donor from '../models/Donor.js';
import BloodBank from '../models/BloodBank.js';
import Patient from '../models/Patient.js';
import Emergency from '../models/Emergency.js';
import Preservation from '../models/Preservation.js';
import SendRecord from '../models/SendRecord.js';

const router = express.Router();

// @route   POST /api/seed
// @desc    Seed database with mock data
// @access  Public (should be protected/removed in production)
router.post('/', async (req, res) => {
  try {
    // Clear existing data
    await Hospital.deleteMany({});
    await Donor.deleteMany({});
    await BloodBank.deleteMany({});
    await Patient.deleteMany({});
    await Emergency.deleteMany({});
    await Preservation.deleteMany({});
    await SendRecord.deleteMany({});

    // Create Hospitals
    const hospitals = await Hospital.create([
      {
        name: 'City General Hospital',
        hospitalId: 'CGH001',
        location: '123 Main St, New York',
        city: 'New York',
        password: 'password123',
        contactEmail: 'contact@citygeneral.com',
        contactPhone: '+1-555-0101',
        stats: { totalPatients: 10, patientsReceived: 6, emergenciesCreated: 2 }
      },
      {
        name: 'Metro Medical Center',
        hospitalId: 'MMC002',
        location: '456 Oak Ave, Los Angeles',
        city: 'Los Angeles',
        password: 'password123',
        contactEmail: 'info@metromedical.com',
        contactPhone: '+1-555-0102',
        stats: { totalPatients: 8, patientsReceived: 5, emergenciesCreated: 1 }
      }
    ]);

    console.log('✅ Hospitals created');

    // Create Donors
    const donors = await Donor.create([
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-1001',
        bloodGroup: 'O+',
        city: 'New York',
        lastDonationDate: new Date('2024-01-15'),
        verified: true,
        reputation: 50,
        totalDonations: 5,
        totalPledges: 8
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-1002',
        bloodGroup: 'A+',
        city: 'New York',
        lastDonationDate: new Date('2024-02-20'),
        verified: true,
        reputation: 35,
        totalDonations: 3,
        totalPledges: 5
      },
      {
        name: 'Michael Brown',
        email: 'mbrown@email.com',
        phone: '+1-555-1003',
        bloodGroup: 'B+',
        city: 'Los Angeles',
        lastDonationDate: new Date('2024-03-10'),
        verified: true,
        reputation: 40,
        totalDonations: 4,
        totalPledges: 6
      },
      {
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        phone: '+1-555-1004',
        bloodGroup: 'AB+',
        city: 'Los Angeles',
        lastDonationDate: null,
        verified: true,
        reputation: 10,
        totalDonations: 0,
        totalPledges: 2
      }
    ]);

    console.log('✅ Donors created');

    // Create Blood Banks
    const bloodBanks = await BloodBank.create([
      {
        name: 'Central Blood Bank',
        bankId: 'CBB001',
        location: '789 Blood St, New York',
        city: 'New York',
        password: 'password123',
        contactEmail: 'info@centralblood.com',
        contactPhone: '+1-555-2001',
        verified: true,
        stats: { totalStock: 150, totalDispatched: 80, successfulSends: 75 }
      },
      {
        name: 'West Coast Blood Services',
        bankId: 'WCBS002',
        location: '321 Donor Blvd, Los Angeles',
        city: 'Los Angeles',
        password: 'password123',
        contactEmail: 'contact@westcoastblood.com',
        contactPhone: '+1-555-2002',
        verified: true,
        stats: { totalStock: 120, totalDispatched: 60, successfulSends: 58 }
      }
    ]);

    console.log('✅ Blood Banks created');

    // Create Patients for first hospital
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const patients = [];
    
    for (let i = 1; i <= 10; i++) {
      const bloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
      const unitsNeeded = Math.floor(Math.random() * 4) + 1;
      const unitsReceived = Math.random() > 0.4 ? unitsNeeded : Math.floor(Math.random() * unitsNeeded);
      
      patients.push({
        hospital: hospitals[0]._id,
        name: `Patient ${i}`,
        age: Math.floor(Math.random() * 60) + 20,
        room: `${Math.floor(Math.random() * 5) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
        caseDescription: ['Surgery', 'Accident', 'Anemia', 'Cancer Treatment'][Math.floor(Math.random() * 4)],
        bloodType,
        unitsNeeded,
        unitsReceived,
        priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)]
      });
    }

    await Patient.create(patients);
    console.log('✅ Patients created');

    // Create Preservation batches
    const preservations = [];
    const now = new Date();
    
    for (const bloodType of bloodTypes) {
      // Create 2-3 batches per blood type for first blood bank
      for (let i = 0; i < 2; i++) {
        const collectionDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const expiryDate = new Date(collectionDate.getTime() + 42 * 24 * 60 * 60 * 1000); // 42 days shelf life
        
        preservations.push({
          bloodBank: bloodBanks[0]._id,
          batchId: `BATCH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          bloodType,
          units: Math.floor(Math.random() * 10) + 5,
          collectionDate,
          expiryDate,
          status: 'Available',
          storageLocation: `Shelf ${Math.floor(Math.random() * 10) + 1}`
        });
      }
    }

    const createdPreservations = await Preservation.create(preservations);
    console.log('✅ Preservation batches created');

    // Create some Send Records
    const sendRecords = [];
    for (let i = 0; i < 5; i++) {
      const preservation = createdPreservations[i];
      const dispatchDate = new Date(now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000);
      
      sendRecords.push({
        bloodBank: bloodBanks[0]._id,
        preservation: preservation._id,
        recipient: hospitals[0]._id,
        recipientModel: 'Hospital',
        recipientName: hospitals[0].name,
        bloodType: preservation.bloodType,
        units: Math.floor(Math.random() * 3) + 1,
        dispatchDate,
        expectedDelivery: new Date(dispatchDate.getTime() + 2 * 60 * 60 * 1000),
        actualDelivery: Math.random() > 0.2 ? new Date(dispatchDate.getTime() + 3 * 60 * 60 * 1000) : null,
        status: Math.random() > 0.2 ? 'Delivered' : 'In Transit',
        notes: 'Standard delivery'
      });
    }

    await SendRecord.create(sendRecords);
    console.log('✅ Send Records created');

    // Create Active Emergencies
    const emergencies = await Emergency.create([
      {
        createdBy: hospitals[0]._id,
        creatorModel: 'Hospital',
        creatorName: hospitals[0].name,
        bloodType: 'O+',
        unitsNeeded: 5,
        unitsPledged: 2,
        unitsReceived: 0,
        city: 'New York',
        location: hospitals[0].location,
        contactPhone: hospitals[0].contactPhone,
        description: 'Urgent: Multiple accident victims',
        status: 'Active',
        priority: 'Critical',
        responses: [
          {
            donor: donors[0]._id,
            unitsPledged: 2,
            status: 'Pledged'
          }
        ]
      },
      {
        createdBy: bloodBanks[1]._id,
        creatorModel: 'BloodBank',
        creatorName: bloodBanks[1].name,
        bloodType: 'AB-',
        unitsNeeded: 3,
        unitsPledged: 0,
        unitsReceived: 0,
        city: 'Los Angeles',
        location: bloodBanks[1].location,
        contactPhone: bloodBanks[1].contactPhone,
        description: 'Rare blood type needed urgently',
        status: 'Active',
        priority: 'High'
      }
    ]);

    console.log('✅ Emergencies created');

    res.json({
      message: 'Database seeded successfully',
      data: {
        hospitals: hospitals.length,
        donors: donors.length,
        bloodBanks: bloodBanks.length,
        patients: patients.length,
        preservations: preservations.length,
        sendRecords: sendRecords.length,
        emergencies: emergencies.length
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/seed
// @desc    Clear all data
// @access  Public (should be protected/removed in production)
router.delete('/', async (req, res) => {
  try {
    await Hospital.deleteMany({});
    await Donor.deleteMany({});
    await BloodBank.deleteMany({});
    await Patient.deleteMany({});
    await Emergency.deleteMany({});
    await Preservation.deleteMany({});
    await SendRecord.deleteMany({});

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;