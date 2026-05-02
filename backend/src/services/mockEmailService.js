/**
 * Mock Email Service (Ethereal)
 * 
 * Uses nodemailer's Ethereal test accounts to simulate sending emails.
 * No configuration required — perfect for development and testing.
 * Provides preview URLs to inspect sent emails in the browser.
 */

const nodemailer = require('nodemailer');

let transporter = null;
let initPromise = null;

/**
 * Initialize the Ethereal test account transporter (lazy, singleton).
 */
async function ensureTransporter() {
  if (transporter) return transporter;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const account = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      console.log('[MockEmail] Ethereal test account ready:', account.user);
      return transporter;
    } catch (err) {
      console.error('[MockEmail] Failed to create Ethereal account:', err.message);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Send a single email (or mass email with multiple recipients).
 * 
 * @param {Object} options
 * @param {string} options.from - Sender address
 * @param {string[]} options.to - Array of recipient email addresses
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @returns {Object} { success, messageId, previewUrl }
 */
async function sendMail({ from, to, subject, text, html }) {
  const t = await ensureTransporter();

  const recipients = Array.isArray(to) ? to.join(', ') : to;

  const info = await t.sendMail({
    from: from || '"AFSMS Secretariat" <secretariat@mock.ucv.ro>',
    to: recipients,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('[MockEmail] Message sent. Preview URL: %s', previewUrl);

  return {
    success: true,
    messageId: info.messageId,
    previewUrl,
    provider: 'mock',
  };
}

/**
 * Send bulk messages (one per recipient) via the Graph API batch pattern.
 * In mock mode, we just send one email with all recipients in BCC for simplicity.
 * 
 * @param {Object} options
 * @param {string} options.from - Sender address
 * @param {string[]} options.recipients - Array of email addresses
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @returns {Object} { success, totalSent, previewUrl }
 */
async function sendBulk({ from, recipients, subject, text, html }) {
  const t = await ensureTransporter();

  const info = await t.sendMail({
    from: from || '"AFSMS Secretariat" <secretariat@mock.ucv.ro>',
    to: recipients.join(', '),
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('[MockEmail] Bulk message sent to %d recipients. Preview: %s', recipients.length, previewUrl);

  return {
    success: true,
    totalSent: recipients.length,
    messageId: info.messageId,
    previewUrl,
    provider: 'mock',
  };
}

/**
 * Returns provider name for logging/diagnostics.
 */
function getProviderName() {
  return 'Mock (Ethereal)';
}

module.exports = { sendMail, sendBulk, getProviderName };
