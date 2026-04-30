const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// Create reusable transporter (Ethereal Email - Fake SMTP for demo)
let transporter;
nodemailer.createTestAccount().then((account) => {
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
}).catch(console.error);

// POST /api/notifications/send - Send Mass Email via Mock Outlook
router.post('/send', async (req, res, next) => {
  try {
    const { groupId, subject, body } = req.body;

    if (!groupId || !subject || !body) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }

    // 1. Fetch all students in the study formation
    const studentsRes = await db.query(
      `SELECT email FROM STUDENT WHERE study_formation_id = $1 AND email IS NOT NULL`,
      [groupId]
    );

    const emails = studentsRes.rows.map(s => s.email);

    if (emails.length === 0) {
      return res.status(400).json({ error: true, message: 'No valid student emails found in this group.' });
    }

    // 2. Send email via Nodemailer
    const mailOptions = {
      from: '"AFSMS Secretariat" <secretariat@mock.ucv.ro>',
      to: emails.join(', '),
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '<br/>')}</p>`
    };

    let info;
    if (transporter) {
      info = await transporter.sendMail(mailOptions);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    // 3. Log into OUTLOOK_NOTIFICATION
    await db.query(
      `INSERT INTO OUTLOOK_NOTIFICATION (sent_by_user_id, recipients, subject, body_preview, delivery_status)
       VALUES ($1, $2, $3, $4, 'SENT')`,
      [req.user.id, emails.join(', '), subject, body.substring(0, 500)]
    );

    res.json({
      success: true,
      message: `Email successfully dispatched to ${emails.length} recipients.`,
      previewUrl: info ? nodemailer.getTestMessageUrl(info) : null
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
