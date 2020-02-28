import { rpcContractResponse as rpcContractResponse2, storage as storage2 } from '../data/sample2';
import { Schema } from '../src/schema/storage';
import { MichelsonMap } from '../src/michelson-map';

describe('Schema test', () => {
  it('Should parse storage with map that have string as key properly', () => {
    const schema = new Schema(storage2);
    const s = schema.Execute(rpcContractResponse2.script.storage);
    expect(s).toEqual({
      '0': new MichelsonMap(),
      admin: 'tz1M9CMEtsXm3QxA7FmMU2Qh7xzsuGXVbcDr',
      metaData: MichelsonMap.fromLiteral({
        By: 'https://SmartPy.io',
        Help: 'Use Build to define a new game board and Play to make moves',
        'Play at':
          'https://smartpy.io/demo/explore.html?address=KT1UvfyLytrt71jh63YV4Yex5SmbNXpWHxtg',
        'SmartPy Template': 'https://smartpy.io/demo/index.html?template=tictactoeFactory.py',
      }),
      paused: false,
    });
  });

  it('Should encode storage properly', () => {
    const schema = new Schema(storage2);
    const result = schema.Encode({
      '0': new MichelsonMap(),
      admin: 'tz1M9CMEtsXm3QxA7FmMU2Qh7xzsuGXVbcDr',
      metaData: MichelsonMap.fromLiteral({
        By: 'https://SmartPy.io',
        Help: 'Use Build to define a new game board and Play to make moves',
        'Play at':
          'https://smartpy.io/demo/explore.html?address=KT1UvfyLytrt71jh63YV4Yex5SmbNXpWHxtg',
        'SmartPy Template': 'https://smartpy.io/demo/index.html?template=tictactoeFactory.py',
      }),
      paused: false,
    });
    expect(result).toEqual({
      args: [[], rpcContractResponse2.script.storage.args[1]],
      prim: 'Pair',
    });
  });
});
