import * as utils from '../src/taquito-utils';
import { tz5 } from '../../../test-fixtures/tz5';

const address = 'tz1ipB38oB5F76HnbTRqWPLEnVtCgj6yf2nB';
const contract = 'KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC';
const publicKey = 'edpku61nGAwkeoA7PQJEFWmrVP1eWrSTVoHgCaF2isjWqDeGdux37k';
const operation = 'oo6JPEAy8VuMRGaFuMmLNFFGdJgiaKfnmT1CpHJfKP3Ye5ZahiP';
// Fixed valid values from validators.spec.ts and the independent BLS RPC fixtures.
const additionalAddresses = [
  'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m',
  'tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN',
  'tz4AQcKaQU1sUzsmPTX43qnK4ddkCeeknJnf',
  'sr166cywS6HJx9gmqMU28Vo284gPQaPcGmYW',
];
const additionalPublicKeys = [
  'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
  'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB',
  'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
];
const nonstrings: unknown[] = [
  undefined,
  null,
  0,
  true,
  {},
  [],
  Symbol('input'),
  new String(address),
  { toString: () => address },
];

describe('isValidAddress', () => {
  it.each(additionalPublicKeys)('rejects a public key as an address %s', (value) => {
    expect(utils.isValidAddress(value)).toBe(false);
  });
  it.each([
    address,
    ...additionalAddresses,
    contract,
    `${contract}%entrypoint`,
    `${address}%default`,
    tz5.publicKeyHash,
  ])('accepts %s', (value) => {
    expect(utils.isValidAddress(value)).toBe(true);
  });
  it.each(nonstrings)('rejects nonstring input %#', (value) => {
    expect(utils.isValidAddress(value)).toBe(false);
  });
  it.each(['', 'invalid', publicKey.slice(0, -1) + '0', operation.slice(0, -1) + '0'])(
    'rejects malformed input %s',
    (value) => {
      expect(utils.isValidAddress(value)).toBe(false);
    }
  );
  it.each([
    address,
    contract,
    publicKey,
    operation,
    `${contract}%entrypoint`,
    tz5.publicKeyHash,
    tz5.publicKey,
  ])('preserves existing validation for %s', (value) => {
    expect(utils.isValidAddress(value)).toBe(
      utils.validateAddress(value) === utils.ValidationResult.VALID
    );
  });
});

describe('isValidContractAddress', () => {
  it.each(additionalAddresses)('rejects noncontract address %s', (value) => {
    expect(utils.isValidContractAddress(value)).toBe(false);
  });
  it.each([contract])('accepts %s', (value) => {
    expect(utils.isValidContractAddress(value)).toBe(true);
  });
  it.each(nonstrings)('rejects nonstring input %#', (value) => {
    expect(utils.isValidContractAddress(value)).toBe(false);
  });
  it.each(['', 'invalid', publicKey.slice(0, -1) + '0', operation.slice(0, -1) + '0'])(
    'rejects malformed input %s',
    (value) => {
      expect(utils.isValidContractAddress(value)).toBe(false);
    }
  );
  it.each([
    address,
    contract,
    publicKey,
    operation,
    `${contract}%entrypoint`,
    tz5.publicKeyHash,
    tz5.publicKey,
  ])('preserves existing validation for %s', (value) => {
    expect(utils.isValidContractAddress(value)).toBe(
      utils.validateContractAddress(value) === utils.ValidationResult.VALID
    );
  });
});

describe('isValidPublicKey', () => {
  it.each(additionalAddresses)('rejects an address as a public key %s', (value) => {
    expect(utils.isValidPublicKey(value)).toBe(false);
  });
  it.each([publicKey, ...additionalPublicKeys, tz5.publicKey])('accepts %s', (value) => {
    expect(utils.isValidPublicKey(value)).toBe(true);
  });
  it.each(nonstrings)('rejects nonstring input %#', (value) => {
    expect(utils.isValidPublicKey(value)).toBe(false);
  });
  it.each(['', 'invalid', publicKey.slice(0, -1) + '0', operation.slice(0, -1) + '0'])(
    'rejects malformed input %s',
    (value) => {
      expect(utils.isValidPublicKey(value)).toBe(false);
    }
  );
  it.each([
    address,
    contract,
    publicKey,
    operation,
    `${contract}%entrypoint`,
    tz5.publicKeyHash,
    tz5.publicKey,
  ])('preserves existing validation for %s', (value) => {
    expect(utils.isValidPublicKey(value)).toBe(
      utils.validatePublicKey(value) === utils.ValidationResult.VALID
    );
  });
});

describe('isValidOperationHash', () => {
  it.each([operation])('accepts %s', (value) => {
    expect(utils.isValidOperationHash(value)).toBe(true);
  });
  it.each(nonstrings)('rejects nonstring input %#', (value) => {
    expect(utils.isValidOperationHash(value)).toBe(false);
  });
  it.each(['', 'invalid', publicKey.slice(0, -1) + '0', operation.slice(0, -1) + '0'])(
    'rejects malformed input %s',
    (value) => {
      expect(utils.isValidOperationHash(value)).toBe(false);
    }
  );
  it.each([
    address,
    contract,
    publicKey,
    operation,
    `${contract}%entrypoint`,
    tz5.publicKeyHash,
    tz5.publicKey,
  ])('preserves existing validation for %s', (value) => {
    expect(utils.isValidOperationHash(value)).toBe(
      utils.validateOperation(value) === utils.ValidationResult.VALID
    );
  });
});

describe('getPublicKeyHashFromPublicKey', () => {
  it('returns the existing fixed Ed25519 address', () => {
    expect(utils.getPublicKeyHashFromPublicKey(publicKey)).toBe(address);
    expect(utils.getPkhfromPk(publicKey)).toBe(address);
  });
  it('retains ML-DSA public-key support', () => {
    expect(utils.getPublicKeyHashFromPublicKey(tz5.publicKey)).toBe(tz5.publicKeyHash);
  });
  it('preserves errors for invalid public keys', () => {
    expect(() => utils.getPublicKeyHashFromPublicKey('invalid')).toThrow();
  });
});
