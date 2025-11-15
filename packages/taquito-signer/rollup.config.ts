import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

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
        "@stablelib/blake2b": "blake2b",
        "@stablelib/ed25519": "ed25519$1",
        "@taquito/utils": "utils",
        "@taquito/core": "core",
        "elliptic": "elliptic",
        "elliptic/lib/elliptic/ec/key": "KeyPair",
        "@stablelib/hmac": "hmac",
        "@stablelib/sha512": "sha512",
        "bn.js": "BN",
        "@noble/curves/bls12-381": "bls12381",
        "@stablelib/nacl": "nacl",
        "pbkdf2": "pbkdf2",
        "bip39": "Bip39",
        "typedarray-to-buffer": "toBuffer"
      } 
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    '@stablelib/blake2b',
    '@stablelib/ed25519',
    '@taquito/utils',
    '@taquito/core',
    'elliptic',
    'elliptic/lib/elliptic/ec/key',
    '@stablelib/hmac',
    '@stablelib/sha512',
    'bn.js',
    '@noble/curves/bls12-381',
    '@stablelib/nacl',
    'pbkdf2',
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
  ],
};
