const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { remediesData } = require('../data/ayurvedic-data');

// Helper to generate PDF buffer
function generatePDF(symptoms) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        doc.fontSize(18).text('Your Personalized Ayurveda Remedies', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text('Symptoms: ' + symptoms.join(', '));
        doc.moveDown();

        // Find remedies matching symptoms
        const remedies = remediesData.filter(remedy =>
            remedy.symptoms.some(sym => symptoms.includes(sym))
        );

        remedies.forEach((remedy, idx) => {
            doc.fontSize(14).text(`${idx + 1}. ${remedy.name}`);
            doc.fontSize(10).text(`Category: ${remedy.category}`);
            doc.text(`Benefits: ${remedy.benefits}`);
            doc.text(`Instructions: ${remedy.instructions}`);
            doc.moveDown();
        });

        doc.end();
    });
}

// Removed /send-report route and all email sending logic

module.exports = router; 