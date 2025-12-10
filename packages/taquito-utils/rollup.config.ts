import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

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
        "@stablelib/blake2b": "blake2b",
        bs58check: "bs58check",
        "bignumber.js": "BigNumber",
        "typedarray-to-buffer": "toBuffer",
        "@taquito/core": "core",
        "@stablelib/ed25519": "ed25519",
        elliptic: "elliptic",
        "@noble/curves/bls12-381": "bls12381"
      } 
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    'typedarray-to-buffer',
    'blakejs',
    'bs58check',
    '@stablelib/blake2b',
    '@taquito/core',
    '@stablelib/ed25519',
    'elliptic',
    '@noble/curves/bls12-381',
    'bignumber.js',
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),
    nodePolyfills(),
  ],
};
