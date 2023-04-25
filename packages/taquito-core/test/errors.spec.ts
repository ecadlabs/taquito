import {
  TaquitoError,
  ParameterValidationError,
  RpcError,
  TezosToolkitConfigError,
  UnsupportedAction,
  NetworkError,
  PermissionDeniedError,
} from '../src/taquito-core';

describe('parent-errors', () => {
  it('should throw an ParameterValidationError', () => {
    try {
      throw new ParameterValidationError('tez');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(ParameterValidationError);
      expect(error.message).toEqual('tez');
    }
  });

  it('should throw an RpcError', () => {
    try {
      throw new RpcError('tez');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(RpcError);
      expect(error.message).toEqual('tez');
    }
  });
  it('should throw an TezosToolkitConfigError', () => {
    try {
      throw new TezosToolkitConfigError('tez');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(TezosToolkitConfigError);
      expect(error.message).toEqual('tez');
    }
  });
  it('should throw an UnsupportedAction', () => {
    try {
      throw new UnsupportedAction('tez');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(UnsupportedAction);
      expect(error.message).toEqual('tez');
    }
  });
  it('should throw an NetworkError', () => {
    try {
      throw new NetworkError('tez');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toEqual('tez');
    }
  });
  it('should throw an PermissionDeniedError', () => {
    try {
      throw new PermissionDeniedError('tez');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TaquitoError);
      expect(error).toBeInstanceOf(PermissionDeniedError);
      expect(error.message).toEqual('tez');
    }
  });
});
