import { OpKind } from '@taquito/rpc';
import { OperationContents } from '@taquito/rpc';
import {
  ActivationSchema,
  DelegationSchema,
  TransactionSchema,
  OriginationSchema,
  BallotSchema,
  SeedNonceRevelationSchema,
  ProposalsSchema,
  RevealSchema,
  RegisterGlobalConstantSchema,
  EndorsementSchema,
  TransferTicketSchema,
  TxRollupOriginationSchema,
  TxRollupSubmitBatchSchema,
  IncreasePaidStorageSchema,
  UpdateConsensusKeySchema,
  DrainDelegateSchema,
} from './schema/operation';

type OperationKind =
  | OpKind.ACTIVATION
  | OpKind.REVEAL
  | OpKind.DELEGATION
  | OpKind.TRANSACTION
  | OpKind.ORIGINATION
  | OpKind.BALLOT
  | OpKind.ENDORSEMENT
  | OpKind.SEED_NONCE_REVELATION
  | OpKind.PROPOSALS
  | OpKind.REGISTER_GLOBAL_CONSTANT
  | OpKind.TRANSFER_TICKET
  | OpKind.TX_ROLLUP_ORIGINATION
  | OpKind.TX_ROLLUP_SUBMIT_BATCH
  | OpKind.INCREASE_PAID_STORAGE
  | OpKind.UPDATE_CONSENSUS_KEY
  | OpKind.DRAIN_DELEGATE;

const OperationKindMapping = {
  activate_account: ActivationSchema,
  reveal: RevealSchema,
  delegation: DelegationSchema,
  transaction: TransactionSchema,
  origination: OriginationSchema,
  ballot: BallotSchema,
  endorsement: EndorsementSchema,
  seed_nonce_revelation: SeedNonceRevelationSchema,
  proposals: ProposalsSchema,
  register_global_constant: RegisterGlobalConstantSchema,
  transfer_ticket: TransferTicketSchema,
  tx_rollup_origination: TxRollupOriginationSchema,
  tx_rollup_submit_batch: TxRollupSubmitBatchSchema,
  increase_paid_storage: IncreasePaidStorageSchema,
  update_consensus_key: UpdateConsensusKeySchema,
  drain_delegate: DrainDelegateSchema,
};

// Asymmetric difference: only account for things in arr2 that are not present in arr1, not vice versa
const getArrayDifference = (arr1: string[], arr2: string[]) => {
  return arr2.filter((x) => !arr1.includes(x));
};

const deleteArrayElementByValue = (array: string[], item: string) => {
  return array.filter((e) => e !== item);
};

/**
 * @returns A boolean value to indicate whether the operation kind is valid or not
 */
export const validateOperationKind = (opKind: OpKind) => {
  const opKindList = Object.keys(OperationKindMapping);
  return opKindList.includes(opKind);
};

/**
 *  returns 0 when the two array of properties are identical or the passed property
 *  does not have any missing parameters from the corresponding schema
 *
 *  @returns array element differences if there are missing required property keys
 */
export const validateMissingProperty = (operationContent: OperationContents) => {
  const kind = operationContent.kind as OperationKind;

  const keys = Object.keys(operationContent);
  const cleanKeys = deleteArrayElementByValue(keys, 'kind');

  const schemaKeys = Object.keys(OperationKindMapping[kind]);

  return getArrayDifference(cleanKeys, schemaKeys);
};
