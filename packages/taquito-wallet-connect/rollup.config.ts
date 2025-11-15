// import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const pkg = require('./package.json');

const libraryName = 'taquito-wallet-connect';

export default {
  input: `src/${libraryName}.ts`,
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
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),

    // Resolve source maps to the original source
    // sourceMaps(),
  ],
};
