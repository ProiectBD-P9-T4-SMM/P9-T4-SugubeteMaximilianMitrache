'use strict';
class ClientSecretCredential {
  constructor() {}
  async getToken() { return { token: 'demo', expiresOnTimestamp: Date.now() + 3600000 }; }
}
module.exports = { ClientSecretCredential: ClientSecretCredential };
