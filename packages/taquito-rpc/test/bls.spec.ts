import { HttpBackend } from '@taquito/http-utils';
import { RpcClient, RpcClientCache } from '../src/taquito-rpc';
import { blsFixture } from '../../../test-fixtures/bls-rpc';
import { RpcClientInterface } from '../src/rpc-client-interface';

describe('BLS shell RPCs', () => {
  const keyWithProof = { public_key: blsFixture.public_key, proof: blsFixture.proof };
  let backend: HttpBackend;
  let client: RpcClient;

  beforeEach(() => {
    backend = new HttpBackend();
    client = new RpcClient('https://rpc.invalid///', 'custom-chain', backend);
  });

  afterEach(() => vi.restoreAllMocks());

  it('posts public keys and proofs to the root aggregate endpoint', async () => {
    const response = {
      public_key: keyWithProof.public_key,
      public_key_hash: 'tz4AQcKaQU1sUzsmPTX43qnK4ddkCeeknJnf',
    };
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(response);
    const input = [keyWithProof];
    expect(await client.aggregatePublicKeys(input)).toEqual(response);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      { url: 'https://rpc.invalid/bls/aggregate_public_keys', method: 'POST' },
      input
    );
  });

  it('posts the exact body to /bls/check_proof', async () => {
    const input = keyWithProof;
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(true);
    expect(await client.checkProof(input)).toEqual(true);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      { url: 'https://rpc.invalid/bls/check_proof', method: 'POST' },
      input
    );
  });

  it('posts the exact body to /bls/aggregate_signatures', async () => {
    const input = blsFixture.aggregate;
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(blsFixture.signature);
    expect(await client.aggregateSignatures(input)).toEqual(blsFixture.signature);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      { url: 'https://rpc.invalid/bls/aggregate_signatures', method: 'POST' },
      input
    );
  });

  it('posts the exact body to /bls/threshold_signatures', async () => {
    const input = blsFixture.threshold;
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(blsFixture.signature);
    expect(await client.thresholdSignatures(input)).toEqual(blsFixture.signature);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      { url: 'https://rpc.invalid/bls/threshold_signatures', method: 'POST' },
      input
    );
  });

  const cases: Array<{
    name: string;
    path: string;
    input: object;
    invoke: (rpc: RpcClientInterface) => Promise<unknown>;
    failureResult: boolean | null;
  }> = [
    {
      name: 'aggregatePublicKeys',
      path: 'aggregate_public_keys',
      input: [keyWithProof],
      invoke: (rpc) => rpc.aggregatePublicKeys([keyWithProof]),
      failureResult: null,
    },
    {
      name: 'checkProof',
      path: 'check_proof',
      input: keyWithProof,
      invoke: (rpc) => rpc.checkProof(keyWithProof),
      failureResult: false,
    },
    {
      name: 'aggregateSignatures',
      path: 'aggregate_signatures',
      input: blsFixture.aggregate,
      invoke: (rpc) => rpc.aggregateSignatures(blsFixture.aggregate),
      failureResult: null,
    },
    {
      name: 'thresholdSignatures',
      path: 'threshold_signatures',
      input: blsFixture.threshold,
      invoke: (rpc) => rpc.thresholdSignatures(blsFixture.threshold),
      failureResult: null,
    },
  ];

  describe.each(['client', 'cache decorator'] as const)('%s', (kind) => {
    const subject = () => (kind === 'client' ? client : new RpcClientCache(client));

    it.each(cases)('preserves the invalid-crypto result from $name', async (entry) => {
      vi.spyOn(backend, 'createRequest').mockResolvedValue(entry.failureResult);
      expect(await entry.invoke(subject())).toBe(entry.failureResult);
    });

    it.each(cases)('preserves transport errors from $name', async (entry) => {
      const error = new Error('node rejected request');
      vi.spyOn(backend, 'createRequest').mockRejectedValue(error);
      await expect(entry.invoke(subject())).rejects.toBe(error);
    });
  });

  it.each(cases)(
    'forwards $name through the cache decorator without memoizing bodies',
    async (entry) => {
      const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(entry.failureResult);
      const decorated = new RpcClientCache(client);
      await entry.invoke(decorated);
      await entry.invoke(decorated);
      expect(request).toHaveBeenCalledTimes(2);
      expect(request).toHaveBeenNthCalledWith(
        1,
        { url: `https://rpc.invalid/bls/${entry.path}`, method: 'POST' },
        entry.input
      );
      expect(request).toHaveBeenNthCalledWith(
        2,
        { url: `https://rpc.invalid/bls/${entry.path}`, method: 'POST' },
        entry.input
      );
    }
  );

  it('forwards empty aggregation inputs without inventing local results', async () => {
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(null);
    await client.aggregatePublicKeys([]);
    await client.aggregateSignatures({
      public_key: keyWithProof.public_key,
      message: '',
      signature_shares: [],
    });
    await client.thresholdSignatures({
      public_key: keyWithProof.public_key,
      message: '',
      signature_shares: [],
    });
    expect(request).toHaveBeenNthCalledWith(
      1,
      { url: 'https://rpc.invalid/bls/aggregate_public_keys', method: 'POST' },
      []
    );
    const emptyInput = { public_key: keyWithProof.public_key, message: '', signature_shares: [] };
    expect(request).toHaveBeenNthCalledWith(
      2,
      { url: 'https://rpc.invalid/bls/aggregate_signatures', method: 'POST' },
      emptyInput
    );
    expect(request).toHaveBeenNthCalledWith(
      3,
      { url: 'https://rpc.invalid/bls/threshold_signatures', method: 'POST' },
      emptyInput
    );
  });

  it('preserves hex bytes and signed int8 share identifiers', async () => {
    const input = {
      ...blsFixture.threshold,
      message: '00ff',
      signature_shares: [
        { id: -128, signature: blsFixture.signature },
        { id: 127, signature: blsFixture.signature },
      ],
    };
    const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(null);
    await client.thresholdSignatures(input);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      { url: 'https://rpc.invalid/bls/threshold_signatures', method: 'POST' },
      input
    );
  });
});
