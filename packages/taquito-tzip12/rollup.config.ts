import camelCase from 'lodash.camelcase';
import json from 'rollup-plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');

const libraryName = 'taquito-tzip12';

export default {
  input: `dist/lib/${libraryName}.js`,
  output: [
    { 
      file: pkg.main, 
      name: camelCase(libraryName), 
      format: 'umd', 
      sourcemap: true, 
      globals: { 
        "@taquito/core": "taquitoCore",
        "@taquito/michelson-encoder": "michelsonEncoder",
        "@taquito/tzip16": "tzip16",
        "@taquito/utils": "utils"
      } 
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
  '@taquito/core',
  '@taquito/michelson-encoder',
  '@taquito/tzip16',
  '@taquito/utils',
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    resolve(),
    commonjs(),
    // Compile TypeScript files
  ],
};
