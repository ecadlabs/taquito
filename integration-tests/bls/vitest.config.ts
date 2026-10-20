import { mergeConfig } from 'vitest/config';
import shared from '../../vitest.shared';

// Pure shell computations. No keygen, signer, funded account or chain operations.
export default mergeConfig(shared, {
  test: {
    name: 'bls-rpc',
    include: ['integration-tests/bls/*.spec.ts'],
    testTimeout: 30_000,
    fileParallelism: false,
    retry: 0,
  },
});
