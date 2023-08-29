import { ParameterValidationError, RpcError, NetworkError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates invalid confirmation count has been passed or configured
 */
export class InvalidConfirmationCountError extends ParameterValidationError {
  constructor(public readonly invalidConfirmations: number) {
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
  constructor(public readonly message: string) {
    super();
    this.name = 'ConfirmationTimeoutError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an error being returned from the RPC response
 */
export class RPCResponseError extends RpcError {
  constructor(public readonly message: string, public readonly cause?: any) {
    super();
    this.name = 'RPCResponseError';
  }
}
