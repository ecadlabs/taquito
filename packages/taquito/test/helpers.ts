import {
  OperationContentsAndResultTransaction,
  OpKind,
  OperationResultStatusEnum,
  OperationContentsAndResultReveal,
  OperationContentsAndResultOrigination,
  OperationContentsAndResultDelegation,
  OperationContentsAndResultRegisterGlobalConstant,
} from '@taquito/rpc';

const defaultTransferData = {
  kind: OpKind.TRANSACTION as OpKind.TRANSACTION,
  source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  fee: '2991',
  counter: '121619',
  gas_limit: '26260',
  storage_limit: '257',
  amount: '0',
  destination: 'KT1AiWmfuCGSttuMBKbDUqZG6SzKQNrySFei',
};

const defaultDelegationData = {
  kind: OpKind.DELEGATION as OpKind.DELEGATION,
  source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  fee: '2991',
  counter: '121619',
  gas_limit: '26260',
  storage_limit: '257',
  delegate: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
};

const defaultRevealData = {
  kind: OpKind.REVEAL as OpKind.REVEAL,
  source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  fee: '2991',
  counter: '121619',
  gas_limit: '26260',
  storage_limit: '257',
  public_key: 'p2pk',
};

const defaultOrigininateData = {
  kind: OpKind.ORIGINATION as OpKind.ORIGINATION,
  source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  fee: '30000',
  counter: '1121110',
  gas_limit: '90000',
  storage_limit: '2000',
  balance: '1000000',
  script: {
    code: [],
    storage: {},
  },
};

const defaultRegisterGlobalConstantData = {
  kind: OpKind.REGISTER_GLOBAL_CONSTANT as OpKind.REGISTER_GLOBAL_CONSTANT,
  source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  fee: '2991',
  counter: '121619',
  gas_limit: '26260',
  storage_limit: '257',
  value: {int: '0'}
};

const defaultResult = {
  status: 'applied' as OperationResultStatusEnum,
  consumed_gas: '15953',
};

export class TransferOperationBuilder {
  private result: OperationContentsAndResultTransaction['metadata']['operation_result'] = defaultResult;
  private data: Omit<OperationContentsAndResultTransaction, 'metadata'>;

  constructor(
    private _data: Partial<Omit<OperationContentsAndResultTransaction, 'metadata'>> = {}
  ) {
    this.data = { ...defaultTransferData, ...this._data };
  }

  withResult(
    result: Partial<OperationContentsAndResultTransaction['metadata']['operation_result']>
  ) {
    this.result = { ...defaultResult, ...result };
    return this;
  }

  build(): OperationContentsAndResultTransaction {
    return {
      ...this.data,
      metadata: {
        balance_updates: [],
        operation_result: this.result,
      },
    };
  }
}

export class DelegationOperationBuilder {
  private result: OperationContentsAndResultDelegation['metadata']['operation_result'] = defaultResult;
  private data: Omit<OperationContentsAndResultDelegation, 'metadata'>;

  constructor(private _data: Partial<Omit<OperationContentsAndResultDelegation, 'metadata'>> = {}) {
    this.data = { ...defaultDelegationData, ...this._data };
  }

  withResult(
    result: Partial<OperationContentsAndResultDelegation['metadata']['operation_result']>
  ) {
    this.result = { ...defaultResult, ...result };
    return this;
  }

  build(): OperationContentsAndResultDelegation {
    return {
      ...this.data,
      metadata: {
        balance_updates: [],
        operation_result: this.result,
      },
    };
  }
}
export class OriginationOperationBuilder {
  private result: OperationContentsAndResultOrigination['metadata']['operation_result'] = defaultResult;
  private data: Omit<OperationContentsAndResultOrigination, 'metadata'>;

  constructor(
    private _data: Partial<Omit<OperationContentsAndResultOrigination, 'metadata'>> = {}
  ) {
    this.data = { ...defaultOrigininateData, ...this._data };
  }

  withResult(
    result: Partial<OperationContentsAndResultOrigination['metadata']['operation_result']>
  ) {
    this.result = { ...defaultResult, ...result };
    return this;
  }

  build(): OperationContentsAndResultOrigination {
    return {
      ...this.data,
      metadata: {
        balance_updates: [],
        operation_result: this.result,
      },
    };
  }
}

export class RevealOperationBuilder {
  private result: OperationContentsAndResultReveal['metadata']['operation_result'] = defaultResult;
  private data: Omit<OperationContentsAndResultReveal, 'metadata'>;

  constructor(private _data: Partial<Omit<OperationContentsAndResultReveal, 'metadata'>> = {}) {
    this.data = { ...defaultRevealData, ...this._data };
  }

  withResult(result: Partial<OperationContentsAndResultReveal['metadata']['operation_result']>) {
    this.result = { ...defaultResult, ...result };
    return this;
  }

  build(): OperationContentsAndResultReveal {
    return {
      ...this.data,
      metadata: {
        balance_updates: [],
        operation_result: this.result,
      },
    };
  }
}

export class RegisterGlobalConstantOperationBuilder {
  private result: OperationContentsAndResultRegisterGlobalConstant['metadata']['operation_result'] = defaultResult;
  private data: Omit<OperationContentsAndResultRegisterGlobalConstant, 'metadata'>;

  constructor(
    private _data: Partial<Omit<OperationContentsAndResultRegisterGlobalConstant, 'metadata'>> = {}
  ) {
    this.data = { ...defaultRegisterGlobalConstantData, ...this._data };
  }

  withResult(
    result: Partial<OperationContentsAndResultRegisterGlobalConstant['metadata']['operation_result']>
  ) {
    this.result = { ...defaultResult, ...result };
    return this;
  }

  build(): OperationContentsAndResultRegisterGlobalConstant {
    return {
      ...this.data,
      metadata: {
        balance_updates: [],
        operation_result: this.result,
      },
    };
  }
}
