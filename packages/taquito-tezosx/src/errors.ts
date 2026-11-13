// Adapted from trilitech/octez.js #123-126. Copyright 2026 Nomadic Labs. Apache-2.0.
import { TaquitoError, ParameterValidationError } from '@taquito/core';

/**
 *  @category Error
 *  Error that indicates a wei amount that cannot be converted to mutez without loss
 */
export class SubMutezPrecisionError extends ParameterValidationError {
  constructor(
    public readonly weiValue: bigint,
    public readonly remainderWei: bigint
  ) {
    super(
      `Amount ${weiValue} wei is not divisible by 10^12 (1 mutez); ` +
        `remainder ${remainderWei} wei would be lost on the Michelson runtime.`
    );
    this.name = 'SubMutezPrecisionError';
  }
}

/**
 *  @category Error
 *  Error that indicates a string that is not a valid ABI function signature
 */
export class InvalidMethodSignatureError extends ParameterValidationError {
  constructor(public readonly methodSignature: string) {
    super(`Invalid ABI function signature "${methodSignature}"`);
    this.name = 'InvalidMethodSignatureError';
  }
}

/**
 *  @category Error
 *  Error that indicates a function selector with no known ABI signature
 */
export class UnknownSelectorError extends ParameterValidationError {
  constructor(public readonly selector: string) {
    super(
      `Unknown function selector 0x${selector}. Pass its ABI signature as ` +
        '`methodSignature` or in `knownSignatures`.'
    );
    this.name = 'UnknownSelectorError';
  }
}

/**
 *  @category Error
 *  Error that indicates an ABI signature that does not match the calldata selector
 */
export class SelectorMismatchError extends ParameterValidationError {
  constructor(
    public readonly methodSignature: string,
    public readonly selector: string
  ) {
    super(`ABI signature "${methodSignature}" does not match the calldata selector 0x${selector}.`);
    this.name = 'SelectorMismatchError';
  }
}

/**
 *  @category Error
 *  Error that indicates an invalid EVM address
 */
export class InvalidEvmAddressError extends ParameterValidationError {
  constructor(public readonly address: string) {
    super(`Invalid EVM address "${address}"`);
    this.name = 'InvalidEvmAddressError';
  }
}

/**
 *  @category Error
 *  Error that indicates a method signature given without the calldata of the call
 */
export class MissingCalldataError extends ParameterValidationError {
  constructor(public readonly methodSignature: string) {
    super(
      `Method signature "${methodSignature}" given without calldata. Pass the ABI-encoded ` +
        'call (at least its 4-byte selector) as `data`.'
    );
    this.name = 'MissingCalldataError';
  }
}

/**
 *  @category Error
 *  Error that indicates a mutez amount that does not fit in a JavaScript number
 */
export class UnsafeMutezAmountError extends ParameterValidationError {
  constructor(public readonly mutezAmount: bigint) {
    super(`Amount ${mutezAmount} mutez is larger than Number.MAX_SAFE_INTEGER.`);
    this.name = 'UnsafeMutezAmountError';
  }
}

/**
 *  @category Error
 *  Error that indicates an invalid Michelson entrypoint name
 */
export class InvalidEntrypointNameError extends ParameterValidationError {
  constructor(public readonly entrypoint: string) {
    super(`Invalid entrypoint name "${entrypoint}"`);
    this.name = 'InvalidEntrypointNameError';
  }
}

/**
 *  @category Error
 *  Error that indicates a cross-runtime intent that cannot be built
 */
export class UnsupportedCrossRuntimeIntentError extends TaquitoError {
  constructor(public readonly kind: string) {
    super(`Cannot build an EVM → Michelson call for intent kind "${kind}".`);
    this.name = 'UnsupportedCrossRuntimeIntentError';
  }
}
