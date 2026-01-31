/**
 * SMS Service using Twilio
 * For development: logs to console
 * For production: sends real SMS via Twilio API
 */

import twilio from 'twilio';

const sendSMS = async (options) => {
    const { phone, message } = options;

    // For development, just log to console
    if (process.env.NODE_ENV === 'development') {
        console.log('📱 SMS (simulated):');
        console.log('To:', phone);
        console.log('Message:', message);
        console.log('---');
        return {
            success: true,
            message: 'SMS simulated (development mode)'
        };
    }

    // Production: Send real SMS via Twilio
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

        if (!accountSid || !authToken || !twilioPhone) {
            throw new Error('Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env');
        }

        const client = twilio(accountSid, authToken);

        const result = await client.messages.create({
            body: message,
            from: twilioPhone,
            to: phone
        });

        console.log('✅ SMS sent successfully:', result.sid);
        return {
            success: true,
            messageId: result.sid,
            message: 'SMS sent successfully'
        };

    } catch (error) {
        console.error('❌ SMS send error:', error.message);
        throw new Error(`Failed to send SMS: ${error.message}`);
    }
};

// Send bulk SMS to multiple recipients
const sendBulkSMS = async (phones, message) => {
    const results = [];

    for (const phone of phones) {
        try {
            const result = await sendSMS({ phone, message });
            results.push({ phone, success: true, result });
        } catch (error) {
            results.push({ phone, success: false, error: error.message });
        }
    }

    return results;
};

// Send emergency alert to donors
const sendEmergencyAlert = async (donors, emergencyDetails) => {
    const { bloodType, hospital, urgency } = emergencyDetails;

    const message = `
🚨 URGENT BLOOD NEEDED!
Blood Type: ${bloodType}
Hospital: ${hospital}
Urgency: ${urgency}
Please donate immediately if available!
- Vital Drop
  `.trim();

    const phones = donors.map(donor => donor.phone);
    return await sendBulkSMS(phones, message);
};

// Send donation confirmation
const sendDonationConfirmation = async (donor, donationDetails) => {
    const { location, date, time } = donationDetails;

    const message = `
✅ Donation Scheduled!
Hi ${donor.name},
Your donation is confirmed:
📍 Location: ${location}
📅 Date: ${date}
🕐 Time: ${time}
Thank you for saving lives!
- Vital Drop
  `.trim();

    return await sendSMS({ phone: donor.phone, message });
};

// Send camp reminder
const sendCampReminder = async (donor, campDetails) => {
    const { name, location, date, time } = campDetails;

    const message = `
🏥 Camp Reminder
Hi ${donor.name},
${name}
📍 ${location}
📅 ${date} at ${time}
See you there!
- Vital Drop
  `.trim();

    return await sendSMS({ phone: donor.phone, message });
};

// Send thank you message after donation
const sendThankYou = async (donor) => {
    const message = `
❤️ Thank You!
Hi ${donor.name},
You just saved up to 3 lives!
Your donation is making a difference.
Total donations: ${donor.totalDonations || 0}
- Vital Drop Team
  `.trim();

    return await sendSMS({ phone: donor.phone, message });
};

// Send welcome message to new donor
const sendWelcomeSMS = async (donor) => {
    const message = `
🩸 Welcome to Vital Drop!
Hi ${donor.name},
Thank you for joining our life-saving community.
Blood Type: ${donor.bloodGroup}
You'll receive emergency alerts in your area.
- Vital Drop
  `.trim();

    return await sendSMS({ phone: donor.phone, message });
};

export {
    sendSMS,
    sendBulkSMS,
    sendEmergencyAlert,
    sendDonationConfirmation,
    sendCampReminder,
    sendThankYou,
    sendWelcomeSMS
};

export default sendSMS;
