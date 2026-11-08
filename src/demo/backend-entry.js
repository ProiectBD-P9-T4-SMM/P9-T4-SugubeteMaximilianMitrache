// Entry point for the browser bundle of the real backend.
import pg from './pg-shim.js';
import expressShim from './express-shim.js';
import '../../backend/src/server.js';

export const bindDatabase = pg.bindDatabase;
export const getApp = function () { return globalThis.__AFSMS_APP__; };
export const dispatch = expressShim.dispatch;
