import {
  bigMapValue,
  rpcContractResponse as rpcContractResponse4,
  storage as storage4,
} from '../data/sample4';
import { Schema } from '../src/schema/storage';
import { MichelsonMap } from '../src/michelson-map';

describe('Schema test', () => {
  it('Should encode key properly', () => {
    const schema = new Schema(storage4);
    const encoded = schema.EncodeBigMapKey('AZEAZEJAZEJ');
    expect(encoded).toEqual({
      key: {
        string: 'AZEAZEJAZEJ',
      },
      type: {
        prim: 'string',
      },
    });
  });
  it('Should parse storage properly', () => {
    const schema = new Schema(storage4);
    const storage = schema.Execute(rpcContractResponse4.script.storage);
    expect(storage).toEqual({
      '0': new MichelsonMap(),
      '1': 'tz1W8qq2VPJcbXkAMxG8zwXCbtwbDPMfTRZd',
    });
  });

  it('Should encode storage properly', () => {
    const schema = new Schema(storage4);
    const result = schema.Encode({
      '0': new MichelsonMap(),
      '1': 'tz1W8qq2VPJcbXkAMxG8zwXCbtwbDPMfTRZd',
    });
    expect(result).toEqual({
      args: [[], rpcContractResponse4.script.storage.args[1]],
      prim: 'Pair',
    });
  });

  it('Should parse big map value properly', () => {
    const schema = new Schema(storage4);
    const value = schema.ExecuteOnBigMapValue(bigMapValue);
    expect(value).toEqual({
      clients: [],
      userRecord: ['1234567891', '123456', '123456'],
    });
  });
});
