import express from 'express';
import Emergency from '../models/Emergency.js';

const router = express.Router();

// @route   GET /api/emergencies/latest
// @desc    Get latest emergencies (for polling fallback)
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;

    const filter = {
      status: 'Active',
      expiresAt: { $gt: new Date() }
    };

    if (city) {
      filter.city = city;
    }

    const emergencies = await Emergency.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/emergencies/:id
// @desc    Get emergency by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('createdBy', 'name location contactPhone')
      .populate('responses.donor', 'name phone bloodGroup');

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/emergencies/:id
// @desc    Update emergency status
// @access  Public (should be protected in production)
router.patch('/:id', async (req, res) => {
  try {
    const { status, unitsReceived } = req.body;

    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    if (status) emergency.status = status;
    if (unitsReceived !== undefined) emergency.unitsReceived = unitsReceived;

    await emergency.save();

    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;