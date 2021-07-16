#! /usr/bin/env node
console.log('contract-type-generator', { __dirname, __filename });
// const cli = require('../dist/lib/cli');
const cli = require('../dist/taquito-contract-type-generator.umd');
cli.run();
