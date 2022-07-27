import { OriginateParams } from '../../src/operations/types';
import { Context, MichelCodecParser, Protocols, InvalidCodeParameter } from '../../src/taquito';

describe('MichelCodec parser', () => {
  const mockRpcClient = {
    getProtocols: jest.fn(),
  };
  const mockGlobalConstantsProvider = {
    getGlobalConstantByHash: jest.fn(),
  };

  mockRpcClient.getProtocols.mockResolvedValue({
    next_protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
  });

  it('is instantiable', () => {
    expect(new MichelCodecParser(new Context('url'))).toBeInstanceOf(MichelCodecParser);
  });

  describe('getNextProto', () => {
    it('calls getProtocols from the rpc client', async (done) => {
      const parser = new MichelCodecParser(new Context(mockRpcClient as any));
      const result = await parser['getNextProto']();
      expect(result).toStrictEqual(Protocols.PtEdo2Zk);
      done();
    });
  });

  describe('prepareCodeOrigination', () => {
    it('prepares code and init parameters when they are in Michelson', async (done) => {
      const code = `parameter int; storage (pair int address); code { DUP; };`;
      const init = '(Pair 0 "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn")';
      const originateParams: OriginateParams = { code, init };
      const parser = new MichelCodecParser(new Context(mockRpcClient as any));
      const result = await parser.prepareCodeOrigination(originateParams);

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          code: [
            { prim: 'parameter', args: [{ prim: 'int' }] },
            {
              prim: 'storage',
              args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }],
            },
            {
              prim: 'code',
              args: [[{ prim: 'DUP' }]],
            },
          ],
          init: {
            prim: 'Pair',
            args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }],
          },
        })
      );

      done();
    });

    it('prepares code and init parameters when they are in JSON Michelson', async (done) => {
      const code = [
        { prim: 'parameter', args: [{ prim: 'int' }] },
        { prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }] },
        {
          prim: 'code',
          args: [[{ prim: 'DUP' }]],
        },
      ];
      const init = {
        prim: 'Pair',
        args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }],
      };
      const originateParams: OriginateParams = { code, init };
      const parser = new MichelCodecParser(new Context(mockRpcClient as any));
      const result = await parser.prepareCodeOrigination(originateParams);

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          code: [
            { prim: 'parameter', args: [{ prim: 'int' }] },
            {
              prim: 'storage',
              args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }],
            },
            {
              prim: 'code',
              args: [[{ prim: 'DUP' }]],
            },
          ],
          init: {
            prim: 'Pair',
            args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }],
          },
        })
      );

      done();
    });

    it(`Ensures correct ordering for RPC: 'parameter', 'storage', 'code'`, async (done) => {
      const code = [
        { prim: 'parameter', args: [{ prim: 'int' }] },
        {
          prim: 'code',
          args: [[{ prim: 'DUP' }]],
        },
        { prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }] },
      ];
      const init = {
        prim: 'Pair',
        args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }],
      };
      const originateParams: OriginateParams = { code, init };
      const parser = new MichelCodecParser(new Context(mockRpcClient as any));
      const result = await parser.prepareCodeOrigination(originateParams);

      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          code: [
            { prim: 'parameter', args: [{ prim: 'int' }] },
            {
              prim: 'storage',
              args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }],
            },
            {
              prim: 'code',
              args: [[{ prim: 'DUP' }]],
            },
          ],
          init: {
            prim: 'Pair',
            args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }],
          },
        })
      );

      done();
    });

    it('Throws InvalidMichelsonCode when code is an empty string', async (done) => {
      const code = ``;
      const init = '(Pair 0 "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn")';
      const originateParams: OriginateParams = { code, init };
      const parser = new MichelCodecParser(new Context(mockRpcClient as any));

      try {
        await parser.prepareCodeOrigination(originateParams);
      } catch (err: any) {
        expect(err).toBeInstanceOf(InvalidCodeParameter);
        expect(err.message).toBe('Invalid code parameter');
      }

      done();
    });

    it('expands global constants before encoding storage arguments', async (done) => {
      const context = new Context(mockRpcClient as any);
      mockGlobalConstantsProvider.getGlobalConstantByHash.mockResolvedValue({ prim: 'int' });
      context.globalConstantsProvider = mockGlobalConstantsProvider;
      const parser = new MichelCodecParser(context);

      const code = [
        { prim: 'parameter', args: [{ prim: 'int' }] },
        {
          prim: 'storage',
          args: [
            {
              prim: 'constant',
              args: [{ string: 'expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre' }],
            },
          ],
        },
        {
          prim: 'code',
          args: [[{ prim: 'DUP' }]],
        },
      ];

      const result = await parser.prepareCodeOrigination({ code, storage: 10 });

      expect(result).toEqual({
        code: [
          { prim: 'parameter', args: [{ prim: 'int' }] },
          {
            prim: 'storage',
            args: [
              {
                prim: 'constant',
                args: [{ string: 'expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre' }],
              },
            ],
          },
          {
            prim: 'code',
            args: [[{ prim: 'DUP' }]],
          },
        ],
        init: { int: '10' },
      });

      done();
    });
  });
});
