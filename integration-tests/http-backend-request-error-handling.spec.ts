import { HttpBackend } from '@taquito/http-utils';

describe('HttpBackend request', () => {
    it('will fail with http request url and request method', async (done) => {
        try {
            const http: HttpBackend = new HttpBackend(1);
            await http.createRequest<string>({
              method: 'GET',
              url: 'https://mainnet.api.tez.ie/chains/main/blocks/head/hash'
            });
        } catch (err: any) {
            expect(err.url).toEqual('https://mainnet.api.tez.ie/chains/main/blocks/head/hash')
            expect(err.method).toEqual('GET')
        }
        done()
      });
      it('will fail with http request url + query and request method', async (done) => {
        try {
            const http: HttpBackend = new HttpBackend(1);
            await http.createRequest<string>({
              method: 'GET',
              url: 'https://mainnet.api.tez.ie/chains/main/blocks/head/helpers/baking_rights',
              query: {
                level: 0
              }
            });
        } catch (err: any) {
            expect(err.url).toEqual('https://mainnet.api.tez.ie/chains/main/blocks/head/helpers/baking_rights?level=0')
            expect(err.method).toEqual('GET')
        }
        done()
      });
})
