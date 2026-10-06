import { Signer } from '@taquito/core';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { localForger } from '@taquito/local-forging';
import {
  OperationContents,
  OperationContentsAndResult,
  OperationObject,
  OpKind,
  RpcClient,
} from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';
import { getRevealFee, Protocols } from '../../src/constants';

const source = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM';
const destination = 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx';
const branch = 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX';
const signature =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

const blsProof =
  'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx';

function consumedGas(content: OperationContents) {
  return content.kind === OpKind.REVEAL ? (content.source.startsWith('tz4') ? 3252 : 150) : 2101;
}

function applied(contents: OperationContents[] = []): OperationContentsAndResult[] {
  return contents.map((content) => {
    switch (content.kind) {
      case OpKind.REVEAL:
      case OpKind.TRANSACTION:
      case OpKind.DELEGATION:
        return {
          ...content,
          metadata: {
            operation_result: {
              status: 'applied',
              consumed_milligas: String(consumedGas(content) * 1000),
            },
          },
        };
      default:
        throw new Error(`Unexpected operation in fee regression: ${content.kind}`);
    }
  });
}

function setup({
  nanotezPerByte = 4000,
  nanotezPerGas = 45,
  minimalFee = 0,
  revealed = false,
  bls = false,
} = {}) {
  const rpc = new RpcClient('http://unused.invalid');
  // Signing is outside this regression; retain the real signed byte length.
  const signer: Signer = {
    publicKeyHash: async () => (bls ? 'tz4AQcKaQU1sUzsmPTX43qnK4ddkCeeknJnf' : source),
    publicKey: async () =>
      bls
        ? 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt'
        : 'edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn',
    secretKey: async () => undefined,
    provePossession: async () => ({
      sig: blsProof,
      prefixSig: blsProof,
      rawSignature: new Uint8Array(96),
    }),
    sign: async (bytes) => ({
      bytes,
      sig: signature,
      prefixSig: bls ? blsProof : signature,
      sbytes: bytes + (bls ? 'ff03' + '00'.repeat(96) : '00'.repeat(64)),
    }),
  };
  const context = new Context(rpc, signer, Protocols.PsUshuai9);
  context.forger = localForger;
  vi.spyOn(context.readProvider, 'getBlockHash').mockResolvedValue(branch);
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
    minimal_nanotez_per_byte: [String(nanotezPerByte), '1'],
    minimal_nanotez_per_gas_unit: [String(nanotezPerGas), '1'],
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

  async function checkSentFees(expectedKinds: OpKind[], explicitTransactionFee = false) {
    expect(preapply).toHaveBeenCalledTimes(1);
    expect(inject).toHaveBeenCalledTimes(1);
    const operation: OperationObject = preapply.mock.calls[0][0][0];
    const contents = operation.contents ?? [];
    expect(contents.map((content) => content.kind)).toEqual(expectedKinds);
    const managers = contents.filter((content) => 'fee' in content);
    expect(managers.map((content) => content.counter)).toEqual(
      managers.map((_, index) => String(11 + index))
    );
    const fees = managers.reduce((sum, content) => sum + Number(content.fee), 0);
    const gas = managers.reduce((sum, content) => sum + Number(content.gas_limit), 0);
    const signedSize = inject.mock.calls[0][0].length / 2;
    const unsigned = await localForger.forge({ branch, contents });
    expect(signedSize).toBe(unsigned.length / 2 + (bls ? 98 : 64));
    // Tezos X prevalidation charges DA bytes plus the ceiling of declared gas cost.
    // Use the wire bytes and limits, independently of Taquito's Estimate formula.
    const required =
      minimalFee + Math.ceil((nanotezPerByte * signedSize + nanotezPerGas * gas) / 1000);
    expect(fees).toBeGreaterThanOrEqual(required);
    for (const content of managers) {
      expect(Number(content.gas_limit)).toBeGreaterThanOrEqual(consumedGas(content));
      if (content.kind === OpKind.REVEAL) {
        // Permit the existing conservative gas budget or a simulated one, not a hard-limit budget.
        expect(Number(content.gas_limit)).toBeLessThanOrEqual(consumedGas(content) * 4 + 100);
      }
    }
    if (explicitTransactionFee) {
      const reveal = managers.find((content) => content.kind === OpKind.REVEAL);
      if (!reveal) throw new Error('Expected automatic reveal');
      const standalone = await localForger.forge({ branch, contents: [reveal] });
      const revealRequired = Math.ceil(
        (nanotezPerByte * (standalone.length / 2 + (bls ? 98 : 64)) +
          nanotezPerGas * Number(reveal.gas_limit)) /
          1000
      );
      expect(Number(reveal.fee)).toBeLessThanOrEqual(revealRequired + 140);
    } else {
      // One 120-mutez base fee per content, with rounding/encoding slack.
      // In particular, charging the reveal's bytes twice exceeds this allowance.
      expect(fees).toBeLessThanOrEqual(required + managers.length * 140);
    }
    return contents;
  }

  return { context, filter, simulate, inject, checkSentFees };
}

describe('automatic reveal fees (#3437)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('covers the final reveal and transfer group at Previewnet byte and gas prices', async () => {
    const { context, checkSentFees } = setup();
    await context.contract.transfer({ to: destination, amount: 0.001 });
    await checkSentFees([OpKind.REVEAL, OpKind.TRANSACTION]);
  });

  it('uses network gas pricing even when the byte price matches L1 defaults', async () => {
    const { context, checkSentFees } = setup({
      nanotezPerByte: 1000,
      nanotezPerGas: 4000,
      minimalFee: 100,
    });
    await context.contract.transfer({ to: destination, amount: 0.001 });
    await checkSentFees([OpKind.REVEAL, OpKind.TRANSACTION]);
  });

  it('covers the final batch when the reveal gas price exceeds the L1 allowance', async () => {
    const { context, checkSentFees } = setup({ nanotezPerGas: 4000 });
    await context.batch
      .batch([
        { kind: OpKind.TRANSACTION, to: destination, amount: 0.001 },
        { kind: OpKind.TRANSACTION, to: destination, amount: 0.002 },
      ])
      .send();
    await checkSentFees([OpKind.REVEAL, OpKind.TRANSACTION, OpKind.TRANSACTION]);
  });

  it('prices automatic reveals for delegation as well as transfers', async () => {
    const { context, checkSentFees } = setup();
    await context.contract.setDelegate({ delegate: destination });
    await checkSentFees([OpKind.REVEAL, OpKind.DELEGATION]);
  });

  it('preserves explicit transaction limits while pricing its automatic reveal', async () => {
    const { context, checkSentFees } = setup({ nanotezPerGas: 4000 });
    await context.contract.transfer({
      to: destination,
      amount: 0.001,
      fee: 10000,
      gasLimit: 2200,
      storageLimit: 0,
    });
    const contents = await checkSentFees([OpKind.REVEAL, OpKind.TRANSACTION], true);
    expect(contents[1]).toMatchObject({ fee: '10000', gas_limit: '2200', storage_limit: '0' });
  });

  it('covers BLS reveal proofs and the 98-byte operation signature', async () => {
    const { context, checkSentFees } = setup({ bls: true });
    await context.contract.transfer({ to: destination, amount: 0.001 });
    const contents = await checkSentFees([OpKind.REVEAL, OpKind.TRANSACTION]);
    expect(contents[0]).toMatchObject({ proof: blsProof });
  });

  it('does not add a reveal for an already revealed account', async () => {
    const { context, checkSentFees } = setup({ revealed: true });
    await context.contract.transfer({ to: destination, amount: 0.001 });
    await checkSentFees([OpKind.TRANSACTION]);
  });

  it.each([false, true])(
    'preserves the documented L1 drain-account calculation (BLS=%s)',
    async (bls) => {
      const { context, checkSentFees } = setup({
        nanotezPerByte: 1000,
        nanotezPerGas: 100,
        minimalFee: 100,
        bls,
      });
      const balance = 30000;
      const revealFee = getRevealFee(await context.signer.publicKeyHash());
      const estimate = await context.estimate.transfer({
        to: destination,
        amount: balance - revealFee,
        mutez: true,
      });
      await context.contract.transfer({
        to: destination,
        amount: balance - revealFee - estimate.suggestedFeeMutez,
        mutez: true,
        fee: estimate.suggestedFeeMutez,
        gasLimit: estimate.gasLimit,
        storageLimit: 0,
      });
      const contents = await checkSentFees([OpKind.REVEAL, OpKind.TRANSACTION]);
      const spent = contents.reduce((sum, content) => {
        if (!('fee' in content)) throw new Error('Expected manager operation');
        return (
          sum +
          Number(content.fee) +
          (content.kind === OpKind.TRANSACTION ? Number(content.amount) : 0)
        );
      }, 0);
      expect(spent).toBe(balance);
    }
  );

  it('keeps sending on L1 when the mempool filter endpoint is unavailable', async () => {
    const { context, filter, checkSentFees } = setup({
      nanotezPerByte: 1000,
      nanotezPerGas: 100,
      minimalFee: 100,
    });
    filter.mockRejectedValue(
      new HttpResponseError(
        'mempool/filter unavailable',
        STATUS_CODE.NOT_FOUND,
        'Not Found',
        '',
        'http://unused.invalid/chains/main/mempool/filter'
      )
    );
    await context.contract.transfer({ to: destination, amount: 0.001 });
    await checkSentFees([OpKind.REVEAL, OpKind.TRANSACTION]);
  });

  it('propagates simulation failures without injecting a fallback operation', async () => {
    const { context, simulate, inject } = setup();
    const error = new Error('simulation unavailable');
    simulate.mockRejectedValue(error);
    await expect(context.contract.transfer({ to: destination, amount: 0.001 })).rejects.toBe(error);
    expect(inject).not.toHaveBeenCalled();
  });
});
