import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const pkg = require('./package.json');

const libraryName = 'taquito-beacon-wallet';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {
        '@airgap/beacon-sdk': 'beacon',
        '@taquito/core': 'taquitoCore',
        '@airgap/beacon-dapp': 'beaconDapp',
        'typedarray-to-buffer': 'typedarrayToBuffer',
        '@taquito/taquito': 'taquito',
        '@taquito/utils': 'taquitoUtils',
      },
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  watch: {
    include: 'src/**',
  },
  external: [
    '@airgap/beacon-sdk',
    '@airgap/beacon-dapp',
    '@taquito/core',
    'typedarray-to-buffer',
    '@taquito/taquito',
    '@taquito/utils',
  ],
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),
    nodePolyfills(),
  ],
};
