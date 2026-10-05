import { vi } from 'vitest';
import {
  HttpBackend,
  HttpRequestFailed,
  HttpResponseError,
  HttpTimeoutError,
  STATUS_CODE,
  classifyTransportError,
} from '@taquito/http-utils';
import { Context, ContractAbstraction } from '@taquito/taquito';
import { IpfsHttpHandler } from '../../src/handlers/ipfs-handler';
import { MetadataProvider } from '../../src/metadata-provider';
import { Tzip16Module } from '../../src/tzip16-extension';
import { InvalidContractMetadataError } from '../../src/errors';

describe('TZIP-16 IPFS HTTP handler', () => {
  const context = new Context('https://rpc.example.com');
  const contract = new ContractAbstraction(
    'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
    {
      code: [
        { prim: 'parameter', args: [{ prim: 'unit' }] },
        { prim: 'storage', args: [{ prim: 'unit' }] },
        { prim: 'code', args: [[]] },
      ],
      storage: { prim: 'Unit' },
    },
    context.contract,
    context.contract,
    { entrypoints: { default: { prim: 'unit' } } },
    context.rpc,
    context.readProvider
  );
  const cid = 'QmXnASUptTDnfhmcoznFqz3S1Mxu7X1zqo2YwbTN3nW52V';
  const uri = { sha256hash: undefined, protocol: 'ipfs', location: `//${cid}` };
  const metadata = '{ "name": "Taquito test" }';

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([undefined, ''])(
    'uses the replacement default gateway when given %s',
    async (gateway) => {
      const request = vi.spyOn(HttpBackend.prototype, 'createRequest').mockResolvedValue(metadata);

      await expect(new IpfsHttpHandler(gateway).getMetadata(contract, uri, context)).resolves.toBe(
        metadata
      );

      expect(request).toHaveBeenCalledExactlyOnceWith({
        url: `https://ipfs.filebase.io/ipfs/${cid}/`,
        method: 'GET',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        json: false,
      });
    }
  );

  it('uses the replacement gateway through the default Tzip16Module', async () => {
    const request = vi.spyOn(HttpBackend.prototype, 'createRequest').mockResolvedValue(metadata);
    const metadataContext = Object.assign(new Context('https://rpc.example.com'), {
      metadataProvider: new MetadataProvider(new Map()),
    });
    new Tzip16Module().configureContext(metadataContext);

    await expect(
      metadataContext.metadataProvider.provideMetadata(contract, `ipfs://${cid}`, metadataContext)
    ).resolves.toEqual({
      uri: `ipfs://${cid}`,
      metadata: { name: 'Taquito test' },
      integrityCheckResult: undefined,
      sha256Hash: undefined,
    });
    expect(request).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ url: `https://ipfs.filebase.io/ipfs/${cid}/` })
    );
  });

  it.each(['gateway.example.com', 'ipfs.io', 'dweb.link'])(
    'preserves the explicit gateway %s and the content path',
    async (gateway) => {
      const request = vi.spyOn(HttpBackend.prototype, 'createRequest').mockResolvedValue(metadata);

      await expect(
        new IpfsHttpHandler(gateway).getMetadata(
          contract,
          { ...uri, location: `//${cid}/metadata.json` },
          context
        )
      ).resolves.toBe(metadata);

      expect(request).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ url: `https://${gateway}/ipfs/${cid}/metadata.json/` })
      );
    }
  );

  it('propagates a custom gateway failure without silently using another gateway', async () => {
    const error = new Error('Gateway unavailable');
    const request = vi.spyOn(HttpBackend.prototype, 'createRequest').mockRejectedValue(error);

    await expect(
      new IpfsHttpHandler('gateway.example.com').getMetadata(contract, uri, context)
    ).rejects.toBe(error);
    expect(request).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ url: `https://gateway.example.com/ipfs/${cid}/` })
    );
  });

  it.each([STATUS_CODE.TOO_MANY_REQUESTS, STATUS_CODE.SERVICE_UNAVAILABLE, STATUS_CODE.NOT_FOUND])(
    'explains an IPFS HTTP %s failure and preserves its response details',
    async (status) => {
      const url = `https://gateway.example.com/ipfs/${cid}/`;
      const fetch = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(
          new Response('Gateway response', { status, statusText: 'Gateway failure' })
        );
      const result = new IpfsHttpHandler('gateway.example.com').getMetadata(contract, uri, context);

      await expect(result).rejects.toBeInstanceOf(HttpResponseError);
      await expect(result).rejects.toMatchObject({
        name: 'HttpResponseError',
        status,
        statusText: 'Gateway failure',
        body: 'Gateway response',
        url,
        message: expect.stringContaining(url),
      });
      await expect(result).rejects.toHaveProperty('message', expect.stringContaining('IPFS'));
      await expect(result).rejects.toHaveProperty(
        'message',
        expect.stringContaining('IpfsHttpHandler')
      );
      await expect(result).rejects.toHaveProperty(
        'message',
        expect.stringContaining(String(status))
      );
      expect(fetch).toHaveBeenCalledTimes(1);
    }
  );

  it('explains an IPFS timeout and preserves the timeout duration and URL', async () => {
    const url = `https://gateway.example.com/ipfs/${cid}/`;
    vi.spyOn(HttpBackend.prototype, 'createRequest').mockRejectedValue(
      new HttpTimeoutError(1234, url)
    );
    const result = new IpfsHttpHandler('gateway.example.com').getMetadata(contract, uri, context);

    await expect(result).rejects.toBeInstanceOf(HttpTimeoutError);
    await expect(result).rejects.toMatchObject({
      timeout: 1234,
      url,
      message: expect.stringContaining(url),
    });
    await expect(result).rejects.toHaveProperty('message', expect.stringContaining('1234'));
    await expect(result).rejects.toHaveProperty(
      'message',
      expect.stringContaining('IpfsHttpHandler')
    );
  });

  it('explains an IPFS network failure and preserves its underlying cause', async () => {
    const url = `https://gateway.example.com/ipfs/${cid}/`;
    const cause = new TypeError('Failed to fetch');
    const transportError = classifyTransportError(cause);
    expect(transportError).toBeDefined();
    const error = new HttpRequestFailed('GET', url, cause, transportError);
    vi.spyOn(HttpBackend.prototype, 'createRequest').mockRejectedValue(error);
    const result = new IpfsHttpHandler('gateway.example.com').getMetadata(contract, uri, context);

    await expect(result).rejects.toBeInstanceOf(HttpRequestFailed);
    await expect(result).rejects.toMatchObject({ method: 'GET', url });
    await expect(result).rejects.toHaveProperty('cause', cause);
    await expect(result).rejects.toHaveProperty('transportError', transportError);
    await expect(result).rejects.toHaveProperty(
      'message',
      expect.stringContaining('Failed to fetch')
    );
    await expect(result).rejects.toHaveProperty(
      'message',
      expect.stringContaining('IpfsHttpHandler')
    );
  });

  it.each(['<html>Enable JavaScript</html>', '{"name":'])(
    'identifies a non-JSON IPFS response without declaring the contract noncompliant: %s',
    async (body) => {
      const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body));
      const provider = new MetadataProvider(
        new Map([['ipfs', new IpfsHttpHandler('gateway.example.com')]])
      );
      const result = provider.provideMetadata(contract, `ipfs://${cid}`, context);

      await expect(result).rejects.toBeInstanceOf(InvalidContractMetadataError);
      await expect(result).rejects.toHaveProperty('invalidMetadata', body);
      await expect(result).rejects.toHaveProperty(
        'message',
        expect.stringContaining(`ipfs://${cid}`)
      );
      await expect(result).rejects.toHaveProperty('message', expect.stringContaining('as JSON'));
      await expect(result).rejects.toHaveProperty(
        'message',
        expect.stringContaining('IpfsHttpHandler')
      );
      await expect(result).rejects.toHaveProperty(
        'message',
        expect.not.stringMatching(/non.?complian|not compliant/i)
      );
      expect(fetch).toHaveBeenCalledTimes(1);
    }
  );

  it('continues to return non-JSON text when the IPFS handler is used directly', async () => {
    const body = '<html>Enable JavaScript</html>';
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body));

    await expect(new IpfsHttpHandler().getMetadata(contract, uri, context)).resolves.toBe(body);
  });

  it('preserves valid IPFS response bytes for the metadata integrity check', async () => {
    const body = '{\n  "name": "Taquito test"\n}\n';
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body));

    await expect(new IpfsHttpHandler().getMetadata(contract, uri, context)).resolves.toBe(body);
  });
});
