import { OriginateParams } from '../../src/operations/types';
import { Context, MichelCodecParser, Protocols, InvalidCodeParameter } from '../../src/taquito';

describe('MichelCodec parser', () => {
    const mockRpcClient = {
        getBlockMetadata: jest.fn()
    };

    mockRpcClient.getBlockMetadata.mockResolvedValue({
        next_protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA'
    });

    it('is instantiable', () => {
        expect(new MichelCodecParser(new Context('url'))).toBeInstanceOf(MichelCodecParser);
    });

    describe('getNextProto', () => {
        it('calls getBlockMetadata from the rpc client', async (done) => {
            const parser = new MichelCodecParser(new Context(mockRpcClient as any));
            const result = await parser['getNextProto']();
            expect(result).toStrictEqual(Protocols.PtEdo27k);
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
                        { prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }] },
                        {
                            prim: 'code',
                            args: [[{ prim: 'DUP' }]]
                        }
                    ],
                    init: { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] }
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
                    args: [[{ prim: 'DUP' }]]
                }
            ];
            const init = { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] };
            const originateParams: OriginateParams = { code, init };
            const parser = new MichelCodecParser(new Context(mockRpcClient as any));
            const result = await parser.prepareCodeOrigination(originateParams);

            expect(JSON.stringify(result)).toEqual(
                JSON.stringify({
                    code: [
                        { prim: 'parameter', args: [{ prim: 'int' }] },
                        { prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }] },
                        {
                            prim: 'code',
                            args: [[{ prim: 'DUP' }]]
                        }
                    ],
                    init: { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] }
                })
            );

            done();
        });

        it(`Ensures correct ordering for RPC: 'parameter', 'storage', 'code'`, async (done) => {
            const code = [
                { prim: 'parameter', args: [{ prim: 'int' }] },
                {
                    prim: 'code',
                    args: [[{ prim: 'DUP' }]]
                },
                { prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }] }
            ];
            const init = { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] };
            const originateParams: OriginateParams = { code, init };
            const parser = new MichelCodecParser(new Context(mockRpcClient as any));
            const result = await parser.prepareCodeOrigination(originateParams);

            expect(JSON.stringify(result)).toEqual(
                JSON.stringify({
                    code: [
                        { prim: 'parameter', args: [{ prim: 'int' }] },
                        { prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }] },
                        {
                            prim: 'code',
                            args: [[{ prim: 'DUP' }]]
                        }
                    ],
                    init: { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] }
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
            } catch (err) {
                expect(err).toBeInstanceOf(InvalidCodeParameter);
                expect(err.message).toBe('Invalid code parameter');
            }

            done();
        });
    });
});
