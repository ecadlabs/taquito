import { mergeConfig } from 'vitest/config';
import shared from '../vitest.shared';

export default mergeConfig(shared, {
  test: {
    name: 'integration-tests',
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 1_200_000,
    hookTimeout: 1_200_000,
    retry: process.env.CI ? 2 : 0,
    fileParallelism: false,
    include: ['__tests__/**/*.spec.ts'],
    exclude: [
      '__tests__/ledger/ledger-signer.spec.ts',
      '__tests__/ledger/ledger-signer-failing-tests.spec.ts',
    ],
    reporters: process.env.CI
      ? ['default', 'github-actions', 'html']
      : ['default'],
    outputFile: { html: './test-reports/index.html' },
  },
});
