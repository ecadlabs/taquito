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
import { ml2mic, sexp2mic } from '@taquito/utils';
import { Schema } from '@taquito/michelson-encoder';
import { format } from '../format';
import { OpKind } from '@taquito/rpc';

export const createOriginationOperation = async ({
  code,
  init,
  balance = '0',
  delegate,
  storage,
  fee = DEFAULT_FEE.ORIGINATION,
  gasLimit = DEFAULT_GAS_LIMIT.ORIGINATION,
  storageLimit = DEFAULT_STORAGE_LIMIT.ORIGINATION,
}: OriginateParams) => {
  // tslint:disable-next-line: strict-type-predicates
  if (storage !== undefined && init !== undefined) {
    throw new Error(
      'Storage and Init cannot be set a the same time. Please either use storage or init but not both.'
    );
  }

  const contractCode = Array.isArray(code) ? code : ml2mic(code);

  let contractStorage: object;
  if (storage !== undefined) {
    const schema = new Schema(contractCode[1].args[0]);
    contractStorage = schema.Encode(storage);
  } else {
    contractStorage = typeof init === 'string' ? sexp2mic(init) : init;
  }

  const order = ['parameter', 'storage', 'code'];
  const script = {
    code: Array.isArray(code)
      ? code.sort((a: any, b: any) => order.indexOf(a.prim) - order.indexOf(b.prim)) // Ensure correct ordering for RPC
      : ml2mic(code),
    storage: contractStorage,
  };

  const operation: RPCOriginationOperation = {
    kind: OpKind.ORIGINATION,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    balance: format('tz', 'mutez', balance).toString(),
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
    amount: mutez ? amount.toString() : format('tz', 'mutez', amount).toString(),
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
  source: string
) => {
  return {
    kind: OpKind.DELEGATION,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    delegate: source,
  } as RPCDelegateOperation;
};
