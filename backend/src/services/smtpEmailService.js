/**
 * SMTP Email Service (Legacy Nodemailer)
 * 
 * Uses direct SMTP transport via Nodemailer.
 * Configure via .env:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 */

const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    throw new Error('[SMTPEmail] SMTP_HOST is not configured in .env');
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log('[SMTPEmail] Transporter initialized for host:', process.env.SMTP_HOST);
  return transporter;
}

/**
 * Send a single email.
 */
async function sendMail({ from, to, subject, text, html }) {
  const t = getTransporter();
  const recipients = Array.isArray(to) ? to.join(', ') : to;

  const info = await t.sendMail({
    from: from || process.env.SMTP_USER,
    to: recipients,
    subject,
    text,
    html,
  });

  console.log('[SMTPEmail] Message sent:', info.messageId);

  return {
    success: true,
    messageId: info.messageId,
    previewUrl: null,
    provider: 'smtp',
  };
}

/**
 * Send bulk messages via SMTP (single email with all recipients).
 */
async function sendBulk({ from, recipients, subject, text, html }) {
  const t = getTransporter();

  const info = await t.sendMail({
    from: from || process.env.SMTP_USER,
    to: recipients.join(', '),
    subject,
    text,
    html,
  });

  console.log('[SMTPEmail] Bulk message sent to %d recipients', recipients.length);

  return {
    success: true,
    totalSent: recipients.length,
    messageId: info.messageId,
    previewUrl: null,
    provider: 'smtp',
  };
}

function getProviderName() {
  return 'SMTP (Nodemailer)';
}

module.exports = { sendMail, sendBulk, getProviderName };
