import { Signer } from '@taquito/core';
import { LocalForger } from '@taquito/local-forging';
import {
  OperationContents,
  OperationContentsAndResult,
  OpKind,
  PreapplyResponse,
  PvmKind,
} from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { RpcReadAdapter, SmartRollupOriginateParams, TezosToolkit } from '../../src/taquito';
import fixture from './fixtures/smart-rollup-whitelist.json';

const source = fixture.operation.source;
const params: SmartRollupOriginateParams = {
  pvmKind: PvmKind.WASM2,
  kernel: fixture.operation.kernel,
  parametersType: fixture.operation.parameters_ty,
  fee: Number(fixture.operation.fee),
  gasLimit: Number(fixture.operation.gas_limit),
  storageLimit: Number(fixture.operation.storage_limit),
};
const signatureBytes = '00'.repeat(64);

function applied(contents: OperationContents[] | undefined): PreapplyResponse {
  if (!contents) throw new Error('Controlled RPC request has no operation contents');
  return {
    contents: contents.map<OperationContentsAndResult>((content) => {
      if (content.kind === OpKind.SMART_ROLLUP_ORIGINATE) {
        return {
          ...content,
          metadata: {
            operation_result: { status: 'applied', consumed_milligas: '1000000', size: '6314' },
          },
        };
      }
      if (content.kind === OpKind.REVEAL) {
        return {
          ...content,
          metadata: { operation_result: { status: 'applied', consumed_milligas: '1000' } },
        };
      }
      throw new Error('Unexpected operation in controlled RPC response');
    }),
  };
}

describe('Smart rollup whitelist through toolkit APIs', () => {
  let tezos: TezosToolkit;
  let read: RpcReadAdapter;
  let forger: LocalForger;
  let sign: ReturnType<typeof vi.fn<Signer['sign']>>;

  beforeEach(() => {
    tezos = new TezosToolkit('http://example.test');
    sign = vi.fn<Signer['sign']>().mockImplementation(async (bytes) => ({
      bytes,
      sig: 'controlled_signature',
      prefixSig: 'controlled_signature',
      sbytes: bytes + signatureBytes,
    }));
    tezos.setSignerProvider({
      publicKeyHash: async () => source,
      publicKey: async () => 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
      secretKey: vi.fn<Signer['secretKey']>(),
      sign,
    });
    read = new RpcReadAdapter(tezos.rpc);
    tezos.setReadProvider(read);
    forger = new LocalForger();
    tezos.setForgerProvider(forger);
    vi.spyOn(read, 'getBlockHash').mockResolvedValue(fixture.branch);
    vi.spyOn(read, 'getNextProtocol').mockResolvedValue('test_protocol');
    vi.spyOn(read, 'getCounter').mockResolvedValue('0');
    vi.spyOn(read, 'isAccountRevealed').mockResolvedValue(true);
    vi.spyOn(read, 'getBalance').mockResolvedValue(new BigNumber(10000000000));
    vi.spyOn(read, 'getSpendable').mockResolvedValue(new BigNumber(10000000000));
    vi.spyOn(read, 'getChainId').mockResolvedValue('NetXdQprcVkpaWU');
    vi.spyOn(read, 'getProtocolConstants').mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber(1040000),
      hard_gas_limit_per_block: new BigNumber(5200000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      cost_per_byte: new BigNumber(250),
      smart_rollup_origination_size: 6314,
    });
    vi.spyOn(tezos.rpc, 'getMempoolFilter').mockRejectedValue(new Error('Endpoint unavailable'));
    vi.spyOn(tezos.rpc, 'simulateOperation').mockImplementation(async ({ operation }) =>
      applied(operation.contents)
    );
    vi.spyOn(tezos.rpc, 'preapplyOperations').mockImplementation(async (operations) =>
      operations.map((operation) => applied(operation.contents))
    );
    vi.spyOn(tezos.rpc, 'injectOperation').mockResolvedValue(
      'onwtjK2Q32ndjF9zbEPPtmifdBq5qB59wjMP2oCH22mARjyKnGP'
    );
  });

  it('prepares the whitelist in its original order and matches Octez bytes for all five key-hash kinds', async () => {
    const prepared = await tezos.prepare.smartRollupOriginate({
      ...params,
      whitelist: fixture.whitelist,
    });
    expect(prepared.opOb.contents).toEqual([
      { ...fixture.operation, whitelist: fixture.whitelist },
    ]);
    expect(await forger.forge(prepared.opOb)).toBe(fixture.privateBytes);
  });

  it.each([
    { name: 'omitted', value: {} },
    { name: 'explicit undefined', value: { whitelist: undefined } },
  ])('preserves public-rollup shape and bytes for $name', async ({ value }) => {
    const prepared = await tezos.prepare.smartRollupOriginate({ ...params, ...value });
    expect(prepared.opOb.contents).toEqual([fixture.operation]);
    expect(prepared.opOb.contents[0]).not.toHaveProperty('whitelist');
    expect(await forger.forge(prepared.opOb)).toBe(fixture.publicBytes);
  });

  it('keeps an empty whitelist distinct from a public rollup during preparation', async () => {
    const prepared = await tezos.prepare.smartRollupOriginate({ ...params, whitelist: [] });
    expect(prepared.opOb.contents).toEqual([{ ...fixture.operation, whitelist: [] }]);
    expect(await forger.forge(prepared.opOb)).toBe(fixture.emptyBytes);
  });

  it('retains the whitelist when inserting a reveal', async () => {
    vi.mocked(read.isAccountRevealed).mockResolvedValue(false);
    const prepared = await tezos.prepare.smartRollupOriginate({ ...params, whitelist: [source] });
    expect(prepared.opOb.contents).toMatchObject([
      { kind: OpKind.REVEAL, counter: '1' },
      { kind: OpKind.SMART_ROLLUP_ORIGINATE, counter: '2', whitelist: [source] },
    ]);
  });

  it('simulates the whitelist and forges the actual estimation payload', async () => {
    const forge = vi.spyOn(forger, 'forge');
    const estimate = await tezos.estimate.smartRollupOriginate({
      ...params,
      whitelist: fixture.whitelist,
    });
    expect(estimate.gasLimit).toBeGreaterThan(0);
    expect(tezos.rpc.simulateOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: expect.objectContaining({
          contents: [{ ...fixture.operation, whitelist: fixture.whitelist }],
        }),
      })
    );
    expect(await forge.mock.results[0].value).toBe(fixture.privateBytes);
    expect(sign).not.toHaveBeenCalled();
    expect(tezos.rpc.injectOperation).not.toHaveBeenCalled();
  });

  it('signs, preapplies and injects the private operation without dropping its whitelist', async () => {
    const operation = await tezos.contract.smartRollupOriginate({
      ...params,
      whitelist: fixture.whitelist,
    });
    expect(sign).toHaveBeenCalledWith(fixture.privateBytes, new Uint8Array([3]));
    expect(tezos.rpc.preapplyOperations).toHaveBeenCalledWith([
      expect.objectContaining({
        contents: [{ ...fixture.operation, whitelist: fixture.whitelist }],
        signature: 'controlled_signature',
      }),
    ]);
    expect(tezos.rpc.injectOperation).toHaveBeenCalledWith(fixture.privateBytes + signatureBytes);
    expect(operation.raw.opOb.contents).toEqual([
      { ...fixture.operation, whitelist: fixture.whitelist },
    ]);
  });

  it('preserves signed public-rollup bytes when the whitelist is omitted', async () => {
    const operation = await tezos.contract.smartRollupOriginate(params);
    expect(sign).toHaveBeenCalledWith(fixture.publicBytes, new Uint8Array([3]));
    expect(operation.raw.opOb.contents).toEqual([fixture.operation]);
    expect(tezos.rpc.injectOperation).toHaveBeenCalledWith(fixture.publicBytes + signatureBytes);
  });

  it('keeps the whitelist through automatic fee estimation before submission', async () => {
    await tezos.contract.smartRollupOriginate({ ...params, fee: undefined, whitelist: [source] });
    const simulated = vi.mocked(tezos.rpc.simulateOperation).mock.calls[0][0].operation.contents;
    expect(simulated).toMatchObject([{ whitelist: [source] }]);
    const preapplied = vi.mocked(tezos.rpc.preapplyOperations).mock.calls[0][0][0].contents;
    expect(preapplied).toMatchObject([{ whitelist: [source] }]);
    expect(sign).toHaveBeenCalledOnce();
  });

  it('signs a mixed private/public fluent batch with independent Octez bytes', async () => {
    const batch = await tezos.contract
      .batch()
      .withSmartRollupOriginate({ ...params, whitelist: fixture.whitelist })
      .withSmartRollupOriginate(params)
      .send();
    const expected = [
      { ...fixture.operation, whitelist: fixture.whitelist },
      { ...fixture.operation, counter: '2' },
    ];
    expect(tezos.rpc.simulateOperation).toHaveBeenCalledWith(
      expect.objectContaining({ operation: expect.objectContaining({ contents: expected }) })
    );
    expect(sign).toHaveBeenCalledWith(fixture.batchBytes, new Uint8Array([3]));
    expect(tezos.rpc.preapplyOperations).toHaveBeenCalledWith([
      expect.objectContaining({ contents: expected }),
    ]);
    expect(tezos.rpc.injectOperation).toHaveBeenCalledWith(fixture.batchBytes + signatureBytes);
    expect(batch.raw.opOb.contents).toEqual(expected);
  });

  it('supports the array form of batch preparation', async () => {
    const prepared = await tezos.prepare.batch([
      { ...params, kind: OpKind.SMART_ROLLUP_ORIGINATE, whitelist: [source] },
    ]);
    expect(prepared.opOb.contents).toEqual([{ ...fixture.operation, whitelist: [source] }]);
  });

  it('propagates empty-whitelist RPC rejection without converting it to a public rollup', async () => {
    const error = new Error('Controlled protocol rejection of an empty whitelist');
    vi.mocked(tezos.rpc.simulateOperation).mockRejectedValue(error);
    await expect(tezos.estimate.smartRollupOriginate({ ...params, whitelist: [] })).rejects.toBe(
      error
    );
    const simulated = vi.mocked(tezos.rpc.simulateOperation).mock.calls[0][0].operation.contents;
    expect(simulated).toMatchObject([{ whitelist: [] }]);
    expect(sign).not.toHaveBeenCalled();
    expect(tezos.rpc.injectOperation).not.toHaveBeenCalled();
  });
});
