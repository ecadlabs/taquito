import { ParameterValidationError } from '@taquito/core';
import { FilterExpression } from '../taquito';

/**
 *  @category Error
 *  @description Error that indicates an unsupported event being passed or used
 */
export class UnsupportedEventError extends ParameterValidationError {
  public name = 'UnsupportedEventError';
  constructor(public type: string) {
    super();
    this.name = 'UnsupportedEventError';
    this.message = `Unsupported event type "${type}" expecting one of the "data", "error", or "close".`;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid filter expression being passed or used
 */
export class InvalidFilterExpressionError extends ParameterValidationError {
  constructor(public invalidExpression: FilterExpression) {
    super();
    this.name = 'InvalidFilterExpressionError';
    this.message = `Invalid filter expression expecting the object to contain either and/or property`;
  }
}
