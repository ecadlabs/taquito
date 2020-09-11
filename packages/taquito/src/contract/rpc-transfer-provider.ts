import { Context } from "../context";
import BigNumber from 'bignumber.js';
import { TransferParams, PrepareOperationParams, isOpWithFee } from "../operations/types";
import { OperationEmitter } from "../operations/operation-emitter";
import { Estimate } from "./estimate";
import { createTransferOperation } from "./prepare";
import { RPCRunOperationParam, PreapplyResponse } from "@taquito/rpc";
import { flattenErrors, TezosOperationError, flattenOperationResult } from "../operations/operation-errors";
import { NoOpTransfer } from "../transfer/no-op";

// RPC requires a signature but does not verify it
const SIGNATURE_STUB =
    'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

interface Limits {
    fee?: number;
    storageLimit?: number;
    gasLimit?: number;
}

const mergeLimits = (
    userDefinedLimit: Limits,
    defaultLimits: Required<Limits>
): Required<Limits> => {
    return {
        fee: typeof userDefinedLimit.fee === 'undefined' ? defaultLimits.fee : userDefinedLimit.fee,
        gasLimit:
            typeof userDefinedLimit.gasLimit === 'undefined'
                ? defaultLimits.gasLimit
                : userDefinedLimit.gasLimit,
        storageLimit:
            typeof userDefinedLimit.storageLimit === 'undefined'
                ? defaultLimits.storageLimit
                : userDefinedLimit.storageLimit,
    };
};

export class TransferProvider extends OperationEmitter {
    private _context: Context;
    private _transferParams: TransferParams;
    private readonly ALLOCATION_STORAGE = 257;
    private readonly ORIGINATION_STORAGE = 257;

    constructor(context: Context) {
        super(context);
        // Currently we are not using context, but has been added for future usage
        this._context = context;
        this._transferParams = (new NoOpTransfer()).transferParams;
    }

    // Initialise tranferParams since constructor did not have them while invocation
    transfer = (transferParams: TransferParams) => {
        this._transferParams = transferParams;
        return this;
    }

    // Maximum values defined by the protocol
    private async getAccountLimits(pkh: string) {
        const balance = await this.rpc.getBalance(pkh);
        const {
            hard_gas_limit_per_operation,
            hard_storage_limit_per_operation,
            cost_per_byte,
        } = await this.rpc.getConstants();
        return {
            fee: 0,
            gasLimit: hard_gas_limit_per_operation.toNumber(),
            storageLimit: Math.floor(
                BigNumber.min(balance.dividedBy(cost_per_byte), hard_storage_limit_per_operation).toNumber()
            ),
        };
    }

    private createEstimateFromOperationContent(
        content: PreapplyResponse['contents'][0],
        size: number
    ) {
        const operationResults = flattenOperationResult({ contents: [content] });
        let totalGas = 0;
        let totalStorage = 0;
        operationResults.forEach(result => {
            totalStorage +=
                'originated_contracts' in result && typeof result.originated_contracts !== 'undefined'
                    ? result.originated_contracts.length * this.ORIGINATION_STORAGE
                    : 0;
            totalStorage += 'allocated_destination_contract' in result ? this.ALLOCATION_STORAGE : 0;
            totalGas += Number(result.consumed_gas) || 0;
            totalStorage +=
                'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0;
        });

        if (isOpWithFee(content)) {
            return new Estimate(totalGas || 0, Number(totalStorage || 0), size);
        } else {
            return new Estimate(0, 0, size, 0);
        }
    }

    private async createEstimate(params: PrepareOperationParams) {
        const {
            opbytes,
            opOb: { branch, contents },
        } = await this.prepareAndForge(params);

        let operation: RPCRunOperationParam = {
            operation: { branch, contents, signature: SIGNATURE_STUB },
            chain_id: await this.rpc.getChainId(),
        };

        const { opResponse } = await this.simulate(operation);

        const errors = [...flattenErrors(opResponse, 'backtracked'), ...flattenErrors(opResponse)];

        // Fail early in case of errors
        if (errors.length) {
            throw new TezosOperationError(errors);
        }

        while (
            opResponse.contents.length !== (Array.isArray(params.operation) ? params.operation.length : 1)
        ) {
            opResponse.contents.shift();
        }

        return opResponse.contents.map(x => {
            return this.createEstimateFromOperationContent(
                x,
                opbytes.length / 2 / opResponse.contents.length
            );
        });
    }

    async _estimate() {
        const { fee, storageLimit, gasLimit, ...rest } = this._transferParams;

        // ToDo: simplify estimation logic
        const pkh = await this.signer.publicKeyHash();
        const DEFAULT_PARAMS = await this.getAccountLimits(pkh);
        const op = await createTransferOperation({
            ...rest,
            ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
        });
        return (await this.createEstimate({ operation: op, source: pkh }))[0];
    }

    async _send() {
        return 'send'; // TODO
    }
}