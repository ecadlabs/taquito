// import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import json from 'rollup-plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const pkg = require('./package.json');

const libraryName = 'taquito-wallet-connect';

export default {
  input: `dist/lib/${libraryName}.js`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {
        '@walletconnect/sign-client': 'walletconnectSignClient',
        '@walletconnect/modal': 'walletconnectModal',
        '@walletconnect/utils': 'walletconnectUtils',
        '@taquito/taquito': 'taquito',
      },
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  external: [
    '@walletconnect/sign-client',
    '@walletconnect/modal',
    '@walletconnect/utils',
    '@taquito/taquito',
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

    // Resolve source maps to the original source
    // sourceMaps(),
  ],
};
