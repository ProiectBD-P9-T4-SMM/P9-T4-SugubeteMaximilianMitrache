'use strict';

// Background jobs are pointless in a per-visitor demo; keep the scheduler
// quiet but API-compatible.
function job() { return { start: function () {}, stop: function () {} }; }
module.exports = {
  schedule: function () { return job(); },
  validate: function () { return true; },
  getTasks: function () { return new Map(); },
};
