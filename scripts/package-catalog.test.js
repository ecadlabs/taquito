const test = require('node:test');
const assert = require('node:assert/strict');

const { escapeCell } = require('./package-catalog.js');

test('escapeCell escapes backslashes before pipes and flattens newlines', () => {
  assert.equal(escapeCell('docs\\guide|notes\nnext line'), 'docs\\\\guide\\|notes next line');
});
