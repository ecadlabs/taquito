import { TransactionOperation } from '../../operations/transaction-operation';
import { TransferParams } from '../../operations/types';
import { TransactionWalletOperation } from '../../wallet';

export interface SendParams {
    fee?: number;
    storageLimit?: number;
    gasLimit?: number;
    amount: number;
    source?: string;
    mutez?: boolean;
}

// Ensure that all parameter that are not in SendParams are defined
export type ExplicitTransferParams = Required<Omit<TransferParams, keyof SendParams>> & SendParams;

export interface ContractMethodInterface {

    /**
     *
     * Send the smart contract operation
     *
     * @param params generic operation parameter
     */
    send(params: Partial<SendParams>): Promise<TransactionWalletOperation | TransactionOperation>;

    /**
     *
     * Create transfer params to be used with TezosToolkit.contract.transfer methods
     *
     * @param params generic transfer operation parameters
     */
    toTransferParams(params: Partial<SendParams>): TransferParams;
}