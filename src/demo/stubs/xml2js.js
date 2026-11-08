'use strict';
function escape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
class Builder {
  constructor(options) { this.options = options || {}; }
  buildObject(value) {
    const root = this.options.rootName || 'root';
    const item = this.options.itemName || 'item';
    const rows = Array.isArray(value) ? value : [value];
    const body = rows.map(function (row) {
      const fields = Object.keys(row || {}).map(function (key) {
        return '<' + key + '>' + escape(row[key]) + '</' + key + '>';
      }).join('');
      return '<' + item + '>' + fields + '</' + item + '>';
    }).join('');
    return '<?xml version="1.0" encoding="UTF-8"?><' + root + '>' + body + '</' + root + '>';
  }
}
module.exports = {
  Builder: Builder,
  parseStringPromise: async function () { return {}; },
};
