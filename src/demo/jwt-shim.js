'use strict';

// HS256 JWT sign/verify using a synchronous SHA-256 implementation, so the
// backend's `jsonwebtoken` calls work unchanged in a browser tab.

const sha256 = require('js-sha256');

function bytesToHex(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; i += 1) out += bytes[i].toString(16).padStart(2, '0');
  return out;
}

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

function bytesToB64url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(value) {
  const text = String(value).replace(/-/g, '+').replace(/_/g, '/');
  const padded = text + '='.repeat((4 - (text.length % 4)) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

function b64url(value) {
  return bytesToB64url(new TextEncoder().encode(value));
}

function parseDuration(value) {
  if (typeof value === 'number') return value;
  const match = String(value).trim().match(/^(\d+)\s*(s|m|h|d)?$/i);
  if (!match) return 0;
  const amount = parseInt(match[1], 10);
  const unit = (match[2] || 's').toLowerCase();
  return amount * ({ s: 1, m: 60, h: 3600, d: 86400 }[unit] || 1);
}

function signature(input, secret) {
  return bytesToB64url(hexToBytes(sha256.hmac(String(secret), input)));
}

function sign(payload, secret, options) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = Object.assign({}, payload);
  if (body.iat === undefined) body.iat = now;
  if (options && options.expiresIn) body.exp = now + parseDuration(options.expiresIn);

  const head = b64url(JSON.stringify(header));
  const data = b64url(JSON.stringify(body));
  return head + '.' + data + '.' + signature(head + '.' + data, secret);
}

function verify(token, secret, callback) {
  try {
    const parts = String(token).split('.');
    if (parts.length !== 3) throw new Error('jwt malformed');
    if (signature(parts[0] + '.' + parts[1], secret) !== parts[2]) throw new Error('invalid signature');

    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) throw new Error('jwt expired');
    if (payload.nbf && payload.nbf > now) throw new Error('jwt not active');

    if (typeof callback === 'function') {
      callback(null, payload);
      return undefined;
    }
    return payload;
  } catch (err) {
    if (typeof callback === 'function') {
      callback(err);
      return undefined;
    }
    throw err;
  }
}

module.exports = {
  sign: sign,
  verify: verify,
  decode: function (token) {
    const parts = String(token).split('.');
    if (parts.length < 2) return null;
    try {
      return JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));
    } catch (_err) {
      return null;
    }
  },
};
