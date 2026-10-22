import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { Context, ContractAbstraction, TransferParams } from '@taquito/taquito';
import { EntrypointsResponse, RunCodeResult } from '@taquito/rpc';
import { emitMicheline, Parser } from '@taquito/michel-codec';
import { fa21Code, fa21InitialStorage, fa21Owner } from '../../test-fixtures/fa21/fixture';

const exec = promisify(execFile);

// Only public bootstrap accounts in a fresh local mockup. No HTTP RPC bridge.
export class Fa21Mockup {
  private directory = '';
  private script = '';
  private readonly binary = process.env.OCTEZ_CLIENT ?? 'octez-client';

  async client(...args: string[]) {
    const result = await exec(
      this.binary,
      ['--base-dir', this.directory, '--mode', 'mockup', ...args],
      {
        timeout: 30_000,
        maxBuffer: 4 * 1024 * 1024,
      }
    );
    return result.stdout.trim();
  }

  async start() {
    this.directory = await mkdtemp(join(tmpdir(), 'taquito-fa21-'));
    this.script = join(this.directory, 'reference.tz');
    // A short protocol identifier is accepted by Octez and avoids network lookup.
    await this.client('--protocol', 'PtTALLiNtPec', 'create', 'mockup');
    await writeFile(this.script, emitMicheline(new Parser().parseJSON(fa21Code())));
  }

  async stop() {
    if (this.directory) await rm(this.directory, { recursive: true, force: true });
  }

  async originate() {
    const alias = `fa21-${randomUUID()}`;
    await this.client(
      'originate',
      'contract',
      alias,
      'transferring',
      '0',
      'from',
      'bootstrap1',
      'running',
      this.script,
      '--init',
      fa21InitialStorage(),
      '--burn-cap',
      '10'
    );
    const address = await this.client('show', 'known', 'contract', alias);
    const entrypoints: EntrypointsResponse = JSON.parse(
      await this.client(
        'rpc',
        'get',
        `/chains/main/blocks/head/context/contracts/${address}/entrypoints`
      )
    );
    const context = new Context('https://rpc.invalid');
    const storage = new Parser().parseData(fa21InitialStorage());
    if (!storage) throw new Error('Invalid FA2.1 initial storage');
    return new ContractAbstraction(
      address,
      { code: fa21Code(), storage },
      context.contract,
      context.contract,
      entrypoints,
      context.rpc,
      context.readProvider
    );
  }

  async transfer(from: 'bootstrap1' | 'bootstrap2', params: TransferParams) {
    if (!params.parameter) throw new Error('Expected a contract parameter');
    return this.client(
      'transfer',
      '0',
      'from',
      from,
      'to',
      params.to,
      '--entrypoint',
      params.parameter.entrypoint,
      '--arg',
      emitMicheline(new Parser().parseJSON(params.parameter.value)),
      '--burn-cap',
      '1'
    );
  }

  async view(address: string, name: string, input: string): Promise<unknown> {
    const output = await this.client(
      'run',
      'view',
      name,
      'on',
      'contract',
      address,
      'with',
      'input',
      input
    );
    // Match RPC Micheline, without the text parser's source-location symbols.
    return JSON.parse(JSON.stringify(new Parser().parseMichelineExpression(output)));
  }

  async simulate(params: TransferParams): Promise<RunCodeResult> {
    if (!params.parameter) throw new Error('Expected a contract parameter');
    const chainId: string = JSON.parse(await this.client('rpc', 'get', '/chains/main/chain_id'));
    return JSON.parse(
      await this.client(
        'rpc',
        'post',
        '/chains/main/blocks/head/helpers/scripts/run_code',
        'with',
        JSON.stringify({
          script: fa21Code(),
          storage: new Parser().parseData(fa21InitialStorage()),
          input: params.parameter.value,
          entrypoint: params.parameter.entrypoint,
          amount: '0',
          chain_id: chainId,
          source: fa21Owner,
          payer: fa21Owner,
          self: params.to,
          unparsing_mode: 'Readable',
        })
      )
    );
  }
}
