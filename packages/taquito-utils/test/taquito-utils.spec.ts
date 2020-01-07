import { encodeExpr, encodeBlindedPKH } from '../src/taquito-utils';

describe('Encode expr', () => {
  it('Should encode expression properly', () => {
    expect(encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea')).toEqual(
      'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN'
    );
  });
});

describe('Encode BPKH', () => {
  it('Should encode blinded pkh properly', () => {
    expect(
      encodeBlindedPKH(
        '1f1c3491f4f2ee58ce7e7cb915b08f28cff46c9d',
        'tz1Yn8ato3ZQtDcYm34gJvjiH8tFJyUYuMZp'
      )
    ).toEqual('btz1NLZqX5cQB9LgN4soz3dEEfiEykmHmNd8u');
  });
});
