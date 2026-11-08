'use strict';
class Client {
  constructor() {}
  static init() { return new Client(); }
  static initWithMiddleware() { return new Client(); }
  api() { return { post: async function () { return {}; } }; }
}
module.exports = { Client: Client };
