#!/usr/bin/env node
/**
 * Exercise the browser backend bundle in Node against PGlite.
 * This is the same code path the static demo runs, minus IndexedDB.
 */
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sql = fs.readFileSync(path.join(root, 'demo', 'afsms-demo-browser.sql'), 'utf8');

const backend = await import(path.join(root, 'src', 'demo', '.generated', 'backend.js'));

const db = new PGlite();
const t0 = Date.now();
await db.exec(sql);
await db.exec('SET search_path TO public');
backend.bindDatabase(db);
await new Promise((resolve) => setTimeout(resolve, 400));
console.log(`db ready in ${Date.now() - t0} ms`);

async function call(method, target, options = {}) {
  const [pathname, search] = target.split('?');
  const query = {};
  if (search) {
    new URLSearchParams(search).forEach((value, key) => { query[key] = value; });
  }
  const headers = {};
  if (options.token) headers.authorization = 'Bearer ' + options.token;
  const res = await backend.dispatch(backend.getApp(), {
    method,
    path: pathname,
    url: target,
    query,
    params: {},
    body: options.body || {},
    headers,
  });
  return { status: res.statusCode, data: res.body, headers: res.headers };
}

function show(label, result) {
  const size = result.data && typeof result.data === 'object' && !(result.data instanceof Uint8Array)
    ? JSON.stringify(result.data).length + 'B'
    : (result.data instanceof Uint8Array ? result.data.length + 'B' : String(result.data).length + 'B');
  console.log('  ' + label.padEnd(42), result.status, size);
  return result;
}

console.log('--- login chain ---');
const sso = show('POST /api/mock-sso/login', await call('POST', '/api/mock-sso/login', { body: { role_simulation: 'ADMIN' } }));
const adminToken = sso.data && sso.data.ssoToken;
const token = show('POST /api/auth/exchange-token', await call('POST', '/api/auth/exchange-token', { body: { ssoToken: adminToken } })).data.token;

console.log('--- read endpoints ---');
for (const endpoint of [
  '/api/lookup/academic-years',
  '/api/lookup/study-formations',
  '/api/lookup/disciplines',
  '/api/academic/specializations',
  '/api/academic/students',
  '/api/academic/dashboard/stats',
  '/api/admin/roles',
  '/api/audit?limit=5',
  '/api/config/settings',
  '/api/groups',
  '/api/public/settings',
]) {
  show(endpoint, await call('GET', endpoint, { token }));
}

console.log('--- document download ---');
const docs = await call('GET', '/api/documents', { token });
show('GET /api/documents', docs);
const first = (docs.data && (docs.data.documents || docs.data))[0];
if (first && first.id) {
  show('GET /api/documents/download/:id', await call('GET', '/api/documents/download/' + first.id, { token }));
}

console.log('--- traversal guard ---');
show('download traversal', await call('GET', '/api/admin/backups/download/..%2F..%2F..%2F..%2F..%2Fetc%2Fhostname', { token }));

console.log('--- roles ---');
for (const role of ['STUDENT', 'PROFESSOR', 'SECRETARIAT', 'ADMIN']) {
  const s = await call('POST', '/api/mock-sso/login', { body: { role_simulation: role } });
  const t = await call('POST', '/api/auth/exchange-token', { body: { ssoToken: s.data.ssoToken } });
  const dash = await call('GET', '/api/academic/dashboard/stats', { token: t.data.token });
  const audit = await call('GET', '/api/audit?limit=1', { token: t.data.token });
  console.log('  ' + role.padEnd(12), 'dashboard', dash.status, '| audit', audit.status);
}

console.log('--- write path (create + rollback through audit) ---');
const created = await call('POST', '/api/groups', {
  token,
  body: { name: 'Demo group ' + Date.now(), description: 'created by the demo test' },
});
show('POST /api/groups', created);
const list = await call('GET', '/api/groups', { token });
show('GET /api/groups (after create)', list);

await db.close();
console.log('done');
