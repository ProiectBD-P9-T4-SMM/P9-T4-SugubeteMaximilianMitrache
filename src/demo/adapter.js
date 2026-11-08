// Axios adapter that sends requests to the in-browser Express app instead of
// the network. One request runs at a time so explicit BEGIN/COMMIT blocks
// cannot interleave on PGlite's single connection.
import { getApp, dispatch } from './.generated/backend.js';

function parseSearch(search) {
  const out = {};
  if (!search) return out;
  new URLSearchParams(search).forEach(function (value, key) {
    out[key] = value;
  });
  return out;
}

function normalizeQuery(query) {
  const out = {};
  Object.keys(query || {}).forEach(function (key) {
    const value = query[key];
    if (value === undefined || value === null) return;
    out[key] = Array.isArray(value) ? value.map(String) : String(value);
  });
  return out;
}

export function installDemoAdapter(api) {
  let queue = Promise.resolve();

  api.defaults.adapter = function (config) {
    async function execute() {
      const url = config.url || '';
      const base = config.baseURL || '';
      const full = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : base + url;
      let pathname;
      let search = '';
      try {
        const parsed = new URL(full, 'http://demo.local');
        pathname = parsed.pathname || '/';
        search = parsed.search.replace(/^\?/, '');
      } catch (_err) {
        const split = full.split('?');
        pathname = split[0] || '/';
        search = split[1] || '';
      }
      const query = Object.assign({}, parseSearch(search), normalizeQuery(config.params));

      let body = {};
      if (typeof config.data === 'string' && config.data) {
        try {
          body = JSON.parse(config.data);
        } catch (_err) {
          body = config.data;
        }
      } else if (config.data) {
        body = config.data;
      }

      const headers = {};
      const source = config.headers || {};
      Object.keys(source).forEach(function (key) {
        const value = source[key];
        if (value !== undefined && value !== null) headers[key.toLowerCase()] = String(value);
      });

      const res = await dispatch(getApp(), {
        method: String(config.method || 'get').toUpperCase(),
        path: pathname,
        url: full,
        query: query,
        params: {},
        body: body,
        headers: headers,
      });

      if (import.meta.env.DEV && typeof window !== 'undefined') {
        window.__AFSMS_DEMO_LOG__ = window.__AFSMS_DEMO_LOG__ || [];
        window.__AFSMS_DEMO_LOG__.push({
          method: String(config.method || 'get').toUpperCase(),
          url: full,
          status: res.statusCode,
          bodyType: Array.isArray(res.body) ? 'array[' + res.body.length + ']' : (res.body === undefined ? 'undefined' : typeof res.body),
        });
      }

      const response = {
        data: res.body,
        status: res.statusCode,
        statusText: '',
        headers: res.headers,
        config: config,
        request: {},
      };

      if (config.responseType === 'blob' && res.body instanceof Uint8Array) {
        response.data = new Blob([res.body], { type: res.headers['content-type'] || 'application/octet-stream' });
      }

      const validate = config.validateStatus || function (status) {
        return status >= 200 && status < 300;
      };
      if (!validate(res.statusCode)) {
        const error = new Error('Request failed with status code ' + res.statusCode);
        error.config = config;
        error.response = response;
        error.isAxiosError = true;
        throw error;
      }
      return response;
    }

    const next = queue.then(execute, execute);
    queue = next.catch(function () {});
    return next;
  };
}
