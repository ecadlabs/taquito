import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');

const libraryName = 'taquito-beacon-wallet';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    { file: pkg.browser, name: camelCase(libraryName), format: 'umd', sourcemap: true, globals: { '@airgap/beacon-sdk': 'beacon'} },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    nodeResolve({
      browser: true,
    }),
    // nodePolyfills({
    //   include: ['buffer'],
    // }),  
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),
  ],
};
