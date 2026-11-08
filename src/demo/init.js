// Boot the static demo: a WASM PostgreSQL seeded from the real database dump,
// with the real Express routes running in this tab.
import { PGlite } from '@electric-sql/pglite';
import sql from '../../demo/afsms-demo-browser.sql?raw';
import { bindDatabase } from './.generated/backend.js';
import api from '../services/api.js';
import { installDemoAdapter } from './adapter.js';

export async function initDemo() {
  // `.env.local` points the normal build at the hosted API. The demo never
  // leaves the tab, so force the instance onto the same origin.
  api.defaults.baseURL = '/api';

  const db = new PGlite();
  await db.exec(sql);
  // pg_dump clears search_path for the import; the application queries are
  // unqualified, so restore the normal schema.
  await db.exec('SET search_path TO public');
  bindDatabase(db);
  installDemoAdapter(api);
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    window.__AFSMS_DEMO__ = { api: api, db: db };
  }
  return db;
}
