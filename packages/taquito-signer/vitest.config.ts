import { defineConfig, mergeConfig } from 'vitest/config';
import { definePackageVitestConfig } from '../../vitest.package';

export default mergeConfig(
  definePackageVitestConfig('@taquito/signer'),
  defineConfig({
    test: {
      // PBKDF2 key decryption can exceed five seconds with V8 coverage on CI runners.
      testTimeout: 15000,
    },
  })
);
