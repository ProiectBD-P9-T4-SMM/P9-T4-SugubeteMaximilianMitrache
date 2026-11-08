'use strict';
// Same-origin demo: CORS is not needed.
module.exports = function () {
  return function (_req, _res, next) { next(); };
};
