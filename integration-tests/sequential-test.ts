/**
 * Helper for stateful test suites where each test depends on the prior one succeeding.
 *
 * When a test fails, all subsequent tests in the same describe block are short-circuited
 * with a clear "cascade-skip" error instead of producing misleading assertion failures
 * against stale on-chain state.
 *
 * Usage:
 *   const step = sequentialTestSuite();
 *   step('does thing A', async () => { ... });
 *   step('depends on A', async () => { ... });
 */
export function sequentialTestSuite(): (name: string, fn: () => Promise<void>) => void {
  let failedStep: string | undefined;

  return function step(name: string, fn: () => Promise<void>): void {
    it(name, async () => {
      if (failedStep !== undefined) {
        throw new Error(
          `[cascade-skip] "${name}" skipped because prior step "${failedStep}" failed. ` +
          `Fix the root cause above; this test depends on it.`
        );
      }
      try {
        await fn();
      } catch (e) {
        failedStep = name;
        throw e;
      }
    });
  };
}
