import {
  validateAddress,
  ValidationResult,
  validateChain,
  validateKeyHash,
  validateContractAddress,
  validatePublicKey,
  validateSignature,
  validateOperation,
  validateProtocol,
  validateBlock,
  validateSmartRollupAddress,
} from '../src/validators';

describe('validateAddress', () => {
  it('Validate address properly', () => {
    expect(validateAddress('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(ValidationResult.VALID);
    expect(validateAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(ValidationResult.VALID);
    expect(validateAddress('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(ValidationResult.VALID);
    expect(validateAddress('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(ValidationResult.VALID);
    expect(validateAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D%test')).toEqual(
      ValidationResult.VALID
    );
    expect(validateAddress('tz4EECtMxAuJ9UDLaiMZH7G1GCFYUWsj8HZn')).toEqual(ValidationResult.VALID);

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
    expect(validateAddress('tz4')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateAddress('test')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateAddress('')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateAddress('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9mAAAAAAAAAA')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );

    expect(validateAddress('sr166cywS6HJx9gmqMU28Vo284gPQaPcGmYW')).toEqual(ValidationResult.VALID);
    expect(validateAddress('sr166cywS6HJx9gmqMU28Vo284gPQaPcGmY1')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
  });
});

describe('validateSmartRollupAddress', () => {
  it('Validate smart rollup address properly', () => {
    expect(validateSmartRollupAddress('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSmartRollupAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSmartRollupAddress('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSmartRollupAddress('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSmartRollupAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSmartRollupAddress('tz4EECtMxAuJ9UDLaiMZH7G1GCFYUWsj8HZn')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );

    expect(validateSmartRollupAddress('test')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateSmartRollupAddress('')).toEqual(ValidationResult.INVALID_CHECKSUM);

    expect(validateSmartRollupAddress('sr166cywS6HJx9gmqMU28Vo284gPQaPcGmYW')).toEqual(
      ValidationResult.VALID
    );
    expect(validateSmartRollupAddress('sr166cywS6HJx9gmqMU28Vo284gPQaPcGmY1')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
  });
});

describe('validateChain', () => {
  it('Validate chain id properly', () => {
    expect(validateChain('NetXdQprcVkpaWU')).toEqual(ValidationResult.VALID);

    // Invalid checksum
    expect(validateChain('NetXdQprcVkpaWm')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateChain('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7sp')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateChain('tz1')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateChain('tz2')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateChain('tz3')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateChain('KT1')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateChain('test')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateChain('')).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateChain('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(ValidationResult.PREFIX_NOT_ALLOWED);
  });
});

describe('validateKeyHash', () => {
  it('Validate key hash properly', () => {
    expect(validateKeyHash('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(ValidationResult.VALID);
    expect(validateKeyHash('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateKeyHash('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(ValidationResult.VALID);
    expect(validateKeyHash('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(ValidationResult.VALID);
  });
});

describe('validateContractAddress', () => {
  it('Validate contract address properly', () => {
    expect(validateContractAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.VALID
    );
    expect(validateContractAddress('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateContractAddress('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateContractAddress('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(
      validateContractAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4Dasdasdasdasdadasd')
    ).toEqual(ValidationResult.INVALID_CHECKSUM);
    expect(validateContractAddress('KT1Fe71jyjrxFg9ZrYqtvaX7uQ')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
  });
});

describe('validatePublicKey', () => {
  it('Validate public key properly', () => {
    expect(validatePublicKey('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validatePublicKey('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validatePublicKey('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validatePublicKey('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
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
        'edsigthp7LbR5JQ1HRnxKdvhphTJs2omjnu6DF7LhRokPbPHXjkv2EqmCwu3KT1jKRZjrrgb749Yao26qMdcDFbXKrjA7KLSKRC'
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
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSignature('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSignature('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSignature('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSignature('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSignature('sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateSignature('p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
  });
});

describe('validateOperation', () => {
  it('Validate Operation Hash properly', () => {
    expect(validateOperation('ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj')).toEqual(
      ValidationResult.VALID
    );
    expect(validateOperation('onwtjK2Q32ndjF9zbEPPtmifdBq5qB59wjMP2oCH22mARjyKnGP')).toEqual(
      ValidationResult.VALID
    );
    expect(validateOperation('oo6JPEAy8VuMRGaFuMmLNFFGdJgiaKfnmT1CpHJfKP3Ye5ZahiP')).toEqual(
      ValidationResult.VALID
    );
    expect(validateOperation('ont3n75kMA2xeoTdxkGM23h5XhWgyP51WEznc4zCDtGNz1TWSzg')).toEqual(
      ValidationResult.VALID
    );

    expect(validateOperation('ont3n75kMA2xeoTdxkGM23h5XhWgyP51WEznc4zCDtGNz1TWSz')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateOperation('onwtjK2Q32ndjF9zbEPPtmifdBq5qB59wjMP2oCH22mARyKnGP')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );

    expect(validateOperation('sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
    expect(validateOperation('p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
  });
});

describe('validateProtocol', () => {
  it('Validate Protocol Hash properly', () => {
    expect(validateProtocol('Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('PsiThaCaT47Zboaw71QWScM8sXeMM7bbQFncK9FLqYc6EKdpjVP')).toEqual(
      ValidationResult.VALID
    );
    expect(validateProtocol('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK')).toEqual(
      ValidationResult.VALID
    );

    expect(validateProtocol('PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQE')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateProtocol('PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95b3m53QJiXGmrbU')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );

    expect(validateProtocol('ont3n75kMA2xeoTdxkGM23h5XhWgyP51WEznc4zCDtGNz1TWSz')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateProtocol('sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
  });
});

describe('validateBlock', () => {
  it('Validate Block Hash properly', () => {
    expect(validateBlock('BLJjnzaPtSsxykZ9pLTFLSfsKuiN3z7SjSPDPWwbE4Q68u5EpBw')).toEqual(
      ValidationResult.VALID
    );
    expect(validateBlock('BMEdgRZbJJqUrtByoA5Jyuvy8mzp8mefbcrno82nQCAEbBCUhog')).toEqual(
      ValidationResult.VALID
    );

    expect(validateBlock('BLJjnzaPtSsxykZ9pLTFLSfsKuiN3z7SjSPDPWwbE4Q68u5EBw')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateBlock('BMEdgRZbJJrtByoA5Jyuvy8mzp8mefbcrno82nQCAEbBCUhog')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );

    expect(validateBlock('bnt3n75kMA2xeoTdxkGM23h5XhWgyP51WEznc4zCDtGNz1TWSz')).toEqual(
      ValidationResult.INVALID_CHECKSUM
    );
    expect(validateBlock('sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH')).toEqual(
      ValidationResult.PREFIX_NOT_ALLOWED
    );
  });
});
