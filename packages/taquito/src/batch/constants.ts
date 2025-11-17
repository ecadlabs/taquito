import { OpKind } from '@taquito/rpc';

export const BATCH_KINDS = [
  OpKind.ACTIVATION,
  OpKind.ORIGINATION,
  OpKind.TRANSACTION,
  OpKind.DELEGATION,
];

export type BatchKinds =
  | OpKind.ACTIVATION
  | OpKind.ORIGINATION
  | OpKind.TRANSACTION
  | OpKind.DELEGATION;

