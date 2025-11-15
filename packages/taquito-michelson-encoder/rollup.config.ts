import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const pkg = require('./package.json');

const libraryName = 'taquito-michelson-encoder';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      globals: {
        'fast-json-stable-stringify': 'stringify',
        '@taquito/core': 'taquitoCore',
        'bignumber.js': 'BigNumber',
        '@taquito/utils': 'taquitoUtils',
        elliptic: 'elliptic',
      },
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    'fast-json-stable-stringify',
    '@taquito/core',
    '@taquito/rpc',
    'bignumber.js',
    '@taquito/utils',
    'elliptic',
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
