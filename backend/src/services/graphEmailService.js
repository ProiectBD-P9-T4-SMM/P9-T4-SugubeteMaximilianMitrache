/**
 * Microsoft Graph API Email Service
 * 
 * Uses the Microsoft Graph API to send emails via a registered Azure AD application.
 * This is the specification-mandated approach for bulk group messaging.
 * 
 * Required .env configuration:
 *   GRAPH_TENANT_ID     - Azure AD tenant ID
 *   GRAPH_CLIENT_ID     - Azure AD application (client) ID
 *   GRAPH_CLIENT_SECRET  - Azure AD client secret
 *   GRAPH_SENDER_EMAIL   - The mailbox to send from (e.g., secretariat@ucv.ro)
 * 
 * Required Azure AD App Permissions (Application type):
 *   - Mail.Send
 * 
 * @see https://learn.microsoft.com/en-us/graph/api/user-sendmail
 */

const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

let graphClient = null;

/**
 * Initialize the Microsoft Graph client using client credentials flow.
 */
function getGraphClient() {
  if (graphClient) return graphClient;

  const tenantId = process.env.GRAPH_TENANT_ID;
  const clientId = process.env.GRAPH_CLIENT_ID;
  const clientSecret = process.env.GRAPH_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      '[GraphEmail] Missing required env vars: GRAPH_TENANT_ID, GRAPH_CLIENT_ID, GRAPH_CLIENT_SECRET'
    );
  }

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  graphClient = Client.initWithMiddleware({
    authProvider,
  });

  console.log('[GraphEmail] Microsoft Graph client initialized for tenant:', tenantId);
  return graphClient;
}

/**
 * Build a Graph API message object from our standard options.
 */
function buildGraphMessage({ to, subject, text, html }) {
  const recipients = Array.isArray(to) ? to : [to];

  return {
    message: {
      subject,
      body: {
        contentType: html ? 'HTML' : 'Text',
        content: html || text,
      },
      toRecipients: recipients.map((email) => ({
        emailAddress: { address: email },
      })),
    },
    saveToSentItems: true,
  };
}

/**
 * Send a single email via Microsoft Graph API.
 * 
 * @param {Object} options
 * @param {string} options.from - Sender (used to determine the mailbox, falls back to GRAPH_SENDER_EMAIL)
 * @param {string|string[]} options.to - Recipient(s)
 * @param {string} options.subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @returns {Object} { success, messageId, previewUrl }
 */
async function sendMail({ from, to, subject, text, html }) {
  const client = getGraphClient();
  const senderEmail = from || process.env.GRAPH_SENDER_EMAIL;

  if (!senderEmail) {
    throw new Error('[GraphEmail] No sender email configured. Set GRAPH_SENDER_EMAIL in .env');
  }

  const recipients = Array.isArray(to) ? to : [to];
  const message = buildGraphMessage({ to: recipients, subject, text, html });

  await client
    .api(`/users/${senderEmail}/sendMail`)
    .post(message);

  console.log('[GraphEmail] Email sent to %d recipients via Graph API', recipients.length);

  return {
    success: true,
    messageId: null, // Graph API doesn't return messageId on sendMail
    previewUrl: null,
    provider: 'graph',
  };
}

/**
 * Send bulk messages via Microsoft Graph API.
 * 
 * Uses Graph API $batch endpoint for efficient bulk sending.
 * Messages are batched in groups of 20 (Graph API batch limit).
 * Each recipient gets an individual email for proper privacy/delivery.
 * 
 * @param {Object} options
 * @param {string} options.from - Sender mailbox
 * @param {string[]} options.recipients - Array of email addresses
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} options.html
 * @returns {Object} { success, totalSent, failures }
 */
async function sendBulk({ from, recipients, subject, text, html }) {
  const client = getGraphClient();
  const senderEmail = from || process.env.GRAPH_SENDER_EMAIL;

  if (!senderEmail) {
    throw new Error('[GraphEmail] No sender email configured. Set GRAPH_SENDER_EMAIL in .env');
  }

  const BATCH_SIZE = 20; // Graph API batch limit
  let totalSent = 0;
  const failures = [];

  // Split recipients into batches
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);

    const batchRequests = batch.map((email, index) => ({
      id: `${i + index}`,
      method: 'POST',
      url: `/users/${senderEmail}/sendMail`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        message: {
          subject,
          body: {
            contentType: html ? 'HTML' : 'Text',
            content: html || text,
          },
          toRecipients: [
            { emailAddress: { address: email } },
          ],
        },
        saveToSentItems: false, // Don't clutter sent items for bulk
      },
    }));

    try {
      const batchResponse = await client
        .api('/$batch')
        .post({ requests: batchRequests });

      // Process batch results
      for (const response of batchResponse.responses) {
        if (response.status >= 200 && response.status < 300) {
          totalSent++;
        } else {
          failures.push({
            email: batch[parseInt(response.id) - i],
            status: response.status,
            error: response.body?.error?.message || 'Unknown error',
          });
        }
      }
    } catch (batchError) {
      console.error(`[GraphEmail] Batch error (offset ${i}):`, batchError.message);
      // Mark all in this batch as failed
      batch.forEach((email) => {
        failures.push({ email, status: 500, error: batchError.message });
      });
    }

    // Rate limiting: small delay between batches to respect throttling
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  console.log(
    '[GraphEmail] Bulk send complete: %d sent, %d failed out of %d total',
    totalSent, failures.length, recipients.length
  );

  return {
    success: failures.length === 0,
    totalSent,
    totalFailed: failures.length,
    failures: failures.length > 0 ? failures : undefined,
    previewUrl: null,
    provider: 'graph',
  };
}

/**
 * Returns provider name for logging/diagnostics.
 */
function getProviderName() {
  return 'Microsoft Graph API';
}

module.exports = { sendMail, sendBulk, getProviderName };
