import { valueEncoder } from '../../src/michelson/codec';
import { valueEncoderProto14 } from '../../src/proto14-kathmandu/michelson/codec-proto14';

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

describe('valueEncoderProto14', () => {
  test('Should produce value encoding for bytes', () => {
    expect(valueEncoderProto14({ bytes: '0202' })).toEqual('0a000000020202');
  });

  test('Should produce valid encoding for prim', () => {
    const value = {
      prim: 'Pair',
      args: [{ bytes: '0202' }, { bytes: '0405' }],
    };
    expect(valueEncoderProto14(value)).toEqual('07070a0000000202020a000000020405');
  });
});
