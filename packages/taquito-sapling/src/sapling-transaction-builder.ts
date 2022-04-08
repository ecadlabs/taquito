export class SaplingTransactionBuilder {
    #spendingKey: string;
    constructor(spendingKey: string){
        this.#spendingKey = spendingKey;
    }
    static fromMnemonic(_mnemonic: string[], _path: string){
        //transform mnemonic to sk
        // TODO
        return new SaplingTransactionBuilder('')
    }
}