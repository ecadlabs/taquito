import {
  validateAddress,
  ValidationResult,
  validateChain,
  validateKeyHash,
  validateContractAddress,
  validatePublicKey,
  validateSignature,
} from '../src/validators';

describe('validateAddress', () => {
  it('Validate address properly', () => {
    expect(validateAddress('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(ValidationResult.VALID);
    expect(validateAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(ValidationResult.VALID);
    expect(validateAddress('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(ValidationResult.VALID);
    expect(validateAddress('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(ValidationResult.VALID);
    expect(validateAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D%test')).toEqual(ValidationResult.VALID);

    // Invalid checksum
    expect(validateAddress('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hm')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7sp')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateAddress('tz1')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateAddress('tz2')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateAddress('tz3')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateAddress('KT1')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateAddress('test')).toEqual(ValidationResult.NO_PREFIX_MATCHED);
    expect(validateAddress([])).toEqual(ValidationResult.NO_PREFIX_MATCHED);
    expect(validateAddress('')).toEqual(ValidationResult.NO_PREFIX_MATCHED);
  });
});

describe('validateChain', () => {
  it('Validate chain id properly', () => {
    expect(validateChain('NetXdQprcVkpaWU')).toEqual(ValidationResult.VALID);

    // Invalid checksum
    expect(validateChain('NetXdQprcVkpaWm')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateChain('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7sp')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateChain('tz1')).toEqual(ValidationResult.NO_PREFIX_MATCHED);
    expect(validateChain('tz2')).toEqual(ValidationResult.NO_PREFIX_MATCHED);
    expect(validateChain('tz3')).toEqual(ValidationResult.NO_PREFIX_MATCHED);
    expect(validateChain('KT1')).toEqual(ValidationResult.NO_PREFIX_MATCHED);
    expect(validateChain('test')).toEqual(ValidationResult.NO_PREFIX_MATCHED);
    expect(validateChain([])).toEqual(ValidationResult.NO_PREFIX_MATCHED);
    expect(validateChain('')).toEqual(ValidationResult.NO_PREFIX_MATCHED);
  });
});

describe('validateKeyHash', () => {
  it('Validate key hash properly', () => {
    expect(validateKeyHash('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(ValidationResult.VALID);
    expect(validateKeyHash('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateKeyHash('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(ValidationResult.VALID);
    expect(validateKeyHash('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(ValidationResult.VALID);
  });
});

describe('validateContractAddress', () => {
  it('Validate contract address properly', () => {
    expect(validateContractAddress('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateContractAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.VALID
    );
    expect(validateContractAddress('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateContractAddress('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
  });
});

describe('validatePublicKey', () => {
  it('Validate public key properly', () => {
    expect(validatePublicKey('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validatePublicKey('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validatePublicKey('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validatePublicKey('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validatePublicKey('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g')).toEqual(
      ValidationResult.VALID
    );
    expect(validatePublicKey('sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH')).toEqual(
      ValidationResult.VALID
    );
    expect(validatePublicKey('p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB')).toEqual(
      ValidationResult.VALID
    );
  });
});

describe('validateSignature', () => {
  it('Validate signature properly', () => {
    expect(
      validateSignature(
        'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
      )
    ).toEqual(ValidationResult.VALID);
    expect(
      validateSignature(
        'sigd9ugzpERZmBfyVAAPG4KZfpR4qYA4U51EcALp2hijGgJq3aRqFQANo4hudg3uWbSTaKRKzYhXeoG1TStq5jowaGx1dP9H'
      )
    ).toEqual(ValidationResult.VALID);
    expect(
      validateSignature(
        'spsig1RriZtYADyRhyNoQMa6AiPuJJ7AUDcrxWZfgqexzgANqMv4nXs6qsXDoXcoChBgmCcn2t7Y3EkJaVRuAmNh2cDDxWTdmsz'
      )
    ).toEqual(ValidationResult.VALID);
    expect(validateSignature('sigUdRdXYCXW14xqT8mFTMkX4wSmDMBmcW1Vuz1vanGWqYT')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateSignature('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateSignature('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateSignature('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateSignature('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateSignature('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateSignature('sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
    expect(validateSignature('p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB')).toEqual(
      ValidationResult.NO_PREFIX_MATCHED
    );
  });
});
