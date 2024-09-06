import { HttpBackend } from '@taquito/http-utils';

describe('HttpBackend request', () => {
  it('should fail with url and error message with a timeout error', async () => {
    try {
      const http: HttpBackend = new HttpBackend(1);
      await http.createRequest<string>({
        method: 'GET',
        url: 'https://mainnet.ecadinfra.com/chains/main/blocks/head/hash'
      });
    } catch (err: any) {
      expect(err.name).toEqual('HttpTimeoutError');
      expect(err.url).toContain('https://mainnet.ecadinfra.com/chains/main/blocks/head/hash');
      expect(err.message).toContain('timeout of 1ms exceeded');
    }
  });

  it('should fail with HttpResponseError when a 401 gets returned', async () => {
    try {
      const http: HttpBackend = new HttpBackend();
      await http.createRequest<string>({
        method: 'GET',
        url: 'https://mainnet.ecadinfra.com/chains/main/blocks/head/helpers/baking_rights',
        query: {
          level: 0
        }
      });
    } catch (err: any) {
      expect(err.name).toEqual('HttpResponseError');
      expect(err.status).toEqual(404);
      expect(err.url).toEqual('https://mainnet.ecadinfra.com/chains/main/blocks/head/helpers/baking_rights?level=0');
      expect(err.message).toContain('Not Found');
    }
  });
});
