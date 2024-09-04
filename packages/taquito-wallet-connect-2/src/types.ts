import {
  RPCDelegateOperation,
  RPCRegisterGlobalConstantOperation,
  RPCOriginationOperation,
  RPCRevealOperation,
  RPCTransferOperation,
  RPCTransferTicketOperation,
  RPCIncreasePaidStorageOperation,
  RPCBallotOperation,
  RPCUpdateConsensusKeyOperation,
  RPCDrainDelegateOperation,
  RPCProposalsOperation,
  RPCSmartRollupAddMessagesOperation,
  RPCSmartRollupOriginateOperation,
  RPCSmartRollupOutboxMessageOperation,
  RPCFailingNoopOperation,
} from '@taquito/taquito';

export enum NetworkType {
  MAINNET = 'mainnet',
  GHOSTNET = 'ghostnet',
  WEEKLYNET = 'weeklynet',
  OXFORDNET = 'oxfordnet',
  PARISNET = 'parisnet',
  // QUEBECNET = 'quebecnet',
}

export interface PermissionScopeParam {
  networks: NetworkType[];
  methods: PermissionScopeMethods[];
  events?: PermissionScopeEvents[];
}
export enum PermissionScopeMethods {
  OPERATION_REQUEST = 'tezos_sendOperations',
  SIGN = 'tezos_signExpression',
}

export enum PermissionScopeEvents {
  CHAIN_CHANGED = 'chainChanged',
  ACCOUNTS_CHANGED = 'accountsChanged',
}

export enum SigningType {
  RAW = 'raw',
  OPERATION = 'operation',
  MICHELINE = 'micheline',
}

type WalletDefinedFields = 'source' | 'gas_limit' | 'storage_limit' | 'fee';
interface WalletOptionalFields {
  gas_limit?: string;
  storage_limit?: string;
  fee?: string;
}

export interface TransferParams
  extends Omit<RPCTransferOperation, WalletDefinedFields>,
    WalletOptionalFields {}
export interface OriginateParams
  extends Omit<RPCOriginationOperation, WalletDefinedFields>,
    WalletOptionalFields {}
export interface RevealParams
  extends Omit<RPCRevealOperation, WalletDefinedFields>,
    WalletOptionalFields {}
export interface DelegateParams
  extends Omit<RPCDelegateOperation, WalletDefinedFields>,
    WalletOptionalFields {}
export interface RegisterGlobalConstantParams
  extends Omit<RPCRegisterGlobalConstantOperation, WalletDefinedFields>,
    WalletOptionalFields {}
export interface TransferTicketParams
  extends Omit<RPCTransferTicketOperation, WalletDefinedFields>,
    WalletOptionalFields {}
export interface IncreasePaidStorageParams
  extends Omit<RPCIncreasePaidStorageOperation, WalletDefinedFields>,
    WalletOptionalFields {}
export interface UpdateConsensusKeyParams
  extends Omit<RPCUpdateConsensusKeyOperation, WalletDefinedFields>,
    WalletOptionalFields {}
export type BallotParams = Omit<RPCBallotOperation, WalletDefinedFields>;
export type DrainDelegateParams = Omit<RPCDrainDelegateOperation, WalletDefinedFields>;
export type ProposalsParams = Omit<RPCProposalsOperation, WalletDefinedFields>;
export type SmartRollupAddMessagesParams = Omit<
  RPCSmartRollupAddMessagesOperation,
  WalletDefinedFields
>;
export type SmartRollupOriginateParams = Omit<
  RPCSmartRollupOriginateOperation,
  WalletDefinedFields
>;
export type SmartRollupExecuteOutboxMessageParams = Omit<
  RPCSmartRollupOutboxMessageOperation,
  WalletDefinedFields
>;
export type FailingNoopParams = Omit<RPCFailingNoopOperation, WalletDefinedFields>;

export type OperationParams =
  | TransferParams
  | BallotParams
  | IncreasePaidStorageParams
  | UpdateConsensusKeyParams
  | OriginateParams
  | RevealParams
  | DelegateParams
  | RegisterGlobalConstantParams
  | DrainDelegateParams
  | ProposalsParams
  | SmartRollupAddMessagesParams
  | SmartRollupOriginateParams
  | SmartRollupExecuteOutboxMessageParams
  | FailingNoopParams
  | TransferTicketParams;
