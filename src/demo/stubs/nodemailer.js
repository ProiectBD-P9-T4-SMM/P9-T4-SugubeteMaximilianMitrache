'use strict';
module.exports = {
  createTestAccount: async function () {
    return { smtp: { host: 'localhost', port: 1025, secure: false }, user: 'demo', pass: 'demo' };
  },
  createTransport: function () {
    return {
      sendMail: async function (message) {
        console.log('[demo] email suppressed:', message && message.to);
        return { messageId: 'demo-' + Date.now() };
      },
    };
  },
};
