import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import BigNumber from 'bignumber.js';
import { MichelsonMap, Schema } from '@taquito/michelson-encoder';
import { BigMapAbstraction } from '../../src/contract/big-map';

/**
 * BigMapAbstraction test
 */
describe('BigMapAbstraction test', () => {
    let rpcContractProvider: {
        getBigMapKeysByID: jest.Mock<any, any>;
        getStorage: jest.Mock<any, any>;
        getBigMapKey: jest.Mock<any, any>;
        getBigMapKeyByID: jest.Mock<any, any>;
    };

    beforeEach(() => {
        rpcContractProvider = {
            getBigMapKeysByID: jest.fn(),
            getStorage: jest.fn(),
            getBigMapKey: jest.fn(),
            getBigMapKeyByID: jest.fn()
        };
    });

    describe('BigMapAbstraction getMultipleValues method', () => {
        it('throws error if error is not 404 from key lookup in BigMap', async (done) => {
            const expectedError = new HttpResponseError(
                'fail',
                STATUS_CODE.FORBIDDEN,
                'err',
                'test',
                'https://test.com'
            );
            rpcContractProvider.getBigMapKeysByID.mockRejectedValue(expectedError);
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                new Schema({
                    prim: 'big_map',
                    args: [{ prim: 'address' }, { prim: 'nat' }]
                }),
                rpcContractProvider as any
            );
            await expect(
                bigMap.getMultipleValues([
                    'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwNtest',
                    'tz2gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwNtest'
                ])
            ).rejects.toEqual(expectedError);
            done();
        });

        it('returns value for 1 key', async (done) => {
            rpcContractProvider.getBigMapKeysByID.mockResolvedValue(MichelsonMap.fromLiteral({
                tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN: new BigNumber(3),
            }));
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                new Schema({
                    prim: 'big_map',
                    args: [{ prim: 'address' }, { prim: 'nat' }]
                }),
                rpcContractProvider as any
            );
            const result = await bigMap.getMultipleValues(['tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN'])
            expect(result).toEqual(expect.objectContaining(
                MichelsonMap.fromLiteral({
                    tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN: new BigNumber(3),
                })
            ));
            done();
        });

        it('returns values for 2 keys', async (done) => {
            rpcContractProvider.getBigMapKeysByID.mockResolvedValue(MichelsonMap.fromLiteral({
                tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: undefined,
                tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN: new BigNumber(3)
            }));
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                new Schema({
                    prim: 'big_map',
                    args: [{ prim: 'address' }, { prim: 'nat' }]
                }),
                rpcContractProvider as any
            );
            expect(
                await bigMap.getMultipleValues([
                    'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
                    'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN'
                ])
            ).toEqual(expect.objectContaining(
                MichelsonMap.fromLiteral({
                    tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: undefined,
                    tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN: new BigNumber(3)
                })
            ));
            done();
        });
    });

    describe('BigMapAbstraction get method', () => {
        it('The get method accepts a parameter of type number', async (done) => {
            rpcContractProvider.getBigMapKeyByID.mockResolvedValue('test');
            const schema = new Schema({
                prim: 'big_map',
                args: [{ prim: 'int' }, { prim: 'string' }]
            })
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                schema,
                rpcContractProvider as any
            );
            expect(await bigMap.get(23)).toEqual('test');
            expect(rpcContractProvider.getBigMapKeyByID).toHaveBeenCalledWith('1', 23, schema, undefined)
            done();
        });

        it('The get method accepts a parameter of type string', async (done) => {
            rpcContractProvider.getBigMapKeyByID.mockResolvedValue('test');
            const schema = new Schema({
                prim: 'big_map',
                args: [{ prim: 'int' }, { prim: 'string' }]
            })
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                schema,
                rpcContractProvider as any
            );
            expect(await bigMap.get('23')).toEqual('test');
            expect(rpcContractProvider.getBigMapKeyByID).toHaveBeenCalledWith('1', '23', schema, undefined)
            done();
        });

        it('The get method accepts a parameter of type string and a level', async (done) => {
            rpcContractProvider.getBigMapKeyByID.mockResolvedValue('test');
            const schema = new Schema({
                prim: 'big_map',
                args: [{ prim: 'int' }, { prim: 'string' }]
            })
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                schema,
                rpcContractProvider as any
            );
            expect(await bigMap.get('23', 123456)).toEqual('test');
            expect(rpcContractProvider.getBigMapKeyByID).toHaveBeenCalledWith('1', '23', schema, 123456)
            done();
        });

        it('includes type argument when calling the get method', async (done) => {
            rpcContractProvider.getBigMapKeyByID.mockResolvedValue('test');
            const schema = new Schema({
                prim: 'big_map',
                args: [{ prim: 'int' }, { prim: 'string' }]
            })
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                schema,
                rpcContractProvider as any
            );
            expect(await bigMap.get<string>('23')).toEqual('test');
            expect(rpcContractProvider.getBigMapKeyByID).toHaveBeenCalledWith('1', '23', schema, undefined)
            done();
        });


        it('The get method accepts an object as parameter', async (done) => {
            rpcContractProvider.getBigMapKeyByID.mockResolvedValue('test');
            const schema = new Schema({
                prim: 'big_map',
                args: [{ "prim": "pair", "args": [{ "prim": "string", annots: ["%test"] }, { "prim": "string", annots: ["%test2"] }] }, { prim: 'string' }]
            })
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                schema,
                rpcContractProvider as any
            );
            expect(await bigMap.get({ 'test': 'test2', 'test2': 'test3' }, 123456)).toEqual('test');
            expect(rpcContractProvider.getBigMapKeyByID).toHaveBeenCalledWith('1', { 'test': 'test2', 'test2': 'test3' }, schema, 123456)
            done();
        });
    });
});
