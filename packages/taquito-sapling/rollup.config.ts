import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const pkg = require('./package.json');

const libraryName = 'taquito-sapling';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    { 
      file: pkg.main, 
      name: camelCase(libraryName), 
      format: 'umd', 
      sourcemap: true, 
      globals: { 
        "bignumber.js": "BigNumber",
        "@taquito/taquito": "taquito",
        "@taquito/utils": "utils",
        "@taquito/core": "core",
        "@airgap/sapling-wasm": "sapling",
        "blakejs": "blake",
        "@stablelib/nacl": "nacl",
        "@stablelib/random": "random",
        "bip39": "bip39",
        "typedarray-to-buffer": "toBuffer",
        "pbkdf2": "pbkdf2"
      }
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    'typedarray-to-buffer',
    'blakejs',
    '../saplingOutputParams',
    '../saplingSpendParams',
    '@taquito/core',
    '@taquito/utils',
    'bignumber.js',
    '@airgap/sapling-wasm',
    '@stablelib/nacl',
    'pbkdf2',
    'bip39',
    '@stablelib/random',
    '@taquito/taquito'
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
