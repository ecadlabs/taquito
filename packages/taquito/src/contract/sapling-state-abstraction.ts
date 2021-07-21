import BigNumber from 'bignumber.js';
import { ContractProvider } from './interface';

export class SaplingStateAbstraction {
    constructor(private id: BigNumber, private provider: ContractProvider) { }

    /**
     *
     * @description Fetch the sapling state
     * 
     * @param block optional block level to fetch the values from (head will be use by default)
     * @returns Return a json object of the sapling_state
     *
     */
    async getSaplingDiff(block?: number) {
        return this.provider.getSaplingDiffByID(this.id.toString(), block);
    }

    getId() {
        return this.id.toString();
    }
}
