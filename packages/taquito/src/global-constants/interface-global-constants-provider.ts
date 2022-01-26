import { Expr } from '@taquito/michel-codec';

export type GlobalConstantHash = string;

export interface GlobalConstantsProvider {
  /**
   *
   * @description Retrieve the Michelson value of a global constant based on its hash
   *
   * @param hash a string representing the global constant hash
   */
  getGlobalConstantByHash(hash: GlobalConstantHash): Promise<Expr>;
}
