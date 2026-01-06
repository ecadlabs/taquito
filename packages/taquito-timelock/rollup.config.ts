import camelCase from 'lodash.camelcase';
import json from 'rollup-plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const pkg = require('./package.json');

const libraryName = 'taquito-timelock';

export default {
  input: `dist/lib/taquito-timelock.js`,
  output: [
    { 
      file: pkg.main, 
      name: camelCase(libraryName), 
      format: 'umd', 
      sourcemap: true, 
      globals: { 
        "@stablelib/nacl": "nacl",
        "big-integer": "bigInt",
        "@stablelib/blake2b": "blake2b"
      } 
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
  '@stablelib/blake2b',
  '@stablelib/nacl',
  'big-integer',
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    resolve(),
    commonjs(),
    // Compile TypeScript files
    nodePolyfills({
      exclude: ['crypto'], // Use native crypto (globalThis.crypto) in Node.js 20+
    }),
  ],
};
