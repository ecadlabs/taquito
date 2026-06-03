import { HttpBackend, HttpResponseError } from '@taquito/http-utils';

describe('HttpBackend request', () => {
  it('should fail with HttpResponseError when a 404 gets returned', async () => {
    // A nonexistent RPC route reliably 404s on any live node. The old fixture
    // relied on baking_rights?level=0 against ecadinfra's mainnet node (now
    // decommissioned); public nodes 401/403 that endpoint behind their proxies.
    // Assert on status/statusText rather than message body: a 404 body is empty
    // on most public nodes, so the reason phrase only survives in statusText.
    const url = 'https://rpc.tzkt.io/mainnet/chains/main/blocks/head/votes/nonexistent_endpoint';
    const http: HttpBackend = new HttpBackend();
    try {
      await http.createRequest<string>({
        method: 'GET',
        url,
      });
      expect.fail('should have thrown');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(HttpResponseError);
      const httpErr = err as HttpResponseError;
      expect(httpErr.status).toEqual(404);
      expect(httpErr.statusText).toEqual('Not Found');
      expect(httpErr.url).toEqual(url);
    }
  });
});
