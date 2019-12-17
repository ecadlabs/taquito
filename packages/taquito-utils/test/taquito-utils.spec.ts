import { encodeExpr, validateAddress } from '../src/taquito-utils';

describe('Encode expr', () => {
  it('Should encode expression properly', () => {
    expect(encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea')).toEqual(
      'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN'
    );
  });
});

describe('validateAddress', () => {
  it('Validate address properly', () => {
    expect(validateAddress('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(true);
    expect(validateAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(true);
    expect(validateAddress('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(true);
    expect(validateAddress('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(true);

    // Invalid checksum
    expect(validateAddress('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hm')).toEqual(false);
    // Too short
    expect(validateAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4')).toEqual(false);
    expect(validateAddress('tz1')).toEqual(false);
    expect(validateAddress('tz2')).toEqual(false);
    expect(validateAddress('tz3')).toEqual(false);
    expect(validateAddress('KT1')).toEqual(false);
    expect(validateAddress('test')).toEqual(false);
    expect(validateAddress([])).toEqual(false);
    expect(validateAddress('')).toEqual(false);
  });
});
