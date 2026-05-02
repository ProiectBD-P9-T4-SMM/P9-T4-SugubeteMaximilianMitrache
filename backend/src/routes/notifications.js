const express = require('express');
const router = express.Router();
const db = require('../db');
const emailService = require('../services/emailService');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);

// POST /api/notifications/send - Send Mass Email via configurable provider (Graph API / SMTP / Mock)
router.post('/send', requireRole(['ADMIN', 'SECRETARIAT', 'PROFESSOR']), async (req, res, next) => {
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

    // Send email via the configured provider (Graph API, SMTP, or Mock)
    const result = await emailService.sendBulk({
      from: process.env.GRAPH_SENDER_EMAIL || process.env.SMTP_USER || '"AFSMS Secretariat" <secretariat@mock.ucv.ro>',
      recipients: emails,
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '<br/>')}</p>`
    });

    // Log into OUTLOOK_NOTIFICATION
    const insertQuery = targetType === 'GROUP' 
      ? `INSERT INTO OUTLOOK_NOTIFICATION (sent_by_user_id, user_group_id, recipients, subject, body_preview, delivery_status)
         VALUES ($1, $2, $3, $4, $5, 'SENT')`
      : `INSERT INTO OUTLOOK_NOTIFICATION (sent_by_user_id, recipients, subject, body_preview, delivery_status)
         VALUES ($1, $3, $4, $5, 'SENT')`;

    const insertParams = targetType === 'GROUP'
      ? [req.user.userId, groupId, emails.join(', '), subject, body.substring(0, 500)]
      : [req.user.userId, null, emails.join(', '), subject, body.substring(0, 500)];

    await db.query(insertQuery, insertParams);

    res.json({
      success: true,
      message: `Email successfully dispatched to ${emails.length} recipients via ${emailService.getProviderName()}.`,
      provider: emailService.getProviderName(),
      totalSent: result.totalSent,
      previewUrl: result.previewUrl || null,
      failures: result.failures || undefined,
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/notifications/contact - User Contact Form from Help Page
router.post('/contact', async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const userEmail = req.user.email;
    const userName = req.user.fullName;

    if (!subject || !message) {
      return res.status(400).json({ error: true, message: 'Subject and message are required.' });
    }

    // Send support email via the configured provider
    await emailService.sendMail({
      from: process.env.GRAPH_SENDER_EMAIL || process.env.SMTP_USER || '"AFSMS Support" <support@mock.ucv.ro>',
      to: process.env.SUPPORT_EMAIL || 'admin@mock.ucv.ro',
      subject: `[SUPPORT TICKET] ${subject}`,
      text: `User: ${userName} (${userEmail})\n\nMessage:\n${message}`,
      html: `
        <h3>New Support Request</h3>
        <p><strong>User:</strong> ${userName} (${userEmail})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    // Log the interaction
    await db.query(
      `INSERT INTO OUTLOOK_NOTIFICATION (sent_by_user_id, recipients, subject, body_preview, delivery_status)
       VALUES ($1, $2, $3, $4, 'SENT')`,
      [req.user.userId, 'SYSTEM_ADMIN', `[SUPPORT] ${subject}`, message.substring(0, 500)]
    );

    res.json({ success: true, message: 'Your message has been sent to the IT Helpdesk.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/notifications/provider - Returns the current email provider info (for admin diagnostics)
router.get('/provider', requireRole(['ADMIN']), (req, res) => {
  res.json({
    provider: emailService.getProviderName(),
    configured: true,
  });
});

module.exports = router;
