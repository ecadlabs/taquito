import { RpcClient } from '../src/tezos-ts-rpc';
import BigNumber from 'bignumber.js';

/**
 * RpcClient test
 */
describe('RpcClient test', () => {
  let client: RpcClient;
  let httpBackend: {
    createRequest: jest.Mock<any, any>;
  };

  beforeEach(() => {
    httpBackend = {
      createRequest: jest.fn(),
    };
    client = new RpcClient('root', 'test', httpBackend as any);
  });

  it('RpcClient is instantiable', () => {
    expect(new RpcClient()).toBeInstanceOf(RpcClient);
  });

  describe('getBalance', () => {
    it('query the right url and returns a string', async done => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getBalance('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/balance',
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');

      done();
    });
  });

  describe('getStorage', () => {
    it('query the right url', async done => {
      await client.getStorage('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/storage',
      });

      done();
    });
  });

  describe('getScript', () => {
    it('query the right url', async done => {
      await client.getScript('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/script',
      });

      done();
    });
  });

  describe('getContract', () => {
    it('query the right url', async done => {
      httpBackend.createRequest.mockResolvedValue({ balance: '10000' });
      const response = await client.getContract('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address',
      });

      expect(response.balance).toBeInstanceOf(BigNumber);
      expect(response.balance.toString()).toEqual('10000');

      done();
    });
  });

  describe('getManager', () => {
    it('query the right url', async done => {
      await client.getManager('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/manager',
      });

      done();
    });
  });

  describe('getDelegate', () => {
    it('query the right url', async done => {
      await client.getDelegate('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/delegate',
      });

      done();
    });
  });

  describe('getDelegates', () => {
    const sampleResponse = {
      balance: '5092341810457',
      frozen_balance: '2155290163074',
      frozen_balance_by_cycle: [
        { cycle: 135, deposit: '381760000000', fees: '971071', rewards: '11843833332' },
        { cycle: 136, deposit: '394368000000', fees: '1433657', rewards: '12200333332' },
      ],
      staking_balance: '20936607331513',
      delegated_contracts: [
        'KT1VvXEpeBpreAVpfp4V8ZujqWu2gVykwXBJ',
        'KT1VsSxSXUkgw6zkBGgUuDXXuJs9ToPqkrCg',
      ],
      delegated_balance: '15908924646030',
      deactivated: false,
      grace_period: 146,
    };

    it('query the right url', async done => {
      httpBackend.createRequest.mockResolvedValue(sampleResponse);
      await client.getDelegates('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/delegates/address',
      });

      done();
    });

    it('parse the response properly', async done => {
      httpBackend.createRequest.mockResolvedValue(sampleResponse);
      const response = await client.getDelegates('address');

      expect(response).toEqual({
        balance: new BigNumber('5092341810457'),
        frozenBalance: new BigNumber('2155290163074'),
        frozenBalanceByCycle: [
          {
            cycle: 135,
            deposit: new BigNumber('381760000000'),
            fees: new BigNumber('971071'),
            rewards: new BigNumber('11843833332'),
          },
          {
            cycle: 136,
            deposit: new BigNumber('394368000000'),
            fees: new BigNumber('1433657'),
            rewards: new BigNumber('12200333332'),
          },
        ],
        stakingBalance: new BigNumber('20936607331513'),
        delegatedContracts: [
          'KT1VvXEpeBpreAVpfp4V8ZujqWu2gVykwXBJ',
          'KT1VsSxSXUkgw6zkBGgUuDXXuJs9ToPqkrCg',
        ],
        delegatedBalance: new BigNumber('15908924646030'),
        deactivated: false,
        gracePeriod: 146,
      });

      done();
    });
  });

  describe('getBigMapKey', () => {
    it('query the right url', async done => {
      await client.getBigMapKey('address', { key: 'test', type: 'string' } as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/context/contracts/address/big_map_get',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({ key: 'test', type: 'string' });

      done();
    });
  });
});
