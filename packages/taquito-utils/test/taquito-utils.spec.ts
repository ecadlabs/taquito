import { encodeExpr, hex2buf, b58cencode, Prefix, prefix } from '../src/taquito-utils';

describe('Encode expr', () => {
  it('Should encode expression properly', () => {
    expect(encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea')).toEqual(
      'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN'
    );

  });
  it('', () => {
    console.log(b58cencode('72e0eb5af37afe9da91c9928be287d4a3ca2b18028c5895048a830157ee86aa45ae55dd62639c4eae753dafbd1a7abd7ea108a1924a93c2e91f4c84223692e40', prefix[Prefix.EDSK]))
    hex2buf('72e0eb5af37afe9da91c9928be287d4a3ca2b18028c5895048a830157ee86aa45ae55dd62639c4eae753dafbd1a7abd7ea108a1924a93c2e91f4c84223692e40')
  })
});
