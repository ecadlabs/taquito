import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const pkg = require('./package.json');

const libraryName = 'taquito-signer';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {
        "@noble/curves/ed25519.js": "ed25519",
        "@taquito/utils": "utils",
        "@taquito/core": "core",
        "@stablelib/hmac": "hmac",
        "bn.js": "BN",
        "@noble/curves/bls12-381.js": "bls12381",
        "@noble/curves/secp256k1.js": "secp256k1",
        "@noble/curves/nist.js": "nist",
        "@stablelib/nacl": "nacl",
        "bip39": "Bip39",
        "typedarray-to-buffer": "toBuffer"
      }
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    '@noble/curves/ed25519.js',
    '@taquito/utils',
    '@taquito/core',
    '@stablelib/hmac',
    'bn.js',
    '@noble/curves/bls12-381.js',
    '@noble/curves/secp256k1.js',
    '@noble/curves/nist.js',
    '@stablelib/nacl',
    'bip39',
    'typedarray-to-buffer'
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Resolve node_modules (needed for @scure/bip39)
    resolve({ preferBuiltins: false }),
    commonjs(),
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),
    nodePolyfills(),
  ],
};
