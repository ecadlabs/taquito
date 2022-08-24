import {
  OperationContentsAndResultTransaction,
  OpKind,
  OperationResultStatusEnum,
  OperationContentsAndResultReveal,
  OperationContentsAndResultOrigination,
  OperationContentsAndResultDelegation,
  OperationContentsAndResultRegisterGlobalConstant,
  OperationContentsAndResultTxRollupOrigination,
  OperationContentsAndResultTxRollupSubmitBatch,
  OperationContentsAndResultTransferTicket,
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
  value: { int: '0' },
};

const defaultTxRollupOriginateData = {
  kind: OpKind.TX_ROLLUP_ORIGINATION as OpKind.TX_ROLLUP_ORIGINATION,
  source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  fee: '2991',
  counter: '121619',
  gas_limit: '26260',
  storage_limit: '257',
  tx_rollup_origination: {},
};

const defaultTxSubmitBatchData = {
  kind: OpKind.TX_ROLLUP_SUBMIT_BATCH as OpKind.TX_ROLLUP_SUBMIT_BATCH,
  source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  fee: '2991',
  counter: '121619',
  gas_limit: '26260',
  storage_limit: '257',
  rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
  content: '626c6f62',
};

const defaultTransferTicketData = {
  kind: OpKind.TRANSFER_TICKET as OpKind.TRANSFER_TICKET,
  source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
  fee: '804',
  gas_limit: '5009',
  storage_limit: '130',
  counter: '145',
  ticket_contents: { string: 'foobar' },
  ticket_ty: { prim: 'string' },
  ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
  ticket_amount: '2',
  destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
  entrypoint: 'default',
};

const defaultResult = {
  status: 'applied' as OperationResultStatusEnum,
  consumed_milligas: '15952999',
};

export class TransferOperationBuilder {
  private result: OperationContentsAndResultTransaction['metadata']['operation_result'] =
    defaultResult;
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
  private result: OperationContentsAndResultDelegation['metadata']['operation_result'] =
    defaultResult;
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
  private result: OperationContentsAndResultOrigination['metadata']['operation_result'] =
    defaultResult;
  private data: Omit<OperationContentsAndResultOrigination, 'metadata'>;

  constructor(
    private _data: Partial<Omit<OperationContentsAndResultOrigination, 'metadata'>> = {}
  ) {
    this.data = { ...defaultOrigininateData, ...this._data };
  }

  withResult(
    result: Partial<OperationContentsAndResultOrigination['metadata']['operation_result']>
  ) {
    this.result = {
      ...defaultResult,
      ...result,
      originated_contracts: ['KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX'],
      storage_size: '62',
    };
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
  private result: OperationContentsAndResultRegisterGlobalConstant['metadata']['operation_result'] =
    defaultResult;
  private data: Omit<OperationContentsAndResultRegisterGlobalConstant, 'metadata'>;

  constructor(
    private _data: Partial<Omit<OperationContentsAndResultRegisterGlobalConstant, 'metadata'>> = {}
  ) {
    this.data = { ...defaultRegisterGlobalConstantData, ...this._data };
  }

  withResult(
    result: Partial<
      OperationContentsAndResultRegisterGlobalConstant['metadata']['operation_result']
    >
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

export class TxRollupOriginationOperationBuilder {
  private result: OperationContentsAndResultTxRollupOrigination['metadata']['operation_result'] =
    defaultResult;
  private data: Omit<OperationContentsAndResultTxRollupOrigination, 'metadata'>;

  constructor(
    private _data: Partial<Omit<OperationContentsAndResultTxRollupOrigination, 'metadata'>> = {}
  ) {
    this.data = { ...defaultTxRollupOriginateData, ...this._data };
  }

  withResult(
    result: Partial<OperationContentsAndResultTxRollupOrigination['metadata']['operation_result']>
  ) {
    this.result = { ...defaultResult, ...result };
    return this;
  }

  build(): OperationContentsAndResultTxRollupOrigination {
    return {
      ...this.data,
      metadata: {
        balance_updates: [],
        operation_result: this.result,
      },
    };
  }
}

export class TxRollupSubmitBatchOperationBuilder {
  private result: OperationContentsAndResultTxRollupSubmitBatch['metadata']['operation_result'] =
    defaultResult;
  private data: Omit<OperationContentsAndResultTxRollupSubmitBatch, 'metadata'>;

  constructor(
    private _data: Partial<Omit<OperationContentsAndResultTxRollupSubmitBatch, 'metadata'>> = {}
  ) {
    this.data = { ...defaultTxSubmitBatchData, ...this._data };
  }

  withResult(
    result: Partial<OperationContentsAndResultTxRollupSubmitBatch['metadata']['operation_result']>
  ) {
    this.result = { ...defaultResult, ...result };
    return this;
  }

  build(): OperationContentsAndResultTxRollupSubmitBatch {
    return {
      ...this.data,
      metadata: {
        balance_updates: [],
        operation_result: this.result,
      },
    };
  }
}

export class TransferTicketOperationBuilder {
  private result: OperationContentsAndResultTransferTicket['metadata']['operation_result'] =
    defaultResult;
  private data: Omit<OperationContentsAndResultTransferTicket, 'metadata'>;

  constructor(
    private _data: Partial<Omit<OperationContentsAndResultTransferTicket, 'metadata'>> = {}
  ) {
    this.data = { ...defaultTransferTicketData, ...this._data };
  }

  withResult(
    result: Partial<OperationContentsAndResultTransferTicket['metadata']['operation_result']>
  ) {
    this.result = { ...defaultResult, ...result };
    return this;
  }

  build(): OperationContentsAndResultTransferTicket {
    return {
      ...this.data,
      metadata: {
        balance_updates: [],
        operation_result: this.result,
      },
    };
  }
}
