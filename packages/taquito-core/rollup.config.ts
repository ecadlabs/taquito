import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import { cjsEsmBridge } from '../../scripts/cjs-esm-bridge.mjs';

const pkg = require('./package.json');

const libraryName = 'taquito-core';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    cjsEsmBridge(pkg),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ tsconfig: './tsconfig.prod.json', useTsconfigDeclarationDir: true }),
  ],
};
