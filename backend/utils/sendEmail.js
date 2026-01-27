import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // For prototype, just log to console
  // In production, configure with real SMTP settings
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email (simulated):');
    console.log('To:', options.email);
    console.log('Subject:', options.subject);
    console.log('Message:', options.message);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(message);
};

export default sendEmail;