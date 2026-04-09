import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');

const libraryName = 'taquito-utils';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {
        buffer: "buffer",
        bs58check: "bs58check",
        "bignumber.js": "BigNumber",
        "typedarray-to-buffer": "toBuffer",
        "@taquito/core": "core",
        "@noble/curves/ed25519": "ed25519",
        "@noble/curves/bls12-381": "bls12381",
        "@noble/curves/secp256k1": "secp256k1",
        "@noble/curves/nist": "nist"
      }
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    'typedarray-to-buffer',
    'blakejs',
    'bs58check',
    '@taquito/core',
    '@noble/curves/ed25519',
    '@noble/curves/bls12-381',
    '@noble/curves/secp256k1',
    '@noble/curves/nist',
    'bignumber.js',
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Resolve node_modules
    resolve(),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),
    nodePolyfills(),
  ],
};
