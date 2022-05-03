import { OpKind } from './../../taquito-rpc/src/opkind';
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
} from './schema/operation';

type OperationKind =
  | 'activate_account'
  | 'reveal'
  | 'delegation'
  | 'transaction'
  | 'origination'
  | 'ballot'
  | 'endorsement'
  | 'seed_nonce_revelation'
  | 'proposals'
  | 'register_global_constant';

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
