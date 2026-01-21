import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

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
        "@noble/hashes/blake2": "blake2",
        "@noble/hashes/sha2": "sha2",
        "@noble/hashes/hmac": "hmac",
        "@noble/hashes/pbkdf2": "pbkdf2",
        "@noble/curves/ed25519": "ed25519",
        "@taquito/utils": "utils",
        "@taquito/core": "core",
        "elliptic": "elliptic",
        "elliptic/lib/elliptic/ec/key": "KeyPair",
        "@stablelib/hmac": "hmac",
        "bn.js": "BN",
        "@noble/curves/bls12-381": "bls12381",
        "@noble/curves/secp256k1": "secp256k1",
        "@noble/curves/nist.js": "nist",
        "@noble/curves/nist": "nist",
        "@stablelib/nacl": "nacl",
        "bip39": "Bip39",
        "typedarray-to-buffer": "toBuffer"
      }
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    '@noble/hashes/blake2',
    '@noble/hashes/hmac',
    '@noble/hashes/sha2',
    '@noble/hashes/pbkdf2',
    '@noble/curves/ed25519',
    '@taquito/utils',
    '@taquito/core',
    'elliptic',
    'elliptic/lib/elliptic/ec/key',
    '@stablelib/hmac',
    'bn.js',
    '@noble/curves/bls12-381',
    '@noble/curves/secp256k1',
    '@noble/curves/nist.js',
    '@noble/curves/nist',
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
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),
    nodePolyfills(),
  ],
};
