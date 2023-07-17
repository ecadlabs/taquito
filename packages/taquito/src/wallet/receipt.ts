import { OperationContentsAndResult } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { COST_PER_BYTE } from '../constants';
import { flattenOperationResult } from '../operations/errors';

export interface Receipt {
  totalFee: BigNumber;
  totalGas: BigNumber;
  totalMilliGas: BigNumber;
  totalStorage: BigNumber;
  totalAllocationBurn: BigNumber;
  totalOriginationBurn: BigNumber;
  totalPaidStorageDiff: BigNumber;
  totalStorageBurn: BigNumber;
}

export const receiptFromOperation = (
  op: OperationContentsAndResult[],
  { ALLOCATION_BURN, ORIGINATION_BURN } = {
    ALLOCATION_BURN: 257,
    ORIGINATION_BURN: 257,
  }
): Receipt => {
  BigNumber.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_UP });
  const operationResults = flattenOperationResult({ contents: op });
  let totalMilliGas = new BigNumber(0);
  let totalStorage = new BigNumber(0);
  let totalFee = new BigNumber(0);
  let totalOriginationBurn = new BigNumber(0);
  let totalAllocationBurn = new BigNumber(0);
  let totalPaidStorageDiff = new BigNumber(0);
  operationResults.forEach((result) => {
    totalFee = totalFee.plus(result.fee || 0);
    totalOriginationBurn = totalOriginationBurn.plus(
      Array.isArray(result.originated_contracts)
        ? result.originated_contracts.length * ORIGINATION_BURN
        : 0
    );
    totalAllocationBurn = totalAllocationBurn.plus(
      'allocated_destination_contract' in result ? ALLOCATION_BURN : 0
    );
    totalMilliGas = totalMilliGas.plus(result.consumed_milligas || 0);
    totalPaidStorageDiff = totalPaidStorageDiff.plus(
      'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0
    );
  });

  totalStorage = totalStorage
    .plus(totalAllocationBurn)
    .plus(totalOriginationBurn)
    .plus(totalPaidStorageDiff);

  return {
    totalFee,
    totalMilliGas,
    totalGas: totalMilliGas.dividedBy(1000),
    totalStorage,
    totalAllocationBurn,
    totalOriginationBurn,
    totalPaidStorageDiff,
    totalStorageBurn: new BigNumber(totalStorage.multipliedBy(COST_PER_BYTE)),
  };
};
