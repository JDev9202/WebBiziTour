// server.js
import express from 'express';
import bodyParser from 'body-parser';
import PDFDocument from 'pdfkit';
import { google } from 'googleapis';
import path from 'path';
import { Readable } from 'stream';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Configura la carpeta donde multer guardará las fotos subidas
const upload = multer({
  dest: path.join(__dirname, 'uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB máximo
});

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

const tourAgreement = [
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


const rentAgreement = [
  
    { title: 'BICYCLE RENTAL AGREEMENT' },
  
    { title: '1. Late Return' },
    {
      para: 'If you return the equipment after the agreed time, a late fee of [amount] per hour/day will apply.'
    },
  
    { title: '2. Your Responsibilities' },
    {
      list: [
        'Care: Please take good care of the equipment and return it in the same condition as when you received it. You may be responsible for repair costs if any damage occurs.',
        'Loss or Theft: In case of loss or theft, the following replacement fees apply:'
      ]
    },
    {
      list: [
        'Lock: €15',
        'Helmet: €20',
        'Lights, Brakes, or Pedals: €10 each',
        'Bike Seat: €20',
        'Wheel: €30',
        'Baby/Toddler Seat: €50',
        'Basket: €12',
        'Vintage City Bike: €450',
        'Vintage E‑Bike: €1,650'
      ]
    },
  
    { title: '3. Safety and Compliance' },
    {
      para: 'The Client agrees to comply with all traffic laws and regulations and is responsible for any damages (to themselves or third parties) resulting from accidents during bicycle use.'
    },
  
    { title: '4. Liability' },
    {
      para: 'BiziTour Malaga isn’t liable for any claims arising from your use of the equipment. By renting from us, you agree to indemnify and hold us harmless from such claims.'
    },
  
    { title: '5. Security Measures' },
    {
      list: [
        'Always lock the bicycle securely when not in use.',
        'To prevent theft, avoid leaving it outside overnight.',
        'Lock through the frame and wheels in well-lit areas.'
      ]
    },
  
    { title: '6. Assistance with Breakdowns and Flat Tires' },
    {
      list: [
        'Breakdowns: Visit our shop at Plaza Montaño, 4 for a free replacement.',
        'Breakdowns (if returning isn’t feasible): Call a taxi to bring you and the bike back; we’ll cover the fare.',
        'Breakdowns (if returning isn’t feasible): Have the bike repaired at a nearby shop; we’ll reimburse the cost.',
        'Flat Tires: Have it repaired at a nearby shop; we’ll cover the full cost.',
        'Flat Tires (09:00–18:00): Call a taxi to bring you and the bike back; we’ll cover half the fare.'
      ]
    },
  
    { title: '7. Shop Hours and Late Returns' },
    {
      para: 'Our shop closes at 18:00. If you return the bike after closing, it will be considered a 12‑hour extension, and additional fees will apply.'
    },
  
    { title: '8. Governing Law' },
    {
      para: 'This agreement is governed by the laws of Spain.'
    },
  
    {
      para: 'By signing below, you acknowledge that you’ve read, understood, and agree to these terms.'
    }
  ];
  


  app.post('/submit',upload.single('idPhoto'),async (req, res) => {
    console.log('req.file =', req.file);          // your uploaded file metadata
    console.log('req.body =', req.body);
    const formType = req.body.formType || 'tour';
    let participants = [];
    try {
        participants = JSON.parse(req.body.participants);
      } catch (err) {
        console.error('Error parsing participants:', err);
         return res.status(400).json({ ok: false, error: 'Invalid participants JSON' });
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

      if (formType === 'rent') {
        doc.moveDown(1)
           .font('Times-Bold').fontSize(12)
           .text('RENTAL DETAILS', { underline: true })
           .moveDown(0.5);
      
        // Fecha y hora de vencimiento
        doc.font('Times-Roman').fontSize(11)
           .text(`Return Date & Time: ${first.returnDateTime}`)
           .moveDown(0.3);
      
        // Cantidades de artículos
        doc.text(`Vintage Bicycle Qty: ${first.vintageBicycleQty}`, { indent: 20 })
           .moveDown(0.2)
           .text(`Vintage E‑Bike Qty:   ${first.vintageEBikeQty}`, { indent: 20 })
           .moveDown(0.2)
           .text(`Lock Qty:            ${first.lockQty}`, { indent: 20 })
           .moveDown(0.2)
           .text(`Helmet Qty:          ${first.helmetQty}`, { indent: 20 })
           .moveDown(1);
           
      }
      

    doc.font('Times-Roman').fontSize(11).fillColor('#000');
      const selectedAgreement = formType === 'rent'
      ? rentAgreement
      : tourAgreement;
      selectedAgreement.forEach(item => {
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
   // — Sólo para rent, y justo tras la última firma —
if (formType === 'rent' && req.file) {
  // Si quieres la foto en la misma página, comentas la siguiente línea:
  // doc.addPage();
  // drawFrame();

  doc.moveDown(1)
     .font('Times-Bold').fontSize(14)
     .text('FOTO DE IDENTIFICACIÓN', { align: 'center', underline: true })
     .moveDown(1);

  doc.image(req.file.path, {
    fit:   [250, 250],
    align: 'center',
    valign:'center'
  }).moveDown(1);
}

    doc.end();
 
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));