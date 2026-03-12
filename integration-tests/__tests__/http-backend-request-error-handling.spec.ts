import { HttpBackend, HttpResponseError } from '@taquito/http-utils';

describe('HttpBackend request', () => {
  it('should fail with HttpResponseError when a 404 gets returned', async () => {
    const http: HttpBackend = new HttpBackend();
    try {
      await http.createRequest<string>({
        method: 'GET',
        url: 'https://mainnet.tezos.ecadinfra.com/chains/main/blocks/head/helpers/baking_rights',
        query: {
          level: 0
        }
      });
      expect.fail('should have thrown');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(HttpResponseError);
      const httpErr = err as HttpResponseError;
      expect(httpErr.status).toEqual(404);
      expect(httpErr.url).toEqual('https://mainnet.tezos.ecadinfra.com/chains/main/blocks/head/helpers/baking_rights?level=0');
      expect(httpErr.message).toContain('Not Found');
    }
  });
});
