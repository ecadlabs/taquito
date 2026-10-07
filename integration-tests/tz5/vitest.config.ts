import { mergeConfig } from 'vitest/config';
import shared from '../../vitest.shared';

// Independent of the public-network CONFIGS(), keygen service, and integration setup.
export default mergeConfig(shared, {
  test: {
    name: 'tz5-local-octez',
    include: ['integration-tests/tz5/*.spec.ts'],
    testTimeout: 90_000,
    hookTimeout: 180_000,
    fileParallelism: false,
    retry: 0,
  },
});
