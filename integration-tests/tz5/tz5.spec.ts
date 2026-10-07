import { InMemorySigner } from '@taquito/signer';
import { OperationContentsAndResultReveal } from '@taquito/rpc';
import { TezosToolkit } from '@taquito/taquito';
import { tz5 } from '../../test-fixtures/tz5';
import { bootstrapAddress, bootstrapKey, protocol, Tz5Sandbox } from './sandbox';

describe('tz5 against pinned local Octez', () => {
  const sandbox = new Tz5Sandbox();
  beforeAll(() => sandbox.start());
  afterAll(() => sandbox.stop());

  async function account() {
    const keys = await sandbox.freshAccount();
    const tezos = new TezosToolkit(sandbox.endpoint);
    tezos.setSignerProvider(new InMemorySigner(keys.secretKey));
    return { tezos, ...keys };
  }

  function checkRevealGas(reveal: OperationContentsAndResultReveal | false | undefined) {
    if (!reveal) throw new Error('Expected a reveal receipt');
    const consumed = Math.ceil(Number(reveal.metadata.operation_result.consumed_milligas) / 1000);
    expect(consumed).toBeGreaterThan(0);
    expect(Number(reveal.gas_limit)).toBeGreaterThanOrEqual(consumed);
    // A conservative margin is acceptable; protocol hard limits or large guessed
    // constants would overcharge even if the node accepted the resulting fee.
    expect(Number(reveal.gas_limit)).toBeLessThanOrEqual(consumed * 4 + 100);
    expect(reveal.proof).toBeUndefined();
  }

  it('runs the expected protocol with tz5 enabled', async () => {
    const tezos = new TezosToolkit(sandbox.endpoint);
    expect((await tezos.rpc.getProtocols()).protocol).toBe(protocol);
    expect(await tezos.rpc.getConstants()).toMatchObject({ tz5_account_enable: true });
  });

  it('accepts an ordinary tz1 transfer as a sandbox control', async () => {
    const tezos = new TezosToolkit(sandbox.endpoint);
    tezos.setSignerProvider(new InMemorySigner(bootstrapKey));
    const op = await tezos.contract.transfer({ to: bootstrapAddress, amount: 0.001 });
    await op.confirmation(1);
    expect(op.status).toBe('applied');
  });

  it('funds a fresh tz5 destination from tz1 with automatic allocation and fees', async () => {
    const tezos = new TezosToolkit(sandbox.endpoint);
    tezos.setSignerProvider(new InMemorySigner(bootstrapKey));
    expect((await tezos.tz.getBalance(tz5.publicKeyHash)).isZero()).toBe(true);
    const op = await tezos.contract.transfer({ to: tz5.publicKeyHash, amount: 0.001 });
    await op.confirmation(1);
    expect(op.status).toBe('applied');
    expect((await tezos.tz.getBalance(tz5.publicKeyHash)).toNumber()).toBe(1000);
  });

  it('has Octez verify a Taquito-produced operation-watermarked signature', async () => {
    const signer = new InMemorySigner(tz5.encryptedSecretKey, tz5.password);
    const signed = await signer.sign(tz5.operations.batch.unsigned, new Uint8Array([3]));
    const result = await sandbox.verify(
      `03${tz5.operations.batch.unsigned}`,
      tz5.publicKey,
      signed.prefixSig
    );
    expect(result).toContain('Signature check successful');
  });

  it('verifies the reference signature and rejects a mutation as an Octez control', async () => {
    expect(await sandbox.verify(tz5.message, tz5.publicKey, tz5.signatures.plain)).toContain(
      'Signature check successful'
    );
    await expect(
      sandbox.verify(`00${tz5.message}`, tz5.publicKey, tz5.signatures.plain)
    ).rejects.toThrow('invalid signature');
  });

  it('confirms a standalone reveal and a revealed transfer using automatic fees', async () => {
    const { tezos, publicKeyHash } = await account();
    expect(await tezos.rpc.getManagerKey(publicKeyHash)).toBeNull();
    const reveal = await tezos.contract.reveal({});
    await reveal.confirmation(1);
    expect(reveal.status).toBe('applied');
    checkRevealGas(reveal.revealOperation);
    expect(await tezos.rpc.getManagerKey(publicKeyHash)).toBe(await tezos.signer.publicKey());
    const balance = await tezos.tz.getBalance(publicKeyHash);
    const transfer = await tezos.contract.transfer({ to: bootstrapAddress, amount: 0.001 });
    await transfer.confirmation(1);
    expect(transfer.status).toBe('applied');
    expect((await tezos.tz.getBalance(publicKeyHash)).lt(balance)).toBe(true);
  });

  it('confirms an unrevealed transfer with an automatic reveal', async () => {
    const { tezos, publicKeyHash } = await account();
    expect(await tezos.rpc.getManagerKey(publicKeyHash)).toBeNull();
    const op = await tezos.contract.transfer({ to: bootstrapAddress, amount: 0.001 });
    await op.confirmation(1);
    expect(op.status).toBe('applied');
    checkRevealGas(op.revealOperation);
    expect(await tezos.rpc.getManagerKey(publicKeyHash)).toBe(await tezos.signer.publicKey());
  });

  it.each([true, false])('confirms a two-transfer batch (revealed=%s)', async (revealed) => {
    const { tezos, publicKeyHash } = await account();
    if (revealed) {
      const reveal = await tezos.contract.reveal({});
      await reveal.confirmation(1);
    }
    const counter = Number((await tezos.rpc.getContract(publicKeyHash)).counter);
    const op = await tezos.contract
      .batch()
      .withTransfer({ to: bootstrapAddress, amount: 0.001 })
      .withTransfer({ to: bootstrapAddress, amount: 0.002 })
      .send();
    await op.confirmation(1);
    expect(op.status).toBe('applied');
    if (!revealed) checkRevealGas(op.revealOperation);
    expect(Number((await tezos.rpc.getContract(publicKeyHash)).counter)).toBe(
      counter + (revealed ? 2 : 3)
    );
  });
});
