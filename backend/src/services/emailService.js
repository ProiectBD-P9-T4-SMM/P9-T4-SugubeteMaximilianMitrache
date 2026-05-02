/**
 * Email Service Factory
 * 
 * Switches between Microsoft Graph API and Mock (Ethereal) email
 * based on the EMAIL_PROVIDER env variable.
 * 
 * .env config:
 *   EMAIL_PROVIDER=mock       → Uses Ethereal (default, no config needed)
 *   EMAIL_PROVIDER=graph      → Uses Microsoft Graph API
 *   EMAIL_PROVIDER=smtp       → Uses legacy SMTP/Nodemailer
 */

const graphEmailService = require('./graphEmailService');
const mockEmailService = require('./mockEmailService');
const smtpEmailService = require('./smtpEmailService');

function getEmailProvider() {
  const provider = (process.env.EMAIL_PROVIDER || 'mock').toLowerCase();

  switch (provider) {
    case 'graph':
      console.log('[EmailService] Using Microsoft Graph API provider');
      return graphEmailService;
    case 'smtp':
      console.log('[EmailService] Using SMTP/Nodemailer provider');
      return smtpEmailService;
    case 'mock':
    default:
      console.log('[EmailService] Using Mock (Ethereal) email provider');
      return mockEmailService;
  }
}

const emailProvider = getEmailProvider();

module.exports = emailProvider;
