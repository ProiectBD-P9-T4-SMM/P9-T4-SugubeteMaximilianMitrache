#!/usr/bin/env node
/**
 * Bundle the real Express backend for the browser demo.
 *
 * The route files, services and middleware are used unchanged. Node-only
 * modules are swapped for small browser implementations (see src/demo/*).
 * The output is an ES module that the Vite demo build imports.
 */
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const demo = path.join(root, 'src', 'demo');
const outfile = path.join(demo, '.generated', 'backend.js');

const alias = {
  express: path.join(demo, 'express-shim.js'),
  pg: path.join(demo, 'pg-shim.js'),
  jsonwebtoken: path.join(demo, 'jwt-shim.js'),
  fs: path.join(demo, 'fs-shim.js'),
  path: path.join(demo, 'path-shim.js'),
  multer: path.join(demo, 'multer-shim.js'),
  'node-cron': path.join(demo, 'cron-shim.js'),
  dotenv: path.join(demo, 'dotenv-shim.js'),
  cors: path.join(demo, 'cors-shim.js'),
  '@azure/identity': path.join(demo, 'stubs', 'azure.js'),
  '@microsoft/microsoft-graph-client': path.join(demo, 'stubs', 'graph.js'),
  '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials': path.join(demo, 'stubs', 'graph-credentials.js'),
  nodemailer: path.join(demo, 'stubs', 'nodemailer.js'),
  'pdf-parse': path.join(demo, 'stubs', 'pdf-parse.js'),
  mammoth: path.join(demo, 'stubs', 'mammoth.js'),
  xml2js: path.join(demo, 'stubs', 'xml2js.js'),
};

fs.mkdirSync(path.dirname(outfile), { recursive: true });

const result = await build({
  entryPoints: [path.join(demo, 'backend-entry.js')],
  outfile,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  alias,
  logLevel: 'info',
  legalComments: 'none',
  banner: {
    js: [
      'const __dirname = "/";',
      'const process = { env: { EMAIL_PROVIDER: "mock", NODE_ENV: "production" },',
      '  exit: function () {}, platform: "browser", version: "v22" };',
    ].join('\n'),
  },
  define: {
    global: 'globalThis',
  },
  metafile: true,
});

const bytes = fs.statSync(outfile).size;
console.log(`demo backend: ${(bytes / 1024 / 1024).toFixed(2)} MB -> ${path.relative(root, outfile)}`);
if (result.metafile) {
  const inputs = Object.entries(result.metafile.inputs)
    .map(([name, info]) => [name, info.bytes])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  for (const [name, size] of inputs) {
    console.log(`  ${(size / 1024).toFixed(0).padStart(5)} KB  ${name}`);
  }
}
