import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import BigNumber from 'bignumber.js';
import { Schema } from '@taquito/michelson-encoder';
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
            rpcContractProvider.getBigMapKeysByID.mockResolvedValue({
                tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN: new BigNumber(3)
            });
            const bigMap = new BigMapAbstraction(
                new BigNumber('1'),
                new Schema({
                    prim: 'big_map',
                    args: [{ prim: 'address' }, { prim: 'nat' }]
                }),
                rpcContractProvider as any
            );
            expect(await bigMap.getMultipleValues(['tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN'])).toEqual({
                tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN: new BigNumber(3)
            });
            done();
        });

        it('returns values for 2 keys', async (done) => {
            rpcContractProvider.getBigMapKeysByID.mockResolvedValue({
                tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: undefined,
                tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN: new BigNumber(3)
            });
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
            ).toEqual({
                tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: undefined,
                tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN: new BigNumber(3)
            });
            done();
        });
    });
});
