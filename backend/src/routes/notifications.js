const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

let transporter;

if (process.env.SMTP_HOST) {
  // Real Microsoft Outlook / SMTP setup
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // Fallback to Ethereal Email for testing if no real config
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
}

// POST /api/notifications/send - Send Mass Email via Mock Outlook
router.post('/send', async (req, res, next) => {
  try {
    const { groupId, targetType, subject, body } = req.body;

    if (!groupId || !subject || !body) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }

    let emails = [];

    if (targetType === 'GROUP') {
      // Fetch users from USER_GROUP_MEMBER
      const usersRes = await db.query(
        `SELECT u.email FROM USER_GROUP_MEMBER gm
         JOIN USER_ACCOUNT u ON gm.user_account_id = u.id
         WHERE gm.group_id = $1 AND u.email IS NOT NULL`,
        [groupId]
      );
      emails = usersRes.rows.map(u => u.email);
    } else {
      // Default: Fetch students in the study formation
      const studentsRes = await db.query(
        `SELECT email FROM STUDENT WHERE study_formation_id = $1 AND email IS NOT NULL`,
        [groupId]
      );
      emails = studentsRes.rows.map(s => s.email);
    }

    if (emails.length === 0) {
      return res.status(400).json({ error: true, message: 'No valid emails found in this group/formation.' });
    }

    // 2. Send email via Nodemailer
    const mailOptions = {
      from: process.env.SMTP_USER || '"AFSMS Secretariat" <secretariat@mock.ucv.ro>',
      to: emails.join(', '),
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '<br/>')}</p>`
    };

    let info;
    if (transporter) {
      info = await transporter.sendMail(mailOptions);
      if (!process.env.SMTP_HOST) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    }

    // 3. Log into OUTLOOK_NOTIFICATION
    const insertQuery = targetType === 'GROUP' 
      ? `INSERT INTO OUTLOOK_NOTIFICATION (sent_by_user_id, user_group_id, recipients, subject, body_preview, delivery_status)
         VALUES ($1, $2, $3, $4, $5, 'SENT')`
      : `INSERT INTO OUTLOOK_NOTIFICATION (sent_by_user_id, recipients, subject, body_preview, delivery_status)
         VALUES ($1, $3, $4, $5, 'SENT')`;

    const insertParams = targetType === 'GROUP'
      ? [req.user.id, groupId, emails.join(', '), subject, body.substring(0, 500)]
      : [req.user.id, null, emails.join(', '), subject, body.substring(0, 500)];

    await db.query(insertQuery, insertParams);

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
