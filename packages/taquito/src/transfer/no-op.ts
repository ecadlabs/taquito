import { Estimate } from '../contract/estimate';
import { TransferParams } from '../operations/types';
import { Transfer } from './interface';

export class UnconfiguredTransferParamsError implements Error {
    name = 'UnconfiguredTransferParamsError';
    message =
        'No transfer parameters. Please configure by passing values to transfer(params).';
}

/**
 * @description Default signer implementation which does nothing and produce invalid signature
 */
export class NoOpTransfer implements Transfer {
    transferParams: TransferParams;
    constructor() {
        this.transferParams = { to: '', amount: 0 };
    }
    async estimate(): Promise<Estimate> {
        throw new UnconfiguredTransferParamsError();
    }
}