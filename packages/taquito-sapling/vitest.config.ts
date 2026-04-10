import { defineConfig, mergeConfig } from 'vitest/config';
import { definePackageVitestConfig } from '../../vitest.package';

export default mergeConfig(
  definePackageVitestConfig('@taquito/sapling'),
  defineConfig({
    test: {
      testTimeout: 30000,
    },
  })
);
