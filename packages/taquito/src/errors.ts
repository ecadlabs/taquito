import { ParameterValidationError, RpcError, NetworkError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates invalid confirmation count has been passed or configured
 */
export class InvalidConfirmationCountError extends ParameterValidationError {
  constructor(invalidConfirmations: number) {
    super();
    this.name = 'InvalidConfirmationCountError';
    this.message = `Invalid confirmation count ${invalidConfirmations} expecting at least 1`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates that confirmation polling timed out
 */
export class ConfirmationTimeoutError extends NetworkError {
  constructor(public message: string) {
    super();
    this.name = 'ConfirmationTimeoutError';
  }
}

/**
 *  @category Error
 *  @description Error indicates an error being returned from the RPC response
 */
export class RPCResponseError extends RpcError {
  constructor(public message: string, public cause?: any) {
    super();
    this.name = 'RPCResponseError';
  }
}
