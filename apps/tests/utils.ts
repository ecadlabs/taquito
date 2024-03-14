import { TransactionOperation, TransactionWalletOperation } from "@taquito/taquito";

export const isWalletOperation = (op: TransactionWalletOperation | TransactionOperation): op is TransactionWalletOperation => {
    // eslint-disable-next-line no-prototype-builtins
    return op.hasOwnProperty("opHash");
}

export const getHash = (op: TransactionWalletOperation | TransactionOperation) => {
    return isWalletOperation(op) ? op.opHash : op.hash;
}
