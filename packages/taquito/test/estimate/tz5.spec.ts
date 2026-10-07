import BigNumber from 'bignumber.js';
import { Signer } from '@taquito/core';
import { localForger } from '@taquito/local-forging';
import { OperationContents, OperationContentsAndResult, OpKind, RpcClient } from '@taquito/rpc';
import { tz5 } from '../../../../test-fixtures/tz5';
import { Context } from '../../src/context';
import { getRevealFee, Protocols } from '../../src/constants';
import { Estimate } from '../../src/estimate/estimate';

function applied(contents: OperationContents[] = []): OperationContentsAndResult[] {
  return contents.map((content) => {
    if (content.kind !== OpKind.REVEAL && content.kind !== OpKind.TRANSACTION) {
      throw new Error(`Unexpected test operation: ${content.kind}`);
    }
    return {
      ...content,
      metadata: {
        operation_result: {
          status: 'applied',
          consumed_milligas: content.kind === OpKind.REVEAL ? '200000' : '2100000',
        },
      },
    };
  });
}

function setup(revealed: boolean, bytePrice = 1000, gasPrice = 100) {
  const rpc = new RpcClient('http://unused.invalid');
  // Cryptographic correctness is covered by signer and local Octez tests. Here the
  // signer preserves the reference wire size so fee assertions remain independent.
  const signer: Signer = {
    publicKeyHash: async () => tz5.publicKeyHash,
    publicKey: async () => tz5.publicKey,
    secretKey: async () => undefined,
    sign: async (bytes) => ({
      bytes,
      sig: tz5.signatures.plain,
      prefixSig: tz5.signatures.plain,
      sbytes: bytes + 'ff04' + tz5.packed.signature.slice(12),
    }),
  };
  const context = new Context(rpc, signer, Protocols.PsUshuai9);
  context.forger = localForger;
  vi.spyOn(context.readProvider, 'getBlockHash').mockResolvedValue(tz5.operations.transfer.branch);
  vi.spyOn(context.readProvider, 'getNextProtocol').mockResolvedValue(Protocols.PsUshuai9);
  vi.spyOn(context.readProvider, 'getCounter').mockResolvedValue('10');
  vi.spyOn(context.readProvider, 'getChainId').mockResolvedValue('NetXY2oPPzkxUW1');
  vi.spyOn(context.readProvider, 'isAccountRevealed').mockResolvedValue(revealed);
  vi.spyOn(context.readProvider, 'getProtocolConstants').mockResolvedValue({
    hard_gas_limit_per_operation: new BigNumber(1040000),
    hard_gas_limit_per_block: new BigNumber(5200000),
    hard_storage_limit_per_operation: new BigNumber(60000),
    cost_per_byte: new BigNumber(250),
    smart_rollup_origination_size: 6314,
  });
  const filter = vi.spyOn(rpc, 'getMempoolFilter').mockResolvedValue({
    minimal_fees: '100',
    minimal_nanotez_per_byte: [String(bytePrice), '1'],
    minimal_nanotez_per_gas_unit: [String(gasPrice), '1'],
  });
  const simulate = vi.spyOn(rpc, 'simulateOperation').mockImplementation(async ({ operation }) => ({
    contents: applied(operation.contents),
  }));
  const preapply = vi
    .spyOn(rpc, 'preapplyOperations')
    .mockImplementation(async (operations) =>
      operations.map((operation) => ({ contents: applied(operation.contents) }))
    );
  const inject = vi
    .spyOn(rpc, 'injectOperation')
    .mockResolvedValue('oo6JPEAy8VuMRGaFuMmLNFFGdJgiaKfnmT1CpHJfKP3Ye5ZahiP');

  async function checkFees(kinds: OpKind[]) {
    expect(preapply).toHaveBeenCalledTimes(1);
    expect(inject).toHaveBeenCalledTimes(1);
    const contents = preapply.mock.calls[0][0][0].contents ?? [];
    expect(contents.map((content) => content.kind)).toEqual(kinds);
    const managers = contents.filter((content) => 'fee' in content);
    expect(managers.map((content) => content.counter)).toEqual(kinds.map((_, i) => String(11 + i)));
    const unsigned = await localForger.forge({ branch: tz5.operations.transfer.branch, contents });
    const bytes = inject.mock.calls[0][0];
    // Sanity-check the stubbed signed size; signer and Octez tests prove the envelope.
    expect(bytes.length / 2).toBe(unsigned.length / 2 + 2422);
    const fee = managers.reduce((sum, content) => sum + Number(content.fee), 0);
    const gas = managers.reduce((sum, content) => sum + Number(content.gas_limit), 0);
    // Independently apply Octez's mempool rule to the bytes and limits actually sent.
    const minimum = 100 + Math.ceil((bytePrice * (bytes.length / 2) + gasPrice * gas) / 1000);
    expect(fee).toBeGreaterThanOrEqual(minimum);
    // Taquito policy for tz5: keep a small per-content fee buffer rather than adding
    // a percentage to the large byte fee. This also exposes double-charged bytes.
    expect(fee).toBeLessThanOrEqual(minimum + contents.length * 140);
    for (const content of contents) {
      if (content.kind === OpKind.REVEAL) {
        expect(content.proof).toBeUndefined();
        // The simulated reveal consumes 200 gas. Preserve room for the current
        // conservative margin without accepting a guessed multi-thousand budget.
        expect(Number(content.gas_limit)).toBeGreaterThanOrEqual(200);
        expect(Number(content.gas_limit)).toBeLessThanOrEqual(200 * 4 + 100);
      }
    }
    return contents;
  }

  async function simulatedSignedSize(estimate: Estimate | undefined) {
    if (!estimate) throw new Error('Expected an estimate for the unrevealed account');
    const call = simulate.mock.lastCall;
    if (!call) throw new Error('Expected a simulation');
    const { branch, contents } = call[0].operation;
    if (!branch || !contents) throw new Error('Simulation is missing its operation bytes');
    const unsigned = await localForger.forge({ branch, contents });
    return { estimated: Number(estimate.opSize), actual: unsigned.length / 2 + 2422 };
  }
  return { context, filter, checkFees, simulatedSignedSize };
}

describe('tz5 operation fee accounting', () => {
  afterEach(() => vi.restoreAllMocks());

  it('includes the two-byte signature tag in the revealed transfer size estimate', async () => {
    const { context, simulatedSignedSize } = setup(true);
    const estimate = await context.estimate.transfer({ to: tz5.publicKeyHash, amount: 0.001 });
    const size = await simulatedSignedSize(estimate);
    expect(size.estimated).toBe(size.actual);
  });

  it('covers the full signed standalone reveal in the size estimate', async () => {
    const { context, simulatedSignedSize } = setup(false);
    const size = await simulatedSignedSize(await context.estimate.reveal({}));
    expect(size.estimated).toBeGreaterThanOrEqual(size.actual);
    expect(size.estimated).toBeLessThanOrEqual(size.actual + 32);
  });

  it('prices all 2422 signature bytes for a revealed transfer', async () => {
    const { context, checkFees } = setup(true);
    await context.contract.transfer({ to: tz5.publicKeyHash, amount: 0.001 });
    await checkFees([OpKind.TRANSACTION]);
  });

  it('prices a standalone 1312-byte public-key reveal', async () => {
    const { context, checkFees } = setup(false);
    await context.contract.reveal({});
    await checkFees([OpKind.REVEAL]);
  });

  it('covers both automatic reveal and transfer using default node fees', async () => {
    const { context, checkFees } = setup(false);
    await context.contract.transfer({ to: tz5.publicKeyHash, amount: 0.001 });
    const contents = await checkFees([OpKind.REVEAL, OpKind.TRANSACTION]);
    // Preserve the public helper's default-fee contract for callers reserving a reveal fee.
    expect(contents[0]).toMatchObject({ fee: String(getRevealFee(tz5.publicKeyHash)) });
  });

  it.each([true, false])('charges one signature for a batch (revealed=%s)', async (revealed) => {
    const { context, checkFees } = setup(revealed);
    await context.batch
      .batch([
        { kind: OpKind.TRANSACTION, to: tz5.publicKeyHash, amount: 0.001 },
        { kind: OpKind.TRANSACTION, to: tz5.publicKeyHash, amount: 0.002 },
      ])
      .send();
    await checkFees(
      revealed
        ? [OpKind.TRANSACTION, OpKind.TRANSACTION]
        : [OpKind.REVEAL, OpKind.TRANSACTION, OpKind.TRANSACTION]
    );
  });

  it('uses the node byte and gas prices for an automatic reveal', async () => {
    const { context, checkFees } = setup(false, 4000, 3000);
    await context.contract.transfer({ to: tz5.publicKeyHash, amount: 0.001 });
    await checkFees([OpKind.REVEAL, OpKind.TRANSACTION]);
  });

  it('still covers wire bytes when the mempool filter endpoint is unavailable', async () => {
    const { context, filter, checkFees } = setup(false);
    filter.mockRejectedValue(new Error('filter unavailable'));
    await context.contract.transfer({ to: tz5.publicKeyHash, amount: 0.001 });
    await checkFees([OpKind.REVEAL, OpKind.TRANSACTION]);
  });
});
