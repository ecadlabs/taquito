import BigNumber from 'bignumber.js';
import { rpcContractResponse as rpcContractResponse5, storage as storage5 } from '../data/sample5';
import { Schema } from '../src/schema/storage';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new Schema(storage5);
    const storage = schema.Execute(rpcContractResponse5.script.storage);
    expect(storage).toEqual({
      '0': {},
      totalSupply: new BigNumber('1000'),
      approver: 'tz1g3oS1UPgWFFpxrc2pEn4sgV3ky1Z6Qaz2',
      centralBank: 'tz1g3oS1UPgWFFpxrc2pEn4sgV3ky1Z6Qaz2',
    });
  });
});
