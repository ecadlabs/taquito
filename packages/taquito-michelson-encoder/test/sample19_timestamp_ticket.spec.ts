import BigNumber from 'bignumber.js';
import { bigMapValue, rpcContractResponse, storage } from '../data/sample19_timestamp_ticket';
import { Schema } from '../src/schema/storage';
import { expectMichelsonMap } from './utils';

describe('Schema with a ticket of type timestamp inside a big map %tickets in storage', () => {
    // key of the big map is address and value is ticket of type timestamp
    it('Should decode storage properly', () => {
        const schema = new Schema(storage);
        expect(schema.Execute(rpcContractResponse.script.storage)).toEqual({
            data: {
                winners: '24059',
                bets: expectMichelsonMap(),
                current_pot: new BigNumber('0'),
                opened_at: '2019-09-09T12:09:37.000Z',
                settings: {
                    pool_type: 'XTZ-USD',
                    entrance_fee: new BigNumber('2'),
                    minimum_bet: new BigNumber('2'),
                    open_period: new BigNumber('86400'),
                    validation_delay: new BigNumber('86400'),
                    ticket_validity: new BigNumber('2592000'),
                    max_capacity: new BigNumber(9)
                },
                validator: null,
                pending_validation: false,
                oracle: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
                admin: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'
            },
            tickets: '24060'
        });
    });

    it('Should extract schema properly', () => {
        const schema = new Schema(storage);
        expect(schema.ExtractSchema()).toEqual({
            data: {
                winners: { address: 'mutez' },
                bets: {
                    map: {
                        key: 'address',
                        value: 'nat'
                    }
                },
                current_pot: 'mutez',
                opened_at: 'timestamp',
                settings: {
                    pool_type: 'string',
                    entrance_fee: 'mutez',
                    minimum_bet: 'mutez',
                    open_period: 'int',
                    validation_delay: 'int',
                    ticket_validity: 'int',
                    max_capacity: 'nat'
                },
                validator: 'address',
                pending_validation: 'bool',
                oracle: 'address',
                admin: 'address'
            },
            tickets: {
                address: {
                    amount: 'int',
                    ticketer: 'contract',
                    value: 'timestamp'
                }
            }
        });
    });

    it('Should parse big map value properly', () => {
        const schema = new Schema({
            prim: 'big_map',
            args: [{ prim: 'address' }, { prim: 'ticket', args: [{ prim: 'timestamp' }] }],
            annots: ['%tickets']
        });
        const value = schema.ExecuteOnBigMapValue(bigMapValue);
        expect(value).toEqual({
            ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
            value: '2021-03-09T16:32:15.000Z',
            amount: new BigNumber('2')
        });
    });
});
