/**
 * Protocol constants referenced in documentation.
 * Source of truth: mainnet RPC /chains/main/blocks/head/context/constants
 *
 * NOTE: When updating constants here, also check:
 *   packages/taquito/src/constants.ts (runtime constants for estimation logic)
 *
 * When a protocol changes a value, update 'next' and any new version entry.
 * Historical versions stay frozen as-published.
 */
export const TEZOS_CONSTANTS = {
  '21.0.0': {
    minimalStake: '8,000',
    costPerByte: '250',
    hardGasLimitPerOperation: '1,040,000',
    hardGasLimitPerBlock: '1,040,000',
    hardStorageLimitPerOperation: '60,000',
    blocksPerCycle: '8,192',
    minimalBlockDelay: '15',
    smartRollupStakeAmount: '10,000',
  },
  '22.0.0': {
    minimalStake: '8,000',
    costPerByte: '250',
    hardGasLimitPerOperation: '1,040,000',
    hardGasLimitPerBlock: '1,040,000',
    hardStorageLimitPerOperation: '60,000',
    blocksPerCycle: '8,192',
    minimalBlockDelay: '15',
    smartRollupStakeAmount: '10,000',
  },
  '23.0.0': {
    minimalStake: '8,000',
    costPerByte: '250',
    hardGasLimitPerOperation: '1,040,000',
    hardGasLimitPerBlock: '1,040,000',
    hardStorageLimitPerOperation: '60,000',
    blocksPerCycle: '14,400',
    minimalBlockDelay: '6',
    smartRollupStakeAmount: '10,000',
  },
  '23.1.0': {
    minimalStake: '8,000',
    costPerByte: '250',
    hardGasLimitPerOperation: '1,040,000',
    hardGasLimitPerBlock: '1,040,000',
    hardStorageLimitPerOperation: '60,000',
    blocksPerCycle: '14,400',
    minimalBlockDelay: '6',
    smartRollupStakeAmount: '10,000',
  },
  '24.0.0': {
    minimalStake: '8,000',
    costPerByte: '250',
    hardGasLimitPerOperation: '1,040,000',
    hardGasLimitPerBlock: '1,040,000',
    hardStorageLimitPerOperation: '60,000',
    blocksPerCycle: '14,400',
    minimalBlockDelay: '6',
    smartRollupStakeAmount: '10,000',
  },
  'next': {
    minimalStake: '6,000',
    costPerByte: '250',
    hardGasLimitPerOperation: '1,040,000',
    hardGasLimitPerBlock: '1,040,000',
    hardStorageLimitPerOperation: '60,000',
    blocksPerCycle: '14,400',
    minimalBlockDelay: '6',
    smartRollupStakeAmount: '10,000',
  },
};
