import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const pkg = require('./package.json');

const libraryName = 'taquito-trezor-signer';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {
        '@taquito/core': 'core',
        '@taquito/utils': 'utils',
        '@taquito/local-forging': 'localForging',
        '@trezor/connect-web': 'TrezorConnect',
      },
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    '@taquito/core',
    '@taquito/utils',
    '@taquito/local-forging',
    '@trezor/connect-web',
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    json(),
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),
  ],
};
