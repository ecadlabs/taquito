import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';

const exec = promisify(execFile);
// Octez 25.2 manifest for amd64 and arm64. Never pull implicitly.
const image = 'tezos/tezos@sha256:409124c53d848413eb83a5d1b19164fec5afe56117073534b657042d04173d07';
export const protocol = 'PsUshuai9QapM5TGj1JpuVGkdxz5GykdnEvS6Rh8SUVrARvZLCY';
export const bootstrapKey = 'edsk3gUfUPyBSfrS9CCgmCiQsTCHGkviBDusMxDJstFtojtc1zcpsh';
export const bootstrapAddress = 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx';
const bootstrapKeys = [
  bootstrapKey,
  'edsk39qAm1fiMjgmPkw1EgQYkMzkJezLNewd7PLNHTkr6w9XA2zdfo',
  'edsk4ArLQgBTLWG5FJmnGnT689VKoqhXwmDPBuGx3z4cvwU9MmrPZZ',
  'edsk2uqQB9AY4FvioK2YMdfmyMrer5R8mGFyuaLLFfSRo8EoyNdht3',
  'edsk4QLrcijEffxV31gGdN2HU7UpyJjA8drFoNcmnB28n89YjPNRFm',
];

export class Tz5Sandbox {
  private readonly name = `taquito-tz5-${randomUUID()}`;
  private created = false;
  endpoint = '';

  private async docker(args: string[]) {
    const { stdout } = await exec('docker', args, { maxBuffer: 1024 * 1024, timeout: 60_000 });
    return stdout.trim();
  }

  async client(...args: string[]) {
    return this.docker([
      'exec',
      this.name,
      'octez-client',
      '--base-dir',
      '/tmp/client',
      '--endpoint',
      'http://127.0.0.1:8732',
      ...args,
    ]);
  }

  async start() {
    try {
      await this.docker(['image', 'inspect', image]);
      await this.docker([
        'run',
        '--detach',
        '--rm',
        '--pull=never',
        '--name',
        this.name,
        '--label',
        'taquito.test-suite=tz5',
        '--publish',
        '127.0.0.1::8732',
        '--entrypoint',
        'sh',
        image,
        '-ec',
        `
          mkdir -p /tmp/node /tmp/client
          printf '%s' '{"genesis_pubkey":"edpkuSLWfVU1Vq7Jg9FucPyKmma6otcMHac9zG4oU1KMHSTBpJuGQ2"}' > /tmp/sandbox.json
          octez-node config init --network sandbox --data-dir /tmp/node --net-addr 127.0.0.1:19731 --rpc-addr 0.0.0.0:8732 --allow-all-rpc 0.0.0.0:8732 --expected-pow 0 --connections 0 --history-mode rolling:20
          octez-node identity generate 0 --data-dir /tmp/node
          exec octez-node run --data-dir /tmp/node --synchronisation-threshold 0 --sandbox /tmp/sandbox.json --private-mode --no-bootstrap-peers
        `,
      ]);
      this.created = true;
      const port = await this.docker(['port', this.name, '8732/tcp']);
      if (!/^127\.0\.0\.1:\d+$/.test(port)) throw new Error(`Unexpected sandbox binding: ${port}`);
      this.endpoint = `http://${port}`;
      await this.waitForHead(0);
      await this.client(
        'import',
        'secret',
        'key',
        'activator',
        'unencrypted:edsk31vznjHSSpGExDMHYASz45VZqXN4DPxvsa4hAyY8dHM28cZzp6'
      );
      for (const [index, key] of bootstrapKeys.entries()) {
        await this.client('import', 'secret', 'key', `bootstrap${index + 1}`, `unencrypted:${key}`);
      }
      await this.client(
        '--block',
        'genesis',
        'activate',
        'protocol',
        protocol,
        'with',
        'fitness',
        '1',
        'and',
        'key',
        'activator',
        'and',
        'parameters',
        '/usr/local/share/tezos/025-PsUshuai-parameters/sandbox-parameters.json'
      );
      await this.docker([
        'exec',
        '--detach',
        this.name,
        'sh',
        '-ec',
        'exec octez-baker --base-dir /tmp/client --endpoint http://127.0.0.1:8732 run with local node /tmp/node bootstrap1 bootstrap2 bootstrap3 bootstrap4 bootstrap5 --liquidity-baking-toggle-vote pass --without-dal > /tmp/baker.log 2>&1',
      ]);
      await this.waitForHead(2);
    } catch (error) {
      if (this.created) {
        const logs = await this.docker(['logs', '--tail', '30', this.name]).catch(
          () => 'unavailable'
        );
        await this.stop();
        throw new Error(`Local Octez startup failed: ${String(error)}\n${logs}`);
      }
      throw error;
    }
  }

  private async waitForHead(minimumLevel: number) {
    const deadline = Date.now() + 45_000;
    while (Date.now() < deadline) {
      try {
        const response = await fetch(`${this.endpoint}/chains/main/blocks/head/header`, {
          signal: AbortSignal.timeout(1000),
        });
        const head: { level: number } = await response.json();
        if (response.ok && head.level >= minimumLevel) return;
      } catch {
        // The node needs a short startup interval before binding its RPC listener.
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    throw new Error(`Local Octez did not reach level ${minimumLevel}`);
  }

  async freshAccount() {
    const alias = `fixture-${randomUUID()}`;
    await this.client('gen', 'keys', alias, '--sig', 'mldsa44');
    const output = await this.client('show', 'address', alias, '-S');
    const secretKey = output.match(/Secret Key: unencrypted:(\w+)/)?.[1];
    const publicKeyHash = output.match(/Hash: (\w+)/)?.[1];
    if (!secretKey || !publicKeyHash) throw new Error('Octez did not return an ML-DSA key');
    await this.client(
      '--wait',
      '1',
      'transfer',
      '10',
      'from',
      'bootstrap1',
      'to',
      publicKeyHash,
      '--burn-cap',
      '1'
    );
    return { secretKey, publicKeyHash };
  }

  async verify(bytes: string, publicKey: string, signature: string) {
    const alias = `verifier-${randomUUID()}`;
    await this.client('import', 'public', 'key', alias, `unencrypted:${publicKey}`, '--force');
    return this.client(
      'check',
      'that',
      'bytes',
      `0x${bytes}`,
      'were',
      'signed',
      'by',
      alias,
      'to',
      'produce',
      signature
    );
  }

  async stop() {
    if (this.created) {
      await this.docker(['rm', '--force', this.name]);
      this.created = false;
    }
  }
}
