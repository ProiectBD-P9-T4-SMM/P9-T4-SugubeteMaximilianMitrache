'use strict';

// Uploads are disabled in the static demo: multer's middleware simply calls
// next(), so routes see `req.file === undefined` and return their normal
// validation error instead of crashing.
function multer() {
  const middleware = function (_req, _res, next) { next(); };
  middleware.single = function () { return function (_req, _res, next) { next(); }; };
  middleware.array = middleware.single;
  middleware.fields = middleware.single;
  middleware.none = middleware.single;
  middleware.any = middleware.single;
  return middleware;
}
multer.diskStorage = function () { return {}; };
multer.memoryStorage = function () { return {}; };
module.exports = multer;
