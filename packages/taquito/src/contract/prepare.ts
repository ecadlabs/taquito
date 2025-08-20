import { Schema } from '@taquito/michelson-encoder';
import { OpKind, MichelsonV1Expression } from '@taquito/rpc';
import { Prim, Expr } from '@taquito/michel-codec';
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
  RPCRegisterGlobalConstantOperation,
  TransferTicketParams,
  RPCTransferTicketOperation,
  IncreasePaidStorageParams,
  RPCIncreasePaidStorageOperation,
  DrainDelegateParams,
  RPCDrainDelegateOperation,
  BallotParams,
  RPCBallotOperation,
  ProposalsParams,
  RPCProposalsOperation,
  UpdateConsensusKeyParams,
  RPCUpdateConsensusKeyOperation,
  SmartRollupAddMessagesParams,
  RPCSmartRollupAddMessagesOperation,
  SmartRollupOriginateParams,
  RPCSmartRollupOriginateOperation,
  SmartRollupExecuteOutboxMessageParams,
  RPCSmartRollupOutboxMessageOperation,
  ActivationParams,
  RPCActivateOperation,
} from '../operations/types';
import { getRevealGasLimit } from '../constants';
import { format } from '@taquito/utils';
import {
  InvalidCodeParameter,
  InvalidInitParameter,
  OriginationParameterError,
  InvalidBalanceError,
} from './errors';

export const createActivationOperation = async ({ pkh, secret }: ActivationParams) => {
  return {
    kind: OpKind.ACTIVATION,
    pkh,
    secret,
  } as RPCActivateOperation;
};

export const createOriginationOperation = async ({
  code,
  init,
  balance = '0',
  delegate,
  storage,
  fee,
  gasLimit,
  storageLimit,
  mutez = false,
}: OriginateParams) => {
  if (storage !== undefined && init !== undefined) {
    throw new OriginationParameterError(
      'Storage and Init cannot be set a the same time. Please either use storage or init but not both.'
    );
  }

  if (!Array.isArray(code)) {
    throw new InvalidCodeParameter('Wrong code parameter type, expected an array', code);
  }

  let contractStorage: Expr | undefined;
  if (storage !== undefined) {
    const storageType = (code as Expr[]).find(
      (p): p is Prim => 'prim' in p && p.prim === 'storage'
    );
    if (storageType?.args === undefined) {
      throw new InvalidCodeParameter('The storage section is missing from the script', code);
    }
    const schema = new Schema(storageType.args[0] as MichelsonV1Expression); // TODO
    contractStorage = schema.Encode(storage);
  } else if (init !== undefined && typeof init === 'object') {
    contractStorage = init as Expr;
  } else {
    throw new InvalidInitParameter('Wrong init parameter type, expected JSON Michelson', init);
  }

  const script = {
    code,
    storage: contractStorage,
  };

  if (isNaN(Number(balance))) {
    throw new InvalidBalanceError(`Invalid Balance "${balance}", cannot be converted to a number`);
  }

  const operation = {
    kind: OpKind.ORIGINATION,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    balance: mutez ? balance.toString() : format('tz', 'mutez', balance).toString(),
    script,
  } as RPCOriginationOperation;

  if (delegate) {
    operation.delegate = delegate;
  }
  return operation;
};

export const createTransferOperation = async ({
  to,
  amount,
  parameter,
  fee,
  gasLimit,
  storageLimit,
  mutez = false,
}: TransferParams) => {
  return {
    kind: OpKind.TRANSACTION,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    amount: mutez ? amount.toString() : format('tz', 'mutez', amount).toString(),
    destination: to,
    parameters: parameter,
  } as RPCTransferOperation;
};

export const createSetDelegateOperation = async ({
  delegate,
  source,
  fee,
  gasLimit,
  storageLimit,
}: DelegateParams) => {
  const operation = {
    kind: OpKind.DELEGATION,
    source,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    delegate,
  } as RPCDelegateOperation;
  return operation;
};

export const createRegisterDelegateOperation = async (
  { fee, gasLimit, storageLimit }: RegisterDelegateParams,
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

export const createRevealOperation = async (
  { fee, gasLimit, storageLimit, proof }: RevealParams,
  source: string,
  publicKey: string
) => {
  return {
    kind: OpKind.REVEAL,
    fee,
    public_key: publicKey,
    source,
    gas_limit: gasLimit ?? getRevealGasLimit(source),
    storage_limit: storageLimit,
    proof,
  } as RPCRevealOperation;
};

export const createRegisterGlobalConstantOperation = async ({
  value,
  source,
  fee,
  gasLimit,
  storageLimit,
}: RegisterGlobalConstantParams) => {
  return {
    kind: OpKind.REGISTER_GLOBAL_CONSTANT,
    value,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    source,
  } as RPCRegisterGlobalConstantOperation;
};

export const createTransferTicketOperation = async ({
  ticketContents,
  ticketTy,
  ticketTicketer,
  ticketAmount,
  destination,
  entrypoint,
  source,
  fee,
  gasLimit,
  storageLimit,
}: TransferTicketParams) => {
  return {
    kind: OpKind.TRANSFER_TICKET,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    source,
    ticket_contents: ticketContents,
    ticket_ty: ticketTy,
    ticket_ticketer: ticketTicketer,
    ticket_amount: ticketAmount,
    destination,
    entrypoint,
  } as RPCTransferTicketOperation;
};

export const createIncreasePaidStorageOperation = async ({
  source,
  fee,
  gasLimit,
  storageLimit,
  amount,
  destination,
}: IncreasePaidStorageParams) => {
  return {
    kind: OpKind.INCREASE_PAID_STORAGE,
    source,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    amount,
    destination,
  } as RPCIncreasePaidStorageOperation;
};

export const createDrainDelegateOperation = async ({
  consensus_key,
  delegate,
  destination,
}: DrainDelegateParams) => {
  return {
    kind: OpKind.DRAIN_DELEGATE,
    consensus_key,
    delegate,
    destination,
  } as RPCDrainDelegateOperation;
};

export const createBallotOperation = async ({ source, proposal, ballot }: BallotParams) => {
  return {
    kind: OpKind.BALLOT,
    source,
    proposal,
    ballot,
  } as RPCBallotOperation;
};

export const createProposalsOperation = async ({ source, proposals }: ProposalsParams) => {
  return {
    kind: OpKind.PROPOSALS,
    source,
    proposals,
  } as RPCProposalsOperation;
};

export const createUpdateConsensusKeyOperation = async ({
  source,
  fee,
  gasLimit,
  storageLimit,
  pk,
  proof,
}: UpdateConsensusKeyParams) => {
  return {
    kind: OpKind.UPDATE_CONSENSUS_KEY,
    source,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    pk,
    proof,
  } as RPCUpdateConsensusKeyOperation;
};

export const createSmartRollupAddMessagesOperation = async ({
  source,
  fee,
  gasLimit,
  storageLimit,
  message,
}: SmartRollupAddMessagesParams) => {
  return {
    kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
    source,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    message,
  } as RPCSmartRollupAddMessagesOperation;
};

export const createSmartRollupOriginateOperation = async ({
  source,
  fee,
  gasLimit,
  storageLimit,
  pvmKind,
  kernel,
  parametersType,
}: SmartRollupOriginateParams) => {
  return {
    kind: OpKind.SMART_ROLLUP_ORIGINATE,
    source,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    pvm_kind: pvmKind,
    kernel,
    parameters_ty: parametersType,
  } as RPCSmartRollupOriginateOperation;
};

export const createSmartRollupExecuteOutboxMessageOperation = async ({
  source,
  fee,
  gasLimit,
  storageLimit,
  rollup,
  cementedCommitment,
  outputProof,
}: SmartRollupExecuteOutboxMessageParams) => {
  return {
    kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
    source,
    fee,
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    rollup,
    cemented_commitment: cementedCommitment,
    output_proof: outputProof,
  } as RPCSmartRollupOutboxMessageOperation;
};
