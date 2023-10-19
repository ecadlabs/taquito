import { Config } from '@jest/types';
import { KeygenServer } from './local-keygen';

export default async function globalSetup(_globalConfig: Config.GlobalConfig, _projectConfig: Config.ProjectConfig) {
    const server = new KeygenServer();
    await server.startServer();
    (globalThis as any).__keyGenServer__ = server;
}
