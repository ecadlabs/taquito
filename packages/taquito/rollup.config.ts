import camelCase from 'lodash.camelcase';
import json from 'rollup-plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const pkg = require('./package.json');

const libraryName = 'taquito';

export default {
  input: `dist/lib/${libraryName}.js`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {
        '@taquito/rpc': 'rpc',
        '@taquito/http-utils': 'httpUtils',
        '@taquito/core': 'core',
        'rxjs': 'rxjs',
        'rxjs/operators': 'operators',
        '@taquito/michelson-encoder': 'michelsonEncoder',
        '@taquito/utils': 'utils',
        'bignumber.js': 'BigNumber',
        '@taquito/michel-codec': 'michelCodec',
        '@taquito/local-forging': 'localForging',
        '@taquito/signer': 'taquitoSigner'
      }
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    '@taquito/http-utils',
    '@taquito/core',
    '@taquito/rpc',
    '@taquito/utils',
    '@taquito/michelson-encoder',
    '@taquito/michel-codec',
    '@taquito/local-forging',
    '@taquito/signer',
    'rxjs',
    'rxjs/operators',
    'bignumber.js'
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
