import {
  ParameterValidationError,
  RpcError,
  TezosToolkitConfigError,
  UnsupportedAction,
  NetworkError,
  PermissionDeniedError,
} from '../src/taquito-core';

describe('errors', () => {
  it('should throw an ParameterValidationError', () => {
    try {
      throw new ParameterValidationError('parameter error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('parameter error');
    }
  });

  it('should throw an RpcError', () => {
    try {
      throw new RpcError('rpc error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('rpc error');
    }
  });

  it('should throw an TezosToolkitConfigError', () => {
    try {
      throw new TezosToolkitConfigError('TezosToolkit config error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('TezosToolkit config error');
    }
  });

  it('should throw an UnsupportedAction', () => {
    try {
      throw new UnsupportedAction('Unsupported action error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Unsupported action error');
    }
  });

  it('should throw an NetworkError', () => {
    try {
      throw new NetworkError('network error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('network error');
    }
  });

  it('should throw an PermissionDeniedError', () => {
    try {
      throw new PermissionDeniedError('permission denied error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('permission denied error');
    }
  });
});
