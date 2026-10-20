import { mergeConfig } from 'vitest/config';
import shared from '../../vitest.shared';

export default mergeConfig(shared, {
  test: {
    name: 'fa21-local-octez',
    include: ['integration-tests/fa21/*.spec.ts'],
    testTimeout: 90_000,
    hookTimeout: 90_000,
    fileParallelism: false,
    retry: 0,
  },
});
