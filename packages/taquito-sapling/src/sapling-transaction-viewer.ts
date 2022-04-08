import * as sapling from '@airgap/sapling-wasm'

export class SaplingTransactionViewer {
    #viewingKey: Buffer;
    constructor(viewingKey: Buffer) {
        this.#viewingKey = viewingKey
    }

    static async fromSpendingKey(spendingKey: string, password?: string) {
        if (password) {
            // decode
            // TODO
        }
        const vk = await sapling.getExtendedFullViewingKeyFromSpendingKey(spendingKey);
        return new SaplingTransactionViewer(vk);
    }

    getViewingKey(){
        return this.#viewingKey;
    }

    
}