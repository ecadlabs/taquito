import { setSmokeResult, toErrorResult } from './smoke-shared';
import { runScenario } from './package-scenarios';

setSmokeResult({ status: 'loading' });

void (async () => {
  try {
    await runScenario();
  } catch (error) {
    setSmokeResult(toErrorResult(error));
  }
})();
