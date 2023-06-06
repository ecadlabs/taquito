import { ParameterValidationError } from '@taquito/core';
import { ScriptedContracts } from '@taquito/rpc';
/**
 *  @category Error
 *  @description Error indicates invalid script format being useed or passed
 */
export class InvalidScriptFormatError extends ParameterValidationError {
  constructor(public message: string, public script: ScriptedContracts, public address: string) {
    super();
    this.name = 'InvalidScriptFormatError';
  }
}
