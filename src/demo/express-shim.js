'use strict';

/**
 * A very small subset of Express that is enough for the AFSMS route files.
 *
 * It supports app.use(path?, fn), app.get/post/put/delete/patch, nested
 * routers, middleware chains, next(err) and the 4-argument error handler.
 * It is only used by the static browser demo; the Node build keeps real
 * Express.
 */

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_err) {
    return value;
  }
}

function matchRoute(pattern, path) {
  if (pattern === '*' || pattern === '/*') return {};
  const want = pattern.split('/').filter(Boolean);
  const got = path.split('/').filter(Boolean);
  if (want.length !== got.length) return null;
  const params = {};
  for (let i = 0; i < want.length; i += 1) {
    if (want[i].charAt(0) === ':') {
      params[want[i].slice(1)] = decode(got[i]);
    } else if (want[i] !== got[i]) {
      return null;
    }
  }
  return params;
}

function prefixMatch(prefix, path) {
  if (prefix === '/' || prefix === '') return path || '/';
  if (path === prefix) return '/';
  if (path.indexOf(prefix + '/') === 0) return path.slice(prefix.length);
  return null;
}

function run(layers, req, res, done, base) {
  let index = 0;
  let settled = false;
  const mount = base || '';

  function subPath() {
    if (!mount) return req.path || '/';
    if (req.path === mount) return '/';
    if (req.path.indexOf(mount + '/') === 0) return req.path.slice(mount.length);
    return req.path || '/';
  }

  function finish(err) {
    if (settled) return;
    settled = true;
    done(err);
  }

  function call(fn, args, next) {
    let result;
    try {
      result = fn.apply(null, args);
    } catch (err) {
      next(err);
      return;
    }
    if (result && typeof result.then === 'function') {
      result.then(function () {
        if (res._done) finish();
      }).catch(function (err) {
        next(err);
      });
    } else if (res._done) {
      finish();
    } else {
      void next;
    }
  }

  function handleError(err) {
    while (index < layers.length) {
      const layer = layers[index];
      index += 1;
      const path = subPath();
      if (layer.kind === 'use' && prefixMatch(layer.path, path) === null) continue;
      if (layer.fn && layer.fn.length === 4) {
        call(layer.fn, [err, req, res, function (nextErr) {
          if (nextErr) handleError(nextErr);
          else finish();
        }], handleError);
        return;
      }
    }
    finish(err);
  }

  function step() {
    while (index < layers.length) {
      const layer = layers[index];
      index += 1;
      const path = subPath();

      if (layer.kind === 'use') {
        const child = prefixMatch(layer.path, path);
        if (child === null) continue;
        if (layer.fn && layer.fn.length === 4) continue; // error handler in normal flow

        if (layer.fn && typeof layer.fn.handle === 'function') {
          const childBase = layer.path === '/' ? mount : mount + layer.path;
          const childDone = function (err) {
            if (err) handleError(err);
            else step();
          };
          call(function () { return layer.fn.handle(req, res, childDone, childBase); }, [], handleError);
          return;
        }

        call(layer.fn, [req, res, function (err) {
          if (err) handleError(err);
          else step();
        }], handleError);
        return;
      }

      const method = String(req.method || 'GET').toLowerCase();
      if (layer.method !== 'all' && layer.method !== method) continue;

      const params = matchRoute(layer.path, path);
      if (!params) continue;

      req.params = Object.assign({}, req.params, params);
      call(layer.fn, [req, res, function (err) {
        if (err) handleError(err);
        else step();
      }], handleError);
      return;
    }
    finish();
  }

  step();
}

function createRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    locals: {},
    _done: false,
  };

  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.setHeader = function (name, value) {
    res.headers[String(name).toLowerCase()] = value;
    return res;
  };
  res.getHeader = function (name) {
    return res.headers[String(name).toLowerCase()];
  };
  res.removeHeader = function (name) {
    delete res.headers[String(name).toLowerCase()];
  };
  res.json = function (value) {
    res.body = value;
    res.headers['content-type'] = 'application/json; charset=utf-8';
    res._done = true;
    return res;
  };
  res.send = function (value) {
    if (value && typeof value === 'object' && !(value instanceof Uint8Array)) {
      return res.json(value);
    }
    res.body = value;
    if (value instanceof Uint8Array) res.headers['content-type'] = 'application/octet-stream';
    else if (!res.headers['content-type']) res.headers['content-type'] = 'text/html; charset=utf-8';
    res._done = true;
    return res;
  };
  res.end = function (value) {
    if (value !== undefined) res.body = value;
    res._done = true;
    return res;
  };
  res.on = function () {
    return res;
  };
  res.download = function (filePath, filename) {
    const assets = require('./assets.js');
    const file = assets.byPath(filePath);
    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return res;
    }
    res.body = file.bytes;
    res.headers['content-type'] = file.type;
    res.headers['content-disposition'] = 'attachment; filename="' + (filename || assets.basename(filePath)) + '"';
    res._done = true;
    return res;
  };
  res.sendFile = function (filePath) {
    return res.download(filePath);
  };
  return res;
}

function createRouter() {
  const layers = [];
  const router = { layers: layers };

  router.use = function () {
    const args = Array.prototype.slice.call(arguments);
    let path = '/';
    if (typeof args[0] === 'string') {
      path = args[0];
      args.shift();
    }
    args.forEach(function (fn) {
      if (Array.isArray(fn)) fn.forEach(function (inner) { layers.push({ kind: 'use', path: path, fn: inner }); });
      else layers.push({ kind: 'use', path: path, fn: fn });
    });
    return router;
  };

  ['get', 'post', 'put', 'delete', 'patch', 'all'].forEach(function (method) {
    router[method] = function (path) {
      const handlers = Array.prototype.slice.call(arguments, 1);
      handlers.forEach(function (fn) {
        layers.push({ kind: method === 'all' ? 'all' : 'route', method: method, path: path, fn: fn });
      });
      return router;
    };
  });

  router.handle = function (req, res, done, base) {
    run(layers, req, res, done, base);
  };

  return router;
}

function express() {
  const app = createRouter();
  app.listen = function (_port, callback) {
    if (typeof globalThis !== 'undefined') globalThis.__AFSMS_APP__ = app;
    if (typeof callback === 'function') callback();
    return app;
  };
  return app;
}

express.Router = createRouter;
express.json = function () {
  return function (_req, _res, next) { next(); };
};
express.urlencoded = express.json;
express.static = function () {
  return function (_req, _res, next) { next(); };
};

function dispatch(app, req) {
  return new Promise(function (resolve) {
    const res = createRes();
    app.handle(req, res, function () {
      if (!res._done) {
        res.statusCode = 404;
        res.body = { error: true, message: 'Not Found' };
      }
      resolve(res);
    }, '');
  });
}

module.exports = express;
module.exports.dispatch = dispatch;
module.exports.createRes = createRes;
