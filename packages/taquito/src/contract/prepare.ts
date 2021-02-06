import { Schema } from '@taquito/michelson-encoder';
import { OpKind, MichelsonV1Expression } from '@taquito/rpc';
import { Parser, Prim, Expr } from '@taquito/michel-codec';
import {
  OriginateParams,
  RPCOriginationOperation,
  TransferParams,
  RPCTransferOperation,
  DelegateParams,
  RPCDelegateOperation,
  RegisterDelegateParams,
} from '../operations/types';
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT } from '../constants';
import { format } from '../format';
import { Protocols } from '../constants'

export const createOriginationOperation = async ({
  code,
  init,
  balance = "0",
  delegate,
  storage,
  fee = DEFAULT_FEE.ORIGINATION,
  gasLimit = DEFAULT_GAS_LIMIT.ORIGINATION,
  storageLimit = DEFAULT_STORAGE_LIMIT.ORIGINATION,
  mutez = false
}: OriginateParams, protocol?: Protocols) => {
  // tslint:disable-next-line: strict-type-predicates
  if (storage !== undefined && init !== undefined) {
    throw new Error(
      "Storage and Init cannot be set a the same time. Please either use storage or init but not both.",
    );
  }

  const parser = new Parser({ protocol });

  let contractCode: Expr[];
  if (typeof code === 'string') {
    const c = parser.parseScript(code);
    if (c === null) {
      throw new Error('Empty Michelson source');
    }
    contractCode = c;
  } else {
    const c = parser.parseJSON(code);
    if (!Array.isArray(c)) {
      throw new Error('JSON encoded Michelson script must be an array');
    }
    const order = ['parameter', 'storage', 'code'];
    // Ensure correct ordering for RPC
    contractCode = (c as Prim[]).sort((a, b) => order.indexOf(a.prim) - order.indexOf(b.prim));
  }

  let contractStorage: Expr | undefined;
  if (storage !== undefined) {
    const storageType = contractCode.find((p): p is Prim => ('prim' in p) && p.prim === 'storage');
    if (storageType?.args === undefined) {
      throw new Error('Missing storage section');
    }
    const schema = new Schema(storageType.args[0] as MichelsonV1Expression); // TODO
    contractStorage = schema.Encode(storage);
  } else if (typeof init === 'string') {
    const c = parser.parseMichelineExpression(init);
    if (c === null) {
      throw new Error('Empty initial storage value');
    }
    contractStorage = c;
  } else if (typeof init === 'object') {
    contractStorage = parser.parseJSON(init);
  }

  const script = {
    code: contractCode,
    storage: contractStorage,
  };

  const operation: RPCOriginationOperation = {
    kind: OpKind.ORIGINATION,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    balance: mutez
      ? balance.toString()
      : format('tz', 'mutez', balance).toString(),
    script,
  };

  if (delegate) {
    operation.delegate = delegate;
  }
  return operation;
};

export const createTransferOperation = async ({
  to,
  amount,
  parameter,
  fee = DEFAULT_FEE.TRANSFER,
  gasLimit = DEFAULT_GAS_LIMIT.TRANSFER,
  storageLimit = DEFAULT_STORAGE_LIMIT.TRANSFER,
  mutez = false,
}: TransferParams) => {
  const operation: RPCTransferOperation = {
    kind: OpKind.TRANSACTION,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    amount: mutez
      ? amount.toString()
      : format("tz", "mutez", amount).toString(),
    destination: to,
    parameters: parameter,
  };
  return operation;
};

export const createSetDelegateOperation = async ({
  delegate,
  source,
  fee = DEFAULT_FEE.DELEGATION,
  gasLimit = DEFAULT_GAS_LIMIT.DELEGATION,
  storageLimit = DEFAULT_STORAGE_LIMIT.DELEGATION,
}: DelegateParams) => {
  const operation: RPCDelegateOperation = {
    kind: OpKind.DELEGATION,
    source,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    delegate,
  };
  return operation;
};

export const createRegisterDelegateOperation = async (
  {
    fee = DEFAULT_FEE.DELEGATION,
    gasLimit = DEFAULT_GAS_LIMIT.DELEGATION,
    storageLimit = DEFAULT_STORAGE_LIMIT.DELEGATION,
  }: RegisterDelegateParams,
  source: string,
) => {
  return {
    kind: OpKind.DELEGATION,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    delegate: source,
  } as RPCDelegateOperation;
};
