'use strict';

// Minimal `path` for the browser demo (POSIX semantics).

function normalize(input) {
  const absolute = input.charAt(0) === '/';
  const parts = input.split('/');
  const out = [];
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (!part || part === '.') continue;
    if (part === '..') {
      if (out.length && out[out.length - 1] !== '..') out.pop();
      else if (!absolute) out.push('..');
    } else {
      out.push(part);
    }
  }
  const joined = out.join('/');
  if (absolute) return '/' + joined;
  return joined || '.';
}

function join() {
  const parts = Array.prototype.slice.call(arguments).filter(function (p) { return p !== '' && p != null; });
  return normalize(parts.join('/'));
}

function resolve() {
  let combined = '';
  for (let i = 0; i < arguments.length; i += 1) {
    const value = arguments[i];
    if (!value) continue;
    combined = value.charAt(0) === '/' || !combined ? String(value) : combined + '/' + value;
  }
  return normalize(combined.charAt(0) === '/' ? combined : '/' + combined);
}

function basename(p, ext) {
  const value = String(p).replace(/\/+$/, '');
  const name = value.slice(value.lastIndexOf('/') + 1) || '/';
  if (ext && name.slice(-ext.length) === ext) return name.slice(0, -ext.length);
  return name;
}

function dirname(p) {
  const value = String(p).replace(/\/+$/, '');
  const index = value.lastIndexOf('/');
  if (index < 0) return '.';
  if (index === 0) return '/';
  return value.slice(0, index);
}

function extname(p) {
  const name = basename(p);
  const index = name.lastIndexOf('.');
  return index > 0 ? name.slice(index) : '';
}

module.exports = {
  join: join,
  resolve: resolve,
  basename: basename,
  dirname: dirname,
  extname: extname,
  sep: '/',
  posix: { join: join, resolve: resolve, basename: basename, dirname: dirname, extname: extname, sep: '/' },
};
