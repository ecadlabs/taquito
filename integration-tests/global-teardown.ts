import { Config } from '@jest/types';
import { KeygenServer } from './local-keygen';

export default async function globalTeardown(_globalConfig: Config.GlobalConfig, _projectConfig: Config.ProjectConfig) {
    await ((globalThis as any).__keyGenServer__ as KeygenServer).stopServer();
}
