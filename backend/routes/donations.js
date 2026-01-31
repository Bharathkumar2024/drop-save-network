import express from 'express';
import Donor from '../models/Donor.js';
import { protect, authorize } from '../middleware/auth.js';
import { generateDonationCertificate, generateCertificateNumber } from '../utils/certificateGenerator.js';
import { sendThankYou } from '../utils/sendSMS.js';
import path from 'path';

const router = express.Router();

// @route   POST /api/donors/:id/donations
// @desc    Record a new blood donation and generate certificate
// @access  Private (Donor or Hospital/Blood Bank)
router.post('/:id/donations', protect, async (req, res) => {
    try {
        const { location, hospitalName, unitsdonated, notes, donationDate } = req.body;

        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Generate certificate number
        const certificateNumber = generateCertificateNumber();

        // Generate certificate
        const certificate = await generateDonationCertificate({
            donorName: donor.name,
            donorId: donor._id,
            bloodType: donor.bloodGroup,
            donationDate: donationDate || new Date(),
            location: location || hospitalName,
            hospitalName,
            certificateNumber,
            unitsdonated: unitsdonated || 1
        });

        // Add donation to history
        donor.donationHistory.push({
            donationDate: donationDate || new Date(),
            location,
            hospitalName,
            bloodType: donor.bloodGroup,
            unitsdonated: unitsdonated || 1,
            certificateNumber,
            certificatePath: certificate.relativePath,
            notes
        });

        // Update stats
        donor.totalDonations += 1;
        donor.reputation += 10; // Award reputation points
        donor.lastDonationDate = donationDate || new Date();

        await donor.save();

        // Send thank you SMS
        sendThankYou(donor).catch(err => console.error('SMS error:', err));

        res.status(201).json({
            message: 'Donation recorded successfully!',
            donation: donor.donationHistory[donor.donationHistory.length - 1],
            certificate: {
                number: certificateNumber,
                path: certificate.relativePath,
                downloadUrl: `/api/donors/certificates/${path.basename(certificate.fileName)}`
            },
            stats: {
                totalDonations: donor.totalDonations,
                reputation: donor.reputation
            }
        });
    } catch (error) {
        console.error('Donation recording error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/donors/:id/donations
// @desc    Get donor's donation history
// @access  Private (Donor)
router.get('/:id/donations', protect, async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        res.json({
            totalDonations: donor.totalDonations,
            donationHistory: donor.donationHistory.sort((a, b) =>
                new Date(b.donationDate) - new Date(a.donationDate)
            )
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/donors/certificates/:filename
// @desc    Download certificate
// @access  Public
router.get('/certificates/:filename', (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'certificates', req.params.filename);
        res.download(filePath);
    } catch (error) {
        res.status(404).json({ message: 'Certificate not found' });
    }
});

// @route   GET /api/donors/:id/certificate/:certNumber
// @desc    Get specific certificate by number
// @access  Private
router.get('/:id/certificate/:certNumber', protect, async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        const donation = donor.donationHistory.find(
            d => d.certificateNumber === req.params.certNumber
        );

        if (!donation) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.json({
            donation,
            downloadUrl: `/api/donors/certificates/${path.basename(donation.certificatePath)}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/donors/:id/regenerate-certificate/:donationId
// @desc    Regenerate certificate for a donation
// @access  Private
router.post('/:id/regenerate-certificate/:donationId', protect, async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        const donation = donor.donationHistory.id(req.params.donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        // Regenerate certificate
        const certificate = await generateDonationCertificate({
            donorName: donor.name,
            donorId: donor._id,
            bloodType: donation.bloodType || donor.bloodGroup,
            donationDate: donation.donationDate,
            location: donation.location,
            hospitalName: donation.hospitalName,
            certificateNumber: donation.certificateNumber,
            unitsdonated: donation.unitsdonated
        });

        // Update certificate path
        donation.certificatePath = certificate.relativePath;
        await donor.save();

        res.json({
            message: 'Certificate regenerated successfully',
            certificate: {
                number: donation.certificateNumber,
                path: certificate.relativePath,
                downloadUrl: `/api/donors/certificates/${path.basename(certificate.fileName)}`
            }
        });
    } catch (error) {
        console.error('Certificate regeneration error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/donors/:id/stats
// @desc    Get donor statistics and achievements
// @access  Private
router.get('/:id/stats', protect, async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Calculate stats
        const totalUnits = donor.donationHistory.reduce((sum, d) => sum + (d.unitsdonated || 1), 0);
        const livesSaved = totalUnits * 3; // Each unit can save 3 lives

        // Get recent donations
        const recentDonations = donor.donationHistory
            .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
            .slice(0, 5);

        // Calculate donation frequency
        const donations = donor.donationHistory.length;
        const firstDonation = donations > 0
            ? new Date(donor.donationHistory[0].donationDate)
            : new Date();
        const daysSinceFirst = (new Date() - firstDonation) / (1000 * 60 * 60 * 24);
        const frequency = donations > 1 ? (daysSinceFirst / donations).toFixed(0) : 0;

        res.json({
            totalDonations: donor.totalDonations,
            totalUnits,
            livesSaved,
            reputation: donor.reputation,
            lastDonationDate: donor.lastDonationDate,
            recentDonations,
            frequency: `Every ${frequency} days`,
            achievements: generateAchievements(donor)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to generate achievements
function generateAchievements(donor) {
    const achievements = [];
    const totalDonations = donor.totalDonations;

    if (totalDonations >= 1) {
        achievements.push({
            title: 'First Drop',
            description: 'Made your first donation',
            icon: '🩸',
            unlocked: true
        });
    }

    if (totalDonations >= 5) {
        achievements.push({
            title: 'Life Saver',
            description: 'Donated 5 times',
            icon: '❤️',
            unlocked: true
        });
    }

    if (totalDonations >= 10) {
        achievements.push({
            title: 'Hero',
            description: 'Donated 10 times',
            icon: '🏅',
            unlocked: true
        });
    }

    if (totalDonations >= 25) {
        achievements.push({
            title: 'Legend',
            description: 'Donated 25 times',
            icon: '🌟',
            unlocked: true
        });
    }

    if (totalDonations >= 50) {
        achievements.push({
            title: 'Platinum Donor',
            description: 'Donated 50 times',
            icon: '💎',
            unlocked: true
        });
    }

    return achievements;
}

export default router;
