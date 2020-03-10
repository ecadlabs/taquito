import { OperationContentsAndResult } from "@taquito/rpc";
import BigNumber from "bignumber.js";
import { flattenOperationResult } from "../operations/operation-errors";

export const receiptFromOperation = (op: OperationContentsAndResult[], {
  ALLOCATION_BURN,
  ORIGINATION_BURN
} = {
    ALLOCATION_BURN: 257,
    ORIGINATION_BURN: 257
  }) => {
  const operationResults = flattenOperationResult({ contents: op });
  let totalGas = new BigNumber(0);
  let totalStorage = new BigNumber(0);
  let totalFee = new BigNumber(0);
  let totalOriginationBurn = new BigNumber(0);
  let totalAllocationBurn = new BigNumber(0);
  let totalPaidStorageDiff = new BigNumber(0);
  operationResults.forEach(result => {
    totalFee = totalFee.plus(result.fee || 0);
    totalOriginationBurn = totalOriginationBurn.plus(Array.isArray(result.originated_contracts)
      ? result.originated_contracts.length * ORIGINATION_BURN
      : 0);
    totalAllocationBurn = totalAllocationBurn.plus('allocated_destination_contract' in result ? ALLOCATION_BURN : 0);
    totalGas = totalGas.plus(result.consumed_gas || 0);
    totalPaidStorageDiff = totalPaidStorageDiff.plus(
      'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0)
  });

  totalStorage = totalStorage.plus(totalAllocationBurn).plus(totalOriginationBurn).plus(totalPaidStorageDiff)

  return {
    totalFee,
    totalGas,
    totalStorage,
    totalAllocationBurn,
    totalOriginationBurn,
    totalPaidStorageDiff,
    totalStorageBurn: new BigNumber(totalStorage.multipliedBy(1000))
  }
}
