import { valueEncoder } from '../../src/michelson/codec';

describe('valueEncoder', () => {
  test('Should produce value encoding for bytes', () => {
    expect(valueEncoder({ bytes: '0202' })).toEqual('0a000000020202');
  });

  test('Should produce valid encoding for prim', () => {
    const value = {
      prim: 'Pair',
      args: [{ bytes: '0202' }, { bytes: '0405' }],
    };
    expect(valueEncoder(value)).toEqual('07070a0000000202020a000000020405');
  });
});
