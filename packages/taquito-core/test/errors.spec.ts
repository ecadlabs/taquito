import {
  TaquitoError,
  ParameterValidationError,
  InternalValidationError,
  UnsupportedAction,
  PermissionDeniedError,
  HttpError,
} from '../src/error/higher-category';
import {
  InvalidAddressError,
  InvalidDerivationPathError,
  InvalidDerivationTypeError,
  InvalidHexStringError,
  InvalidContractAddressError,
  InvalidBlockHashError,
  InvalidKeyError,
  InvalidPublicKeyError,
  InvalidChainIdError,
  InvalidKeyHashError,
  InvalidOperationHashError,
  InvalidOperationKindError,
  DeprecationError,
  ProhibitedActionError,
  HttpResponseError,
} from '../src/error/common';

describe('errors', () => {
  it('should throw an InvalidAddressError', () => {
    try {
      throw new InvalidAddressError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidAddressError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidDerivationPathError', () => {
    try {
      throw new InvalidDerivationPathError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidDerivationPathError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidDerivationTypeError', () => {
    try {
      throw new InvalidDerivationTypeError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidDerivationTypeError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidHexStringError', () => {
    try {
      throw new InvalidHexStringError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidHexStringError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidContractAddressError', () => {
    try {
      throw new InvalidContractAddressError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidContractAddressError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidBlockHashError', () => {
    try {
      throw new InvalidBlockHashError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(InternalValidationError);
      expect(e).toBeInstanceOf(InvalidBlockHashError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidKeyError', () => {
    try {
      throw new InvalidKeyError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidKeyError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidPublicKeyError', () => {
    try {
      throw new InvalidPublicKeyError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidPublicKeyError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidChainIdError', () => {
    try {
      throw new InvalidChainIdError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(InternalValidationError);
      expect(e).toBeInstanceOf(InvalidChainIdError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidKeyHashError', () => {
    try {
      throw new InvalidKeyHashError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidKeyHashError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidOperationHashError', () => {
    try {
      throw new InvalidOperationHashError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(InternalValidationError);
      expect(e).toBeInstanceOf(InvalidOperationHashError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an InvalidOperationKindError', () => {
    try {
      throw new InvalidOperationKindError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(ParameterValidationError);
      expect(e).toBeInstanceOf(InvalidOperationKindError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an DeprecationError', () => {
    try {
      throw new DeprecationError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(UnsupportedAction);
      expect(e).toBeInstanceOf(DeprecationError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an ProhibitedActionError', () => {
    try {
      throw new ProhibitedActionError('test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(PermissionDeniedError);
      expect(e).toBeInstanceOf(ProhibitedActionError);
      expect(e.message).toContain('test');
    }
  });

  it('should throw an HttpResponseError', () => {
    try {
      throw new HttpResponseError('test', 400, 'BAD_REQUEST', '{}', 'test');
    } catch (e) {
      expect(e).toBeInstanceOf(TaquitoError);
      expect(e).toBeInstanceOf(HttpError);
      expect(e).toBeInstanceOf(HttpResponseError);
      expect(e.message).toContain('test');
      expect(e.status).toBe(400);
      expect(e.statusText).toBe('BAD_REQUEST');
      expect(e.body).toBe('{}');
      expect(e.url).toBe('test');
    }
  });
});
