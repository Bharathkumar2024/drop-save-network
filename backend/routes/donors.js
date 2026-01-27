import express from 'express';
import Donor from '../models/Donor.js';
import Emergency from '../models/Emergency.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/donors/:id/profile
// @desc    Get donor profile
// @access  Private (Donor)
router.get('/:id/profile', protect, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/donors/:id/profile
// @desc    Update donor profile
// @access  Private (Donor)
router.patch('/:id/profile', protect, authorize('donor'), async (req, res) => {
  try {
    const { name, phone, city, lastDonationDate } = req.body;

    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    if (name) donor.name = name;
    if (phone) donor.phone = phone;
    if (city) donor.city = city;
    if (lastDonationDate) donor.lastDonationDate = lastDonationDate;

    await donor.save();

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/donors/:id/nearby-emergencies
// @desc    Get nearby active emergencies
// @access  Private (Donor)
router.get('/:id/nearby-emergencies', protect, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const city = req.query.city || donor.city;

    // Find active emergencies in the same city
    const emergencies = await Emergency.find({
      city: city,
      status: 'Active',
      expiresAt: { $gt: new Date() }
    })
    .populate('createdBy', 'name location contactPhone')
    .sort({ priority: -1, createdAt: -1 });

    // Filter emergencies that match donor's blood group or need universal donors
    const compatibleEmergencies = emergencies.filter(emergency => {
      // Simple blood compatibility check
      const donorBlood = donor.bloodGroup;
      const neededBlood = emergency.bloodType;
      
      // O- is universal donor
      if (donorBlood === 'O-') return true;
      
      // Same blood type
      if (donorBlood === neededBlood) return true;
      
      // Additional compatibility rules (simplified)
      if (donorBlood === 'O+' && neededBlood.includes('+')) return true;
      if (donorBlood.startsWith('A') && neededBlood.startsWith('A')) return true;
      if (donorBlood.startsWith('B') && neededBlood.startsWith('B')) return true;
      if (donorBlood.startsWith('AB')) return false; // AB can only donate to AB
      
      return false;
    });

    res.json(compatibleEmergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/donors/:id/respond
// @desc    Respond to an emergency (pledge units)
// @access  Private (Donor)
router.post('/:id/respond', protect, authorize('donor'), async (req, res) => {
  try {
    const { emergencyId, unitsPledged } = req.body;

    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    if (emergency.status !== 'Active') {
      return res.status(400).json({ message: 'Emergency is no longer active' });
    }

    // Check if donor already responded
    const existingResponse = emergency.responses.find(
      r => r.donor.toString() === req.params.id
    );

    if (existingResponse) {
      return res.status(400).json({ message: 'You have already responded to this emergency' });
    }

    // Add response
    emergency.responses.push({
      donor: req.params.id,
      unitsPledged,
      status: 'Pledged'
    });

    emergency.unitsPledged += unitsPledged;
    await emergency.save();

    // Update donor stats
    donor.totalPledges += 1;
    donor.reputation += 5; // Award reputation points
    await donor.save();

    // Emit socket event to emergency creator
    const io = req.app.get('io');
    io.to(`user:${emergency.createdBy}`).emit('emergency.response', {
      emergencyId: emergency._id,
      donor: {
        name: donor.name,
        bloodGroup: donor.bloodGroup
      },
      unitsPledged
    });

    res.json({
      message: 'Response recorded successfully',
      emergency,
      reputation: donor.reputation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/donors/:id/history
// @desc    Get donor's response history
// @access  Private (Donor)
router.get('/:id/history', protect, authorize('donor'), async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      'responses.donor': req.params.id
    })
    .populate('createdBy', 'name location')
    .sort({ createdAt: -1 });

    const history = emergencies.map(emergency => {
      const response = emergency.responses.find(
        r => r.donor.toString() === req.params.id
      );
      return {
        emergency: {
          id: emergency._id,
          bloodType: emergency.bloodType,
          unitsNeeded: emergency.unitsNeeded,
          city: emergency.city,
          location: emergency.location,
          creatorName: emergency.creatorName,
          status: emergency.status,
          createdAt: emergency.createdAt
        },
        response: {
          unitsPledged: response.unitsPledged,
          status: response.status,
          respondedAt: response.respondedAt
        }
      };
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;