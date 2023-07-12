import { GlobalConstantHashAndValue } from '@taquito/michel-codec';
import { GlobalConstantNotFound } from './errors';
import { GlobalConstantHash, GlobalConstantsProvider } from './interface-global-constants-provider';

export class DefaultGlobalConstantsProvider implements GlobalConstantsProvider {
  private _globalConstantsLibrary: GlobalConstantHashAndValue = {};

  /**
   *
   * @description Allows to load global constant hashes and their corresponding Michelson JSON values
   */
  loadGlobalConstant(globalConstant: GlobalConstantHashAndValue) {
    for (const hash in globalConstant) {
      Object.assign(this._globalConstantsLibrary, {
        [hash]: globalConstant[hash],
      });
    }
  }

  /**
   *
   * @description Retrieve the Michelson value of a global constant based on its hash
   *
   * @param hash a string representing the global constant hash
   * @returns Expr, the JSON Michelson value
   */
  async getGlobalConstantByHash(hash: GlobalConstantHash) {
    const value = this._globalConstantsLibrary[hash];
    if (!value) {
      throw new GlobalConstantNotFound(hash);
    }
    return value;
  }
}
