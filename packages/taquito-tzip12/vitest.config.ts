import { defineConfig, mergeConfig } from 'vitest/config';
import { definePackageVitestConfig } from '../../vitest.package';

export default mergeConfig(
  definePackageVitestConfig('@taquito/tzip12'),
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/taquito-tzip12.ts'],
      },
    },
  })
);
