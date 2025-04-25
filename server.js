// server.js
import express from 'express';
import bodyParser from 'body-parser';
import PDFDocument from 'pdfkit';
import { google } from 'googleapis';
import path from 'path';
import { Readable } from 'stream';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const DRIVE_FOLDER_ID = '1TA92DYE6o0Q-yl5F65xHq_ovLV42RibZ';
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive.file']
});
const drive = google.drive({ version: 'v3', auth });

const agreementText = [
  { title: 'BICYCLE TOUR PARTICIPATION AGREEMENT' },
  { para: 'This agreement governs participation in a bike tour organized by BIZITOUR, a trademark of Digoo Design S.L. (CIF: B67988410), hereinafter referred to as "the Organizer," and the participant, hereinafter referred to as "the Client".' },
  { title: '1. Purpose of the Agreement' },
  { para: 'The Client agrees to participate in a guided bike tour organized by the Organizer, which includes the use of a bicycle, helmet, and accessories if applicable. The tour details, including route and duration, have been communicated in advance.' },
  { title: '2. Client Responsibilities' },
  { list: [
      'Follow the guide’s instructions at all times.',
      'Use the safety equipment provided.',
      'Respect traffic laws and act prudently during the tour.',
      'Assume responsibility for any damages caused by negligence.'
    ] },
  { title: '3. Organizer Responsibilities' },
  { list: [
      'Ensure that bicycles and accessories are in optimal condition.',
      'Provide a qualified guide to lead the tour safely.',
      'Offer assistance in case of mechanical issues during the tour.'
    ] },
  { title: '4. Liability Waiver' },
  { list: [
      'The Organizer is not responsible for injuries or damages caused by the Client’s negligence.',
      'Loss of personal belongings during the tour.',
      'Cancellations or modifications due to weather or force majeure.'
    ] },
  { title: '5. Cancellations and Refunds' },
  { list: [
      'Full refund if cancelled at least 48 hours in advance.',
      'No refund if cancelled less than 48 hours before the start.',
      'Organizer may reschedule or refund for safety reasons.'
    ] },
  { title: '6. Data Protection' },
  { para: 'The Client agrees to the use of their personal data solely for the management of the tour, in compliance with GDPR.' },
  { title: '7. Jurisdiction' },
  { para: 'This agreement is governed by the laws of Spain, with both parties submitting to the courts of the Organizer’s registered location.' },
  { para: '“By signing this agreement, the undersigned accepts responsibility for the entire group of participants.”' },
  { title: '8. Group Participation Clause' },
  { para: 'Group leaders sign on behalf of all participants, certifying they have been informed and agree to these terms.' }
];

app.post('/submit', async (req, res) => {
  console.log('Received participants:', req.body.participants);
  try {
    const participants = req.body.participants || [];
    if (!participants.length) {
      return res.status(400).json({ ok: false, error: 'No participants provided' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const first = participants[0];
    const id = Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    const filename = `${today}-${first.firstName}_${first.lastName}-${id}.pdf`;

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 72, bottom: 72, left: 72, right: 72 }
    });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      const pdfStream = Readable.from(pdfBuffer);

      const driveRes = await drive.files.create({
        requestBody: {
          name: filename,
          mimeType: 'application/pdf',
          parents: [DRIVE_FOLDER_ID]
        },
        media: { mimeType: 'application/pdf', body: pdfStream }
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      const recipientEmails = participants.map(p => p.email).join(',');

      await transporter.sendMail({
        from: `"BiziTour" <${process.env.GMAIL_USER}>`,
        to: recipientEmails,
        subject: '✨ Welcome to BiziTour – Participation Confirmed 🚴',
        text: 'Thank you for joining BiziTour. Please find your signed participation agreement attached.',
        attachments: [
          {
            filename: filename,
            content: pdfBuffer
          }
        ]
      });

      res.json({ ok: true, fileId: driveRes.data.id });
    });

    const drawFrame = () => {
      doc.save()
        .lineWidth(1)
        .strokeColor('#333')
        .rect(
          doc.page.margins.left / 2,
          doc.page.margins.top / 2,
          doc.page.width - doc.page.margins.left,
          doc.page.height - doc.page.margins.top
        )
        .stroke()
        .restore();
    };

    drawFrame();

    doc.image(path.join(__dirname, 'public', 'bicitourlogo.png'), doc.page.margins.left, 80, { width: 80 });
    doc.font('Times-Bold')
      .fontSize(18)
      .text('BIZITOUR MÁLAGA', { align: 'center' })
      .moveDown(2);

    doc.font('Times-Roman').fontSize(11).fillColor('#000');
    agreementText.forEach(item => {
      if (item.title) {
        doc.moveDown(0.5).font('Times-Bold').fontSize(12).text(item.title);
      }
      if (item.para) {
        doc.moveDown(0.2).font('Times-Roman').fontSize(11).text(item.para, { align: 'justify', indent: 20, paragraphGap: 6 });
      }
      if (item.list) {
        item.list.forEach(line => {
          doc.text('• ' + line, { align: 'justify', indent: 30 });
        });
      }
    });

    doc.addPage();
    drawFrame();
    doc.font('Times-Bold').fontSize(14)
      .text('PARTICIPANTS', { align: 'center', underline: true })
      .moveDown(1);

    participants.forEach((p, i) => {
      doc.font('Times-Bold').fontSize(12)
        .text(`${i + 1}. ${p.firstName} ${p.lastName}`, { continued: true })
        .font('Times-Roman')
        .fontSize(11)
        .text(` — ${p.email} | ${p.phone} | ${p.date}`)
        .moveDown(0.5);

      const imgData = p.signature.replace(/^data:image\/png;base64,/, '');
      const imgBuf = Buffer.from(imgData, 'base64');
      doc.image(imgBuf, { width: 120 }).moveDown(1);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));