/**
 * Blood Donation Certificate Generator
 * Generates PDF certificates for donors after successful donation
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate Blood Donation Certificate
 * @param {Object} donationData - Donation details
 * @returns {Promise<string>} - Path to generated certificate
 */
const generateDonationCertificate = async (donationData) => {
    const {
        donorName,
        donorId,
        bloodType,
        donationDate,
        location,
        hospitalName,
        certificateNumber,
        unitsdonated = 1
    } = donationData;

    // Create certificates directory if it doesn't exist
    const certDir = path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
    }

    // Certificate file path
    const fileName = `certificate_${certificateNumber}_${Date.now()}.pdf`;
    const filePath = path.join(certDir, fileName);

    return new Promise((resolve, reject) => {
        try {
            // Create PDF document
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 72, right: 72 }
            });

            // Pipe to file
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Page width and height
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;

            // Draw decorative border
            doc.lineWidth(3)
                .strokeColor('#8B0000')
                .rect(30, 30, pageWidth - 60, pageHeight - 60)
                .stroke();

            doc.lineWidth(1)
                .strokeColor('#B22222')
                .rect(40, 40, pageWidth - 80, pageHeight - 80)
                .stroke();

            // Header - Certificate Title
            doc.fontSize(48)
                .fillColor('#8B0000')
                .font('Helvetica-Bold')
                .text('CERTIFICATE', 0, 80, { align: 'center' });

            doc.fontSize(24)
                .fillColor('#DAA520')
                .font('Helvetica-Oblique')
                .text('of Appreciation', 0, 140, { align: 'center' });

            // Blood drop symbol
            doc.fontSize(60)
                .fillColor('#DC143C')
                .text('♥', 0, 180, { align: 'center' });

            // Certificate body
            doc.fontSize(14)
                .fillColor('#000000')
                .font('Helvetica')
                .text('THIS CERTIFICATE IS PROUDLY PRESENTED TO', 0, 260, { align: 'center' });

            // Donor name (highlighted)
            doc.fontSize(32)
                .fillColor('#8B0000')
                .font('Helvetica-Bold')
                .text(donorName.toUpperCase(), 0, 290, { align: 'center' });

            // Appreciation text
            doc.fontSize(14)
                .fillColor('#000000')
                .font('Helvetica')
                .text('For the noble act of donating blood and saving lives', 0, 340, { align: 'center' });

            // Donation details box
            const boxY = 380;
            doc.fontSize(12)
                .fillColor('#8B0000')
                .font('Helvetica-Bold')
                .text(`Blood Type: ${bloodType}`, 0, boxY, { align: 'center' });

            doc.fontSize(12)
                .fillColor('#000000')
                .font('Helvetica')
                .text(`Donation Date: ${new Date(donationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`, 0, boxY + 25, { align: 'center' });

            doc.text(`Location: ${location || hospitalName}`, 0, boxY + 45, { align: 'center' });

            if (unitsdonated > 1) {
                doc.fillColor('#8B0000')
                    .font('Helvetica-Bold')
                    .text(`Units Donated: ${unitsdonated} units`, 0, boxY + 65, { align: 'center' });
            }

            // Appreciation message
            doc.fontSize(11)
                .fillColor('#444444')
                .font('Helvetica-Oblique')
                .text('"Your donation can save up to 3 lives. Thank you for being a hero!"',
                    100, pageHeight - 180, {
                    width: pageWidth - 200,
                    align: 'center'
                });

            // Certificate number and date
            doc.fontSize(9)
                .fillColor('#666666')
                .font('Helvetica')
                .text(`Certificate No: ${certificateNumber}`, 80, pageHeight - 100);

            doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 80, pageHeight - 85);

            // Signature lines
            const signatureY = pageHeight - 120;

            // Left signature (Hospital/Blood Bank)
            doc.moveTo(100, signatureY)
                .lineTo(280, signatureY)
                .stroke();

            doc.fontSize(10)
                .fillColor('#000000')
                .font('Helvetica')
                .text('Authorized Signature', 100, signatureY + 10, { width: 180, align: 'center' });

            doc.fontSize(9)
                .fillColor('#666666')
                .text(hospitalName || 'Blood Donation Center', 100, signatureY + 25, {
                    width: 180,
                    align: 'center'
                });

            // Right signature (Vital Drop)
            doc.moveTo(pageWidth - 280, signatureY)
                .lineTo(pageWidth - 100, signatureY)
                .stroke();

            doc.fontSize(10)
                .fillColor('#000000')
                .font('Helvetica')
                .text('Vital Drop', pageWidth - 280, signatureY + 10, {
                    width: 180,
                    align: 'center'
                });

            doc.fontSize(9)
                .fillColor('#666666')
                .text('Blood Donation Network', pageWidth - 280, signatureY + 25, {
                    width: 180,
                    align: 'center'
                });

            // Footer
            doc.fontSize(8)
                .fillColor('#999999')
                .font('Helvetica-Oblique')
                .text('Vital Drop - Connecting Lives Through Blood Donation', 0, pageHeight - 50, {
                    align: 'center'
                });

            // Watermark
            doc.fontSize(100)
                .fillColor('#FFEBEE')
                .opacity(0.1)
                .text('VITAL DROP', 0, pageHeight / 2 - 50, {
                    align: 'center',
                    rotate: -45
                });

            // Finalize PDF
            doc.end();

            stream.on('finish', () => {
                console.log(`✅ Certificate generated: ${fileName}`);
                resolve({
                    filePath,
                    fileName,
                    relativePath: `/certificates/${fileName}`
                });
            });

            stream.on('error', (error) => {
                console.error('❌ Certificate generation error:', error);
                reject(error);
            });

        } catch (error) {
            console.error('❌ PDF generation error:', error);
            reject(error);
        }
    });
};

/**
 * Generate certificate number
 * Format: VD-YYYY-MM-XXXXXX
 */
const generateCertificateNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    return `VD-${year}-${month}-${random}`;
};

export {
    generateDonationCertificate,
    generateCertificateNumber
};

export default generateDonationCertificate;
