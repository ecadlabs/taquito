export interface RpcTransaction {
  protocol: string;
  chain_id: string;
  hash: string;
  branch: string;
  contents: Content[];
  signature: string;
}

interface Content {
  kind: string;
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  amount: string;
  destination: string;
  parameters: Params;
  metadata: Metadata;
}

interface Metadata {
  balance_updates: Balanceupdate[];
  operation_result: Operationresult;
}

interface Operationresult {
  status: string;
  storage: Storage;
  big_map_diff: Bigmapdiff[];
  consumed_gas: string;
  storage_size: string;
  paid_storage_size_diff: string;
  consumed_milligas?: string;
}

interface Bigmapdiff {
  key_hash: string;
  key: Key;
  value: Value;
}

interface Value {
  prim: string;
  args: any[];
}

interface Key {
  bytes: string;
}

interface Storage {
  prim: string;
  args: any[];
}

interface Balanceupdate {
  kind: string;
  contract?: string;
  change: string;
  category?: string;
  delegate?: string;
  level?: number;
}

interface Params {
  prim: string;
  args: any[];
}
