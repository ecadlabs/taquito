import { HttpBackend } from '@taquito/http-utils';

describe('HttpBackend request', () => {
  it('will fail with method and url in error message', async () => {
    try {
      const http: HttpBackend = new HttpBackend(1);
      await http.createRequest<string>({
        method: 'GET',
        url: 'https://mainnet.ecadinfra.com/chains/main/blocks/head/hash'
      });
    } catch (err: any) {
      expect(err.name).toEqual('HttpRequestFailed')
      expect(err.message).toContain('GET')
      expect(err.message).toContain('https://mainnet.ecadinfra.com/chains/main/blocks/head/hash')
      expect(err.message).toContain('Error: timeout of 1ms exceeded')
    }
  });
  it('will fail with method, url and query in error message', async () => {
    try {
      const http: HttpBackend = new HttpBackend(1);
      await http.createRequest<string>({
        method: 'GET',
        url: 'https://mainnet.ecadinfra.com/chains/main/blocks/head/helpers/baking_rights',
        query: {
          level: 0
        }
      });
    } catch (err: any) {
      expect(err.name).toEqual('HttpRequestFailed')
      expect(err.message).toContain('GET')
      expect(err.message).toContain('https://mainnet.ecadinfra.com/chains/main/blocks/head/helpers/baking_rights')
      expect(err.message).toContain('Error: timeout of 1ms exceeded')
    }
  });
})
