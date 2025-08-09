/**
 * @packageDocumentation
 * @module @taquito/contracts-library
 */

import { EntrypointsResponse, ScriptedContracts } from '@taquito/rpc';
import { Extension, Context } from '@taquito/taquito';
import { validateAddress, ValidationResult } from '@taquito/utils';
import { InvalidScriptFormatError } from './errors';
import { ReadWrapperContractsLibrary } from './read-provider-wrapper';
import { InvalidAddressError } from '@taquito/core';

interface ContractsData {
  [contractAddress: string]: { script: ScriptedContracts; entrypoints: EntrypointsResponse };
}

/**
 * @description Allows to specify static data related to contracts (i.e., script and entrypoints) avoiding Taquito to fetch them from the network.
 *
 * @example
 * ```
 * import { ContractsLibrary } from '@taquito/contracts-library';
 * import { TezosToolkit } from '@taquito/taquito';
 *
 * const Tezos = new TezosToolkit('rpcUrl');
 * const contractsLibrary = new ContractsLibrary();
 *
 * contractsLibrary.addContract({
 *      ['contractAddress1']: {
 *          script: script1, // obtained from Tezos.rpc.getContract('contractAddress1').script
 *          entrypoints: entrypoints1 // obtained from Tezos.rpc.getEntrypoints('contractAddress1')
 *      },
 *      // load more contracts
 * });
 *
 * Tezos.addExtension(contractsLibrary);
 * ```
 *
 */
export class ContractsLibrary implements Extension {
  private _contractsLibrary: ContractsData = {};

  /**
   * @description Saves one of several contract in the library
   *
   * @param contract is an object where the key is a contract address and the value is an object having a script and an entrypoints properties.
   * Note: the expected format for the script and entrypoints properties are the same as the one respectivlely returned by
   * `TezosToolkit.rpc.getContract('contractAddress').script` and `TezosToolkit.rpc.getEntrypoints`
   * @throws {@link InvalidAddressError} If the contract address is not valid
   * @throws {@link InvalidScriptFormatError} If the script is not in the expected format
   */
  addContract(contract: ContractsData) {
    for (const contractAddress in contract) {
      this.validateContractAddress(contractAddress);
      this.validateContractScriptFormat(contract[contractAddress].script, contractAddress);
      Object.assign(this._contractsLibrary, {
        [contractAddress]: { ...contract[contractAddress] },
      });
    }
  }

  getContract(contractAddress: string) {
    return this._contractsLibrary[contractAddress];
  }

  configureContext(context: Context) {
    context.registerProviderDecorator((context: Context) => {
      context.readProvider = new ReadWrapperContractsLibrary(context.readProvider, this);
      return context;
    });
  }

  private validateContractAddress(address: string) {
    const addressValidation = validateAddress(address);
    if (addressValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(address, addressValidation);
    }
  }

  private validateContractScriptFormat(script: ScriptedContracts, address: string) {
    if (!script.code) {
      throw new InvalidScriptFormatError(
        `Invalid script format of ${address} missing property "code". Valid script can be retrieved from "TezosToolkit.rpc.getNormalizedScript(${address})".`,
        script,
        address
      );
    }
  }
}
