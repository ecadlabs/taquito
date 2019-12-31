export type TimeStampMixed = Date | string;

export type BalanceUpdateKindEnum = 'contract' | 'freezer';
export type BalanceUpdateCategoryEnum = 'rewards' | 'fees' | 'deposits';

export interface MichelsonV1ExpressionBase {
  int?: string;
  string?: string;
  bytes?: string;
}

export interface MichelsonV1ExpressionExtended {
  prim: string;
  args?: MichelsonV1Expression[];
  annots?: string[];
}

export type MichelsonV1Expression = MichelsonV1ExpressionBase | MichelsonV1ExpressionExtended;

export interface ScriptedContracts {
  code: MichelsonV1Expression[];
  storage: MichelsonV1Expression;
}

// BlockResponse interface
// metadata: {
//   balanceUpdates:
// }
export interface OperationBalanceUpdatesItem {
  kind: BalanceUpdateKindEnum;
  category?: BalanceUpdateCategoryEnum;
  delegate?: string;
  cycle?: number;
  contract?: string;
  change: string;
}

export type OperationBalanceUpdates = OperationBalanceUpdatesItem[];

export interface ConstructedOperation {
  kind: string;
  level: number;
  nonce: string;
  pkh: string;
  hash: string;
  secret: string;
  source: string;
  period: number;
  proposal: string;
  ballot: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  parameters: string;
  balance: string;
  delegate: string;
  amount: string;
  destination: string;
  public_key: string;
  script: { code: string; storage: string };
}

export interface OperationObject {
  branch?: string;
  contents?: ConstructedOperation[];
  protocol?: string;
  signature?: string;
}

export type InternalOperationResultKindEnum =
  | 'reveal'
  | 'transaction'
  | 'origination'
  | 'delegation';

export type InternalOperationResultEnum =
  | OperationResultReveal
  | OperationResultTransaction
  | OperationResultDelegation
  | OperationResultOrigination;

export interface OperationResultDelegation {
  status: OperationResultStatusEnum;
  consumed_gas?: string;
  errors?: any;
}

export interface ContractBigMapDiffItem {
  key_hash: string;
  key: MichelsonV1Expression;
  value?: MichelsonV1Expression;
}

export type ContractBigMapDiff = ContractBigMapDiffItem[];

export interface OperationResultTransaction {
  status: OperationResultStatusEnum;
  storage?: MichelsonV1Expression;
  big_map_diff?: ContractBigMapDiff;
  balance_updates?: OperationBalanceUpdates;
  originated_contracts?: string[];
  consumed_gas?: string;
  storage_size?: string;
  paid_storage_size_diff?: string;
  allocated_destination_contract?: boolean;
  errors?: any;
}

export interface OperationResultReveal {
  status: OperationResultStatusEnum;
  consumed_gas?: string;
  errors?: any;
}

export interface InternalOperationResult {
  kind: InternalOperationResultKindEnum;
  source: string;
  nonce: number;
  amount?: string;
  destination?: string;
  parameters?: MichelsonV1Expression;
  public_key?: string;
  balance?: string;
  delegate?: string;
  script?: ScriptedContracts;
  result: InternalOperationResultEnum;
}

export type MetadataBalanceUpdatesKindEnum = 'contract' | 'freezer';
export type MetadataBalanceUpdatesCategoryEnum = 'rewards' | 'fees' | 'deposits';

export interface OperationMetadataBalanceUpdates {
  kind: MetadataBalanceUpdatesKindEnum;
  category?: MetadataBalanceUpdatesCategoryEnum;
  contract?: string;
  delegate?: string;
  cycle?: number;
  change: string;
}

export type OperationResultStatusEnum = 'applied' | 'failed' | 'skipped' | 'backtracked';

export interface OperationResultOrigination {
  status: OperationResultStatusEnum;
  balance_updates?: OperationBalanceUpdates;
  originated_contracts?: string[];
  consumed_gas?: string;
  storage_size?: string;
  paid_storage_size_diff?: string;
  errors?: any;
}

export interface OperationContentsAndResultMetadataOrigination {
  balance_updates: OperationMetadataBalanceUpdates[];
  operation_result: OperationResultOrigination;
  internal_operation_results?: InternalOperationResult[];
}
