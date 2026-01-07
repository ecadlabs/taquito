import camelCase from 'lodash.camelcase';
import json from 'rollup-plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const pkg = require('./package.json');

const libraryName = 'taquito-rpc';

export default {
  input: `dist/lib/${libraryName}.js`,
  output: [
    { 
      file: pkg.main, 
      name: camelCase(libraryName), 
      format: 'umd', 
      sourcemap: true, 
      globals: { 
        '@taquito/http-utils': 'httpUtils',
        'bignumber.js': 'BigNumber',
        '@taquito/utils': 'utils',
        '@taquito/core': 'core',
      } 
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
  'bignumber.js',
  '@taquito/core',
  '@taquito/utils',
  '@taquito/http-utils',
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
    nodePolyfills(),
  ],
};
