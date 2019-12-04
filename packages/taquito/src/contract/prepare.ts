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

export const createOriginationOperation = async (
  {
    code,
    init,
    balance = '0',
    spendable = false,
    delegatable = false,
    delegate,
    storage,
    fee = DEFAULT_FEE.ORIGINATION,
    gasLimit = DEFAULT_GAS_LIMIT.ORIGINATION,
    storageLimit = DEFAULT_STORAGE_LIMIT.ORIGINATION,
  }: OriginateParams,
  publicKeyHash: string
) => {
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

  const script = {
    code: Array.isArray(code) ? code : ml2mic(code),
    storage: contractStorage,
  };

  const operation: RPCOriginationOperation = {
    kind: 'origination',
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    balance: format('tz', 'mutez', balance).toString(),
    manager_pubkey: publicKeyHash,
    spendable,
    delegatable,
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
  rawParam = false,
}: TransferParams) => {
  const operation: RPCTransferOperation = {
    kind: 'transaction',
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    amount: mutez ? amount.toString() : format('tz', 'mutez', amount).toString(),
    destination: to,
  };

  if (parameter) {
    operation.parameters = rawParam
      ? parameter
      : typeof parameter === 'string'
      ? sexp2mic(parameter)
      : parameter;
  }
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
    kind: 'delegation',
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
    kind: 'delegation',
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    delegate: source,
  } as RPCDelegateOperation;
};
