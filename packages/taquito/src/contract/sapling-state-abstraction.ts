import BigNumber from 'bignumber.js';
import { StorageProvider } from './interface';
import { BlockIdentifier } from '../read-provider/interface';

export class SaplingStateAbstraction {
  constructor(
    private id: BigNumber,
    private provider: StorageProvider,
    private defaultBlock?: BlockIdentifier
  ) {}

  /**
   *
   * Fetch the sapling state
   *
   * @param block optional block level to fetch the values from (head will be use by default)
   * @returns Return a json object of the sapling_state
   *
   */
  async getSaplingDiff(block?: BlockIdentifier) {
    return this.provider.getSaplingDiffByID(this.id.toString(), block ?? this.defaultBlock);
  }

  getId() {
    return this.id.toString();
  }
}
