'use strict';

// Read-only filesystem for the browser demo. The only files that exist are
// the sample uploads bundled with the demo; everything else is a no-op.

const assets = require('./assets.js');

function lookup(filePath) {
  return assets.byPath(filePath);
}

const api = {
  constants: { W_OK: 2, R_OK: 4, F_OK: 0 },

  existsSync: function (filePath) {
    return Boolean(lookup(filePath));
  },

  readFileSync: function (filePath, encoding) {
    const file = lookup(filePath);
    if (!file) {
      const err = new Error("ENOENT: no such file or directory, open '" + filePath + "'");
      err.code = 'ENOENT';
      throw err;
    }
    if (encoding) {
      if (encoding === 'base64') {
        let binary = '';
        for (let i = 0; i < file.bytes.length; i += 1) binary += String.fromCharCode(file.bytes[i]);
        return btoa(binary);
      }
      return new TextDecoder().decode(file.bytes);
    }
    return file.bytes;
  },

  writeFileSync: function () {},
  appendFileSync: function () {},
  mkdirSync: function () {},
  unlinkSync: function () {},
  rmSync: function () {},
  accessSync: function () {},
  readdirSync: function () { return []; },
  statSync: function () { return { size: 0, birthtime: new Date(0), isFile: function () { return false; } }; },
  createReadStream: function () { throw new Error('streams are not available in the demo'); },
  createWriteStream: function () { throw new Error('streams are not available in the demo'); },
};

api.promises = {
  writeFile: async function () {},
  readFile: async function (filePath, encoding) { return api.readFileSync(filePath, encoding); },
  mkdir: async function () {},
  unlink: async function () {},
  readdir: async function () { return []; },
  stat: async function () { return api.statSync(); },
  access: async function () {},
};

module.exports = api;
