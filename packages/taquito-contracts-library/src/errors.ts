import { ParameterValidationError } from '@taquito/core';
import { ScriptedContracts } from '@taquito/rpc';
/**
 *  @category Error
 *  @description Error indicates invalid script format being useed or passed
 */
export class InvalidScriptFormatError extends ParameterValidationError {
  constructor(
    public readonly message: string,
    public readonly script: ScriptedContracts,
    public readonly address: string
  ) {
    super();
    this.name = 'InvalidScriptFormatError';
  }
}
