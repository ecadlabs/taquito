import { OpKind } from '@taquito/rpc';
import {
  OriginateParams,
  RPCOriginationOperation,
  TransferParams,
  RPCTransferOperation,
  DelegateParams,
  RPCDelegateOperation,
  RegisterDelegateParams,
  RPCRevealOperation,
  RevealParams,
  RegisterGlobalConstantParams,
  RPCRegisterGlobalConstantOperation
} from '../operations/types';
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT } from '../constants';
import { format } from '../format';

export const createOriginationOperation = async ({
  code,
  balance = "0",
  delegate,
  storage,
  fee = DEFAULT_FEE.ORIGINATION,
  gasLimit = DEFAULT_GAS_LIMIT.ORIGINATION,
  storageLimit = DEFAULT_STORAGE_LIMIT.ORIGINATION,
  mutez = false
}: OriginateParams) => {

  const operation: RPCOriginationOperation = {
    kind: OpKind.ORIGINATION,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    balance: mutez
      ? balance.toString()
      : format('tz', 'mutez', balance).toString(),
    script: {
      code,
      storage
    },
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

export const createRevealOperation = async (
  {
    fee = DEFAULT_FEE.REVEAL,
    gasLimit = DEFAULT_GAS_LIMIT.REVEAL,
    storageLimit = DEFAULT_STORAGE_LIMIT.REVEAL,
  }: RevealParams,
  source: string,
  publicKey: string,
) => {
  return {
    kind: OpKind.REVEAL,
    fee,
    public_key: publicKey,
    source,
    gas_limit: gasLimit,
    storage_limit: storageLimit
  } as RPCRevealOperation;
};

export const createRegisterGlobalConstantOperation = async ({
  value,
  source,
  fee,
  gasLimit,
  storageLimit,
}: RegisterGlobalConstantParams
) => {
  return {
    kind: OpKind.REGISTER_GLOBAL_CONSTANT,
    value,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    source
  } as RPCRegisterGlobalConstantOperation;
};