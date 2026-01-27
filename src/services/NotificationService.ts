/**
 * NotificationService.ts
 * 
 * This service abstracts sending 'Real World' SMS and Email notifications.
 * In a development environment without API keys, it logs the actions to the console.
 * In production, it would connect to Twilio/SendGrid/Supabase.
 */

type NotificationType = 'SMS' | 'EMAIL';

interface NotificationPayload {
    to: string; // Phone number or Email address
    subject?: string; // For Email
    message: string;
}

class NotificationService {
    private twilioEnabled: boolean = false;
    private sendGridEnabled: boolean = false;

    constructor() {
        // Check for API keys (simulated check)
        this.twilioEnabled = !!import.meta.env.VITE_TWILIO_SID;
        this.sendGridEnabled = !!import.meta.env.VITE_SENDGRID_KEY;
    }

    /**
     * Send an SMS notification
     */
    async sendSMS(payload: NotificationPayload): Promise<boolean> {
        const { to, message } = payload;

        if (this.twilioEnabled) {
            // Real API Call would go here
            // await twilioClient.messages.create({ ... })
            console.log(`[Twilio API] Sending SMS to ${to}: ${message}`);
            return true;
        } else {
            // Dev Mode Simulation
            console.group('📱 [DEV SIMULATION] Sending SMS');
            console.log(`To: ${to}`);
            console.log(`Message: ${message}`);
            console.log('Status: Sent (Simulated)');
            console.groupEnd();
            return true;
        }
    }

    /**
     * Send an Email notification
     */
    async sendEmail(payload: NotificationPayload): Promise<boolean> {
        const { to, subject, message } = payload;

        if (this.sendGridEnabled) {
            // Real API Call would go here
            // await sendGrid.send({ ... })
            console.log(`[SendGrid API] Sending Email to ${to}: ${subject}`);
            return true;
        } else {
            // Dev Mode Simulation
            console.group('📧 [DEV SIMULATION] Sending Email');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${message}`);
            console.log('Status: Sent (Simulated)');
            console.groupEnd();
            return true;
        }
    }

    /**
     * Send a Camp Invitation specifically
     */
    async sendCampInvitation(donorName: string, phone: string, email: string, campDetails: { date: string; location: string }): Promise<void> {
        const message = `Hello ${donorName}, you have been selected for the blood donation camp on ${campDetails.date} at ${campDetails.location}. Your contribution saves lives!`;

        // Send both SMS and Email to ensure delivery
        await Promise.all([
            this.sendSMS({ to: phone, message }),
            this.sendEmail({ to: email, subject: 'Blood Donation Camp Invitation', message })
        ]);
    }
}

export const notificationService = new NotificationService();
