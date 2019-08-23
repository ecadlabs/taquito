import { IndexerClient } from '../src/tezos-ts-indexer';

describe('Indexer', () => {
  let client: IndexerClient;
  let httpBackend: {
    createRequest: jest.Mock<any, any>;
  };

  beforeEach(() => {
    httpBackend = {
      createRequest: jest.fn(),
    };
    client = new IndexerClient('root', httpBackend as any);
  });

  it('IndexerClient is instantiable', () => {
    expect(new IndexerClient()).toBeInstanceOf(IndexerClient);
  });

  describe('getBalance', () => {
    it('query the right url and returns a string', async done => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve({}));
      const history = await client.getBalanceHistory('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/balances/address',
        query: {
          start: undefined,
          end: undefined,
          limit: undefined,
        },
      });
      expect(history).toEqual({});

      done();
    });
  });
});
