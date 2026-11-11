import { createHash } from 'node:crypto';
import { vi } from 'vitest';
import { Handler, MetadataProvider } from '../src/metadata-provider';
import { HttpHandler } from '../src/handlers/http-handler';
import { IpfsHttpHandler } from '../src/handlers/ipfs-handler';
import { Tzip16ContractAbstraction } from '../src/tzip16-contract-abstraction';
import {
  blocks,
  fixtures,
  gatewayResponse,
  metadataContract,
} from './fixtures/metadata-integrity';

describe('metadata integrity enforcement', () => {
  const { context, contract } = metadataContract();
  const provider = new MetadataProvider(
    new Map<string, Handler>([
      ['https', new HttpHandler()],
      ['ipfs', new IpfsHttpHandler('gateway.example.com')],
    ])
  );
  const digest = createHash('sha256').update(fixtures.metadata).digest('hex');

  afterEach(() => vi.restoreAllMocks());

  it('accepts the exact SHA-256 committed bytes, including Unicode and whitespace', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(fixtures.metadata));
    const uri = `sha256://0x${digest}/https:%2F%2Fmetadata.example.com%2Fmetadata.json`;
    await expect(provider.provideMetadata(contract, uri, context)).resolves.toMatchObject({
      integrityCheckResult: true,
      sha256Hash: digest,
      metadata: { name: 'Verified café' },
    });
  });

  it('accepts uppercase hexadecimal SHA-256 commitments', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(fixtures.metadata));
    await expect(
      provider.provideMetadata(
        contract,
        `sha256://0x${digest.toUpperCase()}/https:%2F%2Fmetadata.example.com%2Fmetadata.json`,
        context
      )
    ).resolves.toMatchObject({ integrityCheckResult: true, sha256Hash: digest });
  });

  it.each([
    ['different JSON', '{"name":"Attacker"}'],
    ['equivalent JSON with different bytes', JSON.stringify(JSON.parse(fixtures.metadata))],
  ])('rejects %s when a SHA-256 commitment is present', async (_label, body) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body));
    await expect(
      provider.provideMetadata(
        contract,
        `sha256://0x${digest}/https:%2F%2Fmetadata.example.com%2Fmetadata.json`,
        context
      )
    ).rejects.toThrow(/integrity|hash|digest/i);
  });

  it('continues to accept HTTPS metadata without a hash commitment and computes sha256Hash with undefined integrityCheckResult', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(fixtures.metadata));
    await expect(
      provider.provideMetadata(contract, 'https://metadata.example.com/a', context)
    ).resolves.toEqual({
      uri: 'https://metadata.example.com/a',
      integrityCheckResult: undefined,
      sha256Hash: digest,
      metadata: { name: 'Verified café', description: 'two chunks' },
    });
  });

  it('reports integrityCheckResult: true and sha256Hash for CID-verified IPFS metadata via IpfsHttpHandler', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) =>
      Promise.resolve(gatewayResponse(input, init, blocks, null))
    );
    await expect(
      provider.provideMetadata(contract, `ipfs://${fixtures.raw.cid}`, context)
    ).resolves.toEqual({
      uri: `ipfs://${fixtures.raw.cid}`,
      integrityCheckResult: true,
      sha256Hash: digest,
      metadata: { name: 'Verified café', description: 'two chunks' },
    });
  });

  it('distinguishes an unverified custom IPFS handler from a verifying handler via integrityCheckResult', async () => {
    const unverifiedCustomIpfsHandler: Handler = {
      getMetadata: vi.fn().mockResolvedValue(fixtures.metadata),
    };
    const customProvider = new MetadataProvider(
      new Map<string, Handler>([['ipfs', unverifiedCustomIpfsHandler]])
    );
    await expect(
      customProvider.provideMetadata(contract, `ipfs://${fixtures.raw.cid}`, context)
    ).resolves.toEqual({
      uri: `ipfs://${fixtures.raw.cid}`,
      integrityCheckResult: undefined,
      sha256Hash: digest,
      metadata: { name: 'Verified café', description: 'two chunks' },
    });
  });

  it('does not expose views from rejected metadata or cache the rejected response', async () => {
    const { context: viewContext, contract: viewContract } = metadataContract();
    const metadataContext = Object.assign(viewContext, { metadataProvider: provider });
    const uri = `sha256://0x${digest}/https:%2F%2Fmetadata.example.com%2Fmetadata.json`;
    vi.spyOn(viewContract.schema, 'FindFirstInTopLevelPair').mockReturnValue({ int: '1' });
    vi.spyOn(viewContext.readProvider, 'getStorage').mockResolvedValue({ prim: 'Unit' });
    vi.spyOn(viewContext.contract, 'getBigMapKeyByID').mockResolvedValue(
      Buffer.from(uri).toString('hex')
    );
    const attackerMetadata = JSON.stringify({
      views: [
        {
          name: 'resolve-name',
          implementations: [
            {
              michelsonStorageView: {
                returnType: { prim: 'address' },
                code: [
                  { prim: 'DROP' },
                  {
                    prim: 'PUSH',
                    args: [{ prim: 'address' }, { string: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' }],
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(attackerMetadata))
      .mockImplementation(async () => new Response(fixtures.metadata));
    const abstraction = new Tzip16ContractAbstraction(viewContract, metadataContext);

    await expect(abstraction.metadataViews()).rejects.toThrow(/integrity|hash|digest/i);
    await expect(abstraction.getMetadata()).resolves.toMatchObject({
      integrityCheckResult: true,
      metadata: { name: 'Verified café' },
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it.each(['', '00', 'gg'.repeat(32)])('rejects malformed SHA-256 commitment %s', async (hash) => {
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => new Response(fixtures.metadata));
    await expect(
      provider.provideMetadata(
        contract,
        `sha256://0x${hash}/https:%2F%2Fmetadata.example.com%2Fmetadata.json`,
        context
      )
    ).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
});
