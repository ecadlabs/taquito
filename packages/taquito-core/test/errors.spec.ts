import {
  TaquitoError,
  ParameterValidationError,
  RpcError,
  TezosToolkitConfigError,
  UnsupportedAction,
  NetworkError,
  PermissionDeniedError,
  InvalidAddressError,
  InvalidBlockHashError,
  InvalidDerivationPathError,
  InvalidHexStringError,
  InvalidMessageError,
  InvalidViewParameterError,
  InvalidKeyError,
  InvalidPublicKeyError,
  InvalidSignatureError,
  InvalidContractAddressError,
  InvalidChainIdError,
  InvalidKeyHashError,
  InvalidOperationHashError,
  InvalidOperationKindError,
  DeprecationError,
  ProhibitedActionError,
} from '../src/taquito-core';

describe('parent errors classes', () => {
  it('should throw an ParameterValidationError', () => {
    try {
      throw new ParameterValidationError();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(ParameterValidationError);
    }
  });

  it('should throw an RpcError', () => {
    try {
      throw new RpcError();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(RpcError);
    }
  });

  it('should throw an TezosToolkitConfigError', () => {
    try {
      throw new TezosToolkitConfigError();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(TezosToolkitConfigError);
    }
  });

  it('should throw an UnsupportedAction', () => {
    try {
      throw new UnsupportedAction();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(UnsupportedAction);
    }
  });

  it('should throw an NetworkError', () => {
    try {
      throw new NetworkError();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(NetworkError);
    }
  });

  it('should throw an PermissionDeniedError', () => {
    try {
      throw new PermissionDeniedError();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(PermissionDeniedError);
    }
  });
});

describe('common error classes', () => {
  it('should throw an InvalidAddressError', () => {
    try {
      throw new InvalidAddressError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidAddressError);
      expect(error.message).toEqual(`Invalid address "foo"`);
    }
  });

  it('should throw an InvalidBlockHashError', () => {
    try {
      throw new InvalidBlockHashError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidBlockHashError);
      expect(error.message).toEqual(`Invalid block hash "foo"`);
    }
  });

  it('should throw an InvalidDerivationPathError', () => {
    try {
      throw new InvalidDerivationPathError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidDerivationPathError);
      expect(error.message).toEqual(`Invalid derivation path "foo"`);
    }
  });

  it('should throw an InvalidHexStringError', () => {
    try {
      throw new InvalidHexStringError('0x12');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidHexStringError);
      expect(error.message).toEqual(`Invalid hex string "0x12"`);
    }
  });

  it('should throw an InvalidMessageError', () => {
    try {
      throw new InvalidMessageError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidMessageError);
      expect(error.message).toEqual(`Invalid message "foo"`);
    }
  });

  it('should throw an InvalidViewParameterError', () => {
    try {
      throw new InvalidViewParameterError('foo', { parameter: 'nat', result: 'nat' }, 'bar');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidViewParameterError);
      expect(error.message).toEqual(
        `Invalid arguments "bar" received for view name "foo", expecting one of the following signatures: "${JSON.stringify(
          { parameter: 'nat', result: 'nat' }
        )}".`
      );
    }
  });

  it('should throw an InvalidKeyError', () => {
    try {
      throw new InvalidKeyError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidKeyError);
      expect(error.message).toEqual(`Invalid key "foo"`);
    }
  });

  it('should throw an InvalidPublicKeyError', () => {
    try {
      throw new InvalidPublicKeyError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidPublicKeyError);
      expect(error.message).toEqual(`The public key 'foo' is invalid.`);
    }
  });

  it('should throw an InvalidSignatureError', () => {
    try {
      throw new InvalidSignatureError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidSignatureError);
      expect(error.message).toEqual(`The signature 'foo' is invalid.`);
    }
  });

  it('should throw an InvalidContractAddressError', () => {
    try {
      throw new InvalidContractAddressError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidContractAddressError);
      expect(error.message).toEqual(`The contract address 'foo' is invalid.`);
    }
  });

  it('should throw an InvalidChainIdError', () => {
    try {
      throw new InvalidChainIdError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidChainIdError);
      expect(error.message).toEqual(`The chain id 'foo' is invalid.`);
    }
  });

  it('should throw an InvalidKeyHashError', () => {
    try {
      throw new InvalidKeyHashError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidKeyHashError);
      expect(error.message).toEqual(`The public key hash 'foo' is invalid.`);
    }
  });

  it('should throw an InvalidOperationHashError', () => {
    try {
      throw new InvalidOperationHashError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidOperationHashError);
      expect(error.message).toEqual(`The operation hash 'foo' is invalid.`);
    }
  });

  it('should throw an InvalidOperationKindError', () => {
    try {
      throw new InvalidOperationKindError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error).toBeInstanceOf(InvalidOperationKindError);
      expect(error.message).toEqual(`The operation kind 'foo' is unsupported.`);
    }
  });

  it('should throw an DeprecationError', () => {
    try {
      throw new DeprecationError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(UnsupportedAction);
      expect(error).toBeInstanceOf(DeprecationError);
      expect(error.message).toEqual(`foo`);
    }
  });

  it('should throw an ProhibitedActionError', () => {
    try {
      throw new ProhibitedActionError('foo');
    } catch (error) {
      expect(error).toBeInstanceOf(UnsupportedAction);
      expect(error).toBeInstanceOf(ProhibitedActionError);
      expect(error.message).toEqual(`foo`);
    }
  });
});
