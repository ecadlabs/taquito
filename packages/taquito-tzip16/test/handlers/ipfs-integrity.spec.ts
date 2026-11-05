import { createHash } from 'node:crypto';
import { vi } from 'vitest';
import { CID } from 'multiformats/cid';
import { create as createDigest } from 'multiformats/hashes/digest';
import { InvalidUriError } from '../../src/errors';
import { IpfsHttpHandler } from '../../src/handlers/ipfs-handler';
import { MetadataProvider } from '../../src/metadata-provider';
import {
  blocks,
  fixtures,
  gatewayResponse,
  metadataContract,
} from '../fixtures/metadata-integrity';

describe('IPFS metadata integrity and compatible retrieval', () => {
  const { context, contract } = metadataContract();
  const provider = new MetadataProvider(
    new Map([['ipfs', new IpfsHttpHandler('gateway.example.com')]])
  );
  afterEach(() => vi.restoreAllMocks());

  it.each([
    [0x12, 16],
    [0x12, 31],
    [0x12, 33],
    [0x13, 32],
    [0x13, 63],
    [0x13, 65],
  ])('rejects hash code %i with digest length %i before fetching', async (code, length) => {
    const cid = CID.createV1(0x55, createDigest(code, new Uint8Array(length)));
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('unavailable', { status: 404 }));
    const defaults = new MetadataProvider(new Map([['ipfs', new IpfsHttpHandler()]]));
    await expect(
      defaults.provideMetadata(contract, `ipfs://${cid}`, context)
    ).rejects.toBeInstanceOf(InvalidUriError);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('accepts a full-length SHA-512 commitment', async () => {
    const digest = createHash('sha512').update(fixtures.metadata).digest();
    const cid = CID.createV1(0x55, createDigest(0x13, digest));
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(fixtures.metadata));
    await expect(
      provider.provideMetadata(contract, `ipfs://${cid}`, context)
    ).resolves.toMatchObject({
      metadata: { name: 'Verified café' },
    });
  });

  it('has SHA-256 fixture commitments matching every encoded block', () => {
    for (const block of blocks) {
      const hash = createHash('sha256').update(Buffer.from(block.hex, 'hex')).digest('hex');
      expect(block.cidHex.endsWith(`1220${hash}`)).toBe(true);
    }
  });

  it.each([
    ['CIDv1 raw', fixtures.raw.cid],
    ['CIDv0 UnixFS', fixtures.singleV0.cid],
    ['CIDv1 UnixFS', fixtures.singleV1.cid],
    ['multi-block UnixFS', fixtures.multi.cid],
    ['directory path', `${fixtures.directory.cid}/metadata.json`],
  ])('retrieves %s without changing metadata bytes', async (_label, location) => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) =>
      Promise.resolve(gatewayResponse(input, init, blocks, null))
    );
    const handler = new IpfsHttpHandler('gateway.example.com');
    await expect(
      handler.getMetadata(
        contract,
        { protocol: 'ipfs', location: `//${location}`, sha256hash: undefined },
        context
      )
    ).resolves.toBe(fixtures.metadata);
  });

  it.each([fixtures.raw, fixtures.singleV0, fixtures.singleV1])(
    'rejects substituted valid JSON for $cid',
    async (root) => {
      const attacker = '{"name":"Attacker"}';
      // A client may normalize CIDv0 to CIDv1 before requesting the same block.
      const multihash = root.cidHex.slice(-68);
      const tampered = blocks.map((block) =>
        block.cidHex.endsWith(multihash)
          ? { ...block, hex: Buffer.from(attacker).toString('hex') }
          : block
      );
      vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) =>
        Promise.resolve(gatewayResponse(input, init, tampered, attacker))
      );
      await expect(
        provider.provideMetadata(contract, `ipfs://${root.cid}`, context)
      ).rejects.toThrow(/integrity|hash|digest|CID/i);
    }
  );

  it.each(['corrupt', 'missing'])(
    'rejects a %s child even when the root is valid',
    async (mode) => {
      const child = fixtures.children[0];
      const supplied =
        mode === 'missing'
          ? blocks.filter((block) => block.cid !== child.cid)
          : blocks.map((block) =>
              block.cid === child.cid
                ? { ...block, hex: Buffer.from('tampered child').toString('hex') }
                : block
            );
      vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) =>
        Promise.resolve(gatewayResponse(input, init, supplied))
      );
      await expect(
        provider.provideMetadata(contract, `ipfs://${fixtures.multi.cid}`, context)
      ).rejects.toThrow();
    }
  );

  it('rejects a missing directory entry instead of accepting gateway JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) =>
      Promise.resolve(gatewayResponse(input, init))
    );
    await expect(
      provider.provideMetadata(contract, `ipfs://${fixtures.directory.cid}/absent.json`, context)
    ).rejects.toThrow();
  });

  it('checks an outer SHA-256 commitment even when a multi-block CID is valid', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) =>
      Promise.resolve(gatewayResponse(input, init))
    );
    await expect(
      provider.provideMetadata(
        contract,
        `sha256://0x${'00'.repeat(32)}/ipfs://${fixtures.multi.cid}`,
        context
      )
    ).rejects.toThrow(/integrity|hash|digest/i);
  });

  it('hashes the reconstructed file for SHA-256-wrapped multi-block IPFS metadata', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) =>
      Promise.resolve(gatewayResponse(input, init, blocks, null))
    );
    const digest = createHash('sha256').update(fixtures.metadata).digest('hex');
    await expect(
      provider.provideMetadata(
        contract,
        `sha256://0x${digest}/ipfs://${fixtures.multi.cid}`,
        context
      )
    ).resolves.toMatchObject({
      integrityCheckResult: true,
      sha256Hash: digest,
      metadata: { name: 'Verified café' },
    });
  });

  it.each([
    ['explicit', fixtures.raw.cid, '{"name":"Attacker"}'],
    ['default', fixtures.raw.cid, '{"name":"Attacker"}'],
    ['explicit', fixtures.multi.cid, fixtures.metadata],
    ['default', fixtures.multi.cid, fixtures.metadata],
  ])(
    'does not downgrade %s gateways when verification is unavailable for %s',
    async (selection, cid, body) => {
      const hosts: string[] = [];
      const verifiableHosts = new Set<string>();
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
        const request = new Request(input, init);
        const url = new URL(request.url);
        hosts.push(url.hostname);
        if (
          ['raw', 'car'].includes(url.searchParams.get('format') ?? '') ||
          /application\/vnd\.ipld\.(raw|car)/.test(request.headers.get('Accept') ?? '')
        ) {
          verifiableHosts.add(url.hostname);
          return new Response('Trustless formats unavailable', { status: 406 });
        }
        return new Response(body, { headers: { 'Content-Type': 'application/json' } });
      });
      const handler =
        selection === 'explicit'
          ? new IpfsHttpHandler('gateway.example.com')
          : new IpfsHttpHandler();
      const selectedProvider = new MetadataProvider(new Map([['ipfs', handler]]));
      await expect(
        selectedProvider.provideMetadata(contract, `ipfs://${cid}`, context)
      ).rejects.toThrow();
      expect(verifiableHosts).toEqual(new Set(hosts));
      if (selection === 'explicit') expect([...verifiableHosts]).toEqual(['gateway.example.com']);
      else expect(verifiableHosts.size).toBeGreaterThan(1);
    }
  );

  it('rejects malformed CIDs before contacting a gateway', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(fixtures.metadata));
    await expect(provider.provideMetadata(contract, 'ipfs://not-a-cid', context)).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
});
