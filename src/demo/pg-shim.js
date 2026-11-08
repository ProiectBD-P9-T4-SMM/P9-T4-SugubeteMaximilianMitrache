'use strict';

/**
 * A `pg`-compatible facade over an in-process PGlite instance.
 *
 * It exposes the small surface the application uses: Pool#query,
 * Pool#connect (for explicit BEGIN/COMMIT blocks), Client#query and
 * Client#release. Queries wait for the database to be bound, so the server
 * can be imported before PGlite has finished loading.
 */

let database = null;
let resolveReady;
const ready = new Promise(function (resolve) {
  resolveReady = resolve;
});

function bindDatabase(instance) {
  database = instance;
  resolveReady();
}

function normalize(result) {
  const rows = (result && result.rows) || [];
  let rowCount = rows.length;
  if (result && typeof result.affectedRows === 'number') rowCount = result.affectedRows;
  if (result && typeof result.rowCount === 'number') rowCount = result.rowCount;
  return {
    rows: rows,
    rowCount: rowCount,
    fields: (result && result.fields) || [],
    command: result && result.command,
  };
}

async function run(text, params) {
  await ready;
  const result = await database.query(text, params || []);
  return normalize(result);
}

class Client {
  constructor() {}

  on() {
    return this;
  }

  async connect() {
    await ready;
    return this;
  }

  async query(text, params) {
    return run(text, params);
  }

  release() {}

  async end() {}
}

class Pool extends Client {
  constructor() {
    super();
  }

  async connect() {
    await ready;
    return new Client();
  }
}

module.exports = {
  Pool: Pool,
  Client: Client,
  bindDatabase: bindDatabase,
  ready: ready,
};
