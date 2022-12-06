export enum NetworkType {
  MAINNET = 'mainnet',
  GHOSTNET = 'ghostnet',
  MONDAYNET = 'mondaynet',
  DAILYNET = 'dailynet',
  KATHMANDUNET = 'kathmandunet',
  LIMANET = 'limanet',
  CUSTOM = 'custom',
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
