import {
  addressDecoder,
  ballotDecoder,
  blockPayloadHashDecoder,
  branchDecoder,
  burnLimitDecoder,
  delegateDecoder,
  entrypointNameDecoder,
  int16Decoder,
  int32Decoder,
  paddedBytesDecoder,
  parametersDecoder,
  pkhDecoder,
  smartRollupMessageDecoder,
  proposalDecoder,
  proposalsDecoder,
  publicKeyDecoder,
  depositsLimitDecoder,
  pvmKindDecoder,
  smartContractAddressDecoder,
  smartRollupAddressDecoder,
  smartRollupCommitmentHashDecoder,
  txRollupBatchContentDecoder,
  txRollupIdDecoder,
  txRollupOriginationParamDecoder,
  tz1Decoder,
  valueParameterDecoder,
  zarithDecoder,
} from './codec';
import { CODEC } from './constants';
import { scriptDecoder } from './michelson/codec';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  EndorsementSchema,
  IncreasePaidStorageSchema,
  UpdateConsensusKeySchema,
  DrainDelegateSchema,
  ManagerOperationSchema,
  operationDecoder,
  OriginationSchema,
  ProposalsSchema,
  RegisterGlobalConstantSchema,
  RevealSchema,
  schemaDecoder,
  SeedNonceRevelationSchema,
  TransactionSchema,
  TransferTicketSchema,
  TxRollupOriginationSchema,
  TxRollupSubmitBatchSchema,
  SetDepositsLimitSchema,
  SmartRollupOriginateSchema,
  SmartRollupAddMessagesSchema,
  SmartRollupExecuteOutboxMessageSchema,
  FailingNoOpSchema,
} from './schema/operation';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { toHexString } from './utils';

export type Decoder = (val: Uint8ArrayConsumer) => string | number | object | undefined;

export const decoders: { [key: string]: Decoder } = {
  [CODEC.SECRET]: (val) => toHexString(val.consume(20)),
  [CODEC.RAW]: (val) => toHexString(val.consume(32)),
  [CODEC.TZ1]: tz1Decoder,
  [CODEC.BRANCH]: branchDecoder,
  [CODEC.ZARITH]: zarithDecoder,
  [CODEC.PUBLIC_KEY]: publicKeyDecoder,
  [CODEC.PKH]: pkhDecoder,
  [CODEC.DELEGATE]: delegateDecoder,
  [CODEC.INT32]: int32Decoder,
  [CODEC.SCRIPT]: scriptDecoder,
  [CODEC.BALLOT_STATEMENT]: ballotDecoder,
  [CODEC.PROPOSAL]: proposalDecoder,
  [CODEC.PROPOSAL_ARR]: proposalsDecoder,
  [CODEC.PARAMETERS]: parametersDecoder,
  [CODEC.ADDRESS]: addressDecoder,
  [CODEC.SMART_ROLLUP_ADDRESS]: smartRollupAddressDecoder,
  [CODEC.SMART_CONTRACT_ADDRESS]: smartContractAddressDecoder,
  [CODEC.SMART_ROLLUP_COMMITMENT_HASH]: smartRollupCommitmentHashDecoder,
  [CODEC.VALUE]: valueParameterDecoder,
  [CODEC.INT16]: int16Decoder,
  [CODEC.BLOCK_PAYLOAD_HASH]: blockPayloadHashDecoder,
  [CODEC.ENTRYPOINT]: entrypointNameDecoder,
  [CODEC.TX_ROLLUP_ORIGINATION_PARAM]: txRollupOriginationParamDecoder,
  [CODEC.TX_ROLLUP_ID]: txRollupIdDecoder,
  [CODEC.TX_ROLLUP_BATCH_CONTENT]: txRollupBatchContentDecoder,
  [CODEC.BURN_LIMIT]: burnLimitDecoder,
  [CODEC.DEPOSITS_LIMIT]: depositsLimitDecoder,
  [CODEC.PVM_KIND]: pvmKindDecoder,
  [CODEC.PADDED_BYTES]: paddedBytesDecoder,
  [CODEC.SMART_ROLLUP_MESSAGE]: smartRollupMessageDecoder,
};

decoders[CODEC.OPERATION] = operationDecoder(decoders);
decoders[CODEC.OP_ACTIVATE_ACCOUNT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(ActivationSchema)(val);
decoders[CODEC.OP_FAILING_NOOP] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(FailingNoOpSchema)(val);
decoders[CODEC.OP_DELEGATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(DelegationSchema)(val);
decoders[CODEC.OP_TRANSACTION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(TransactionSchema)(val);
decoders[CODEC.OP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(OriginationSchema)(val);
decoders[CODEC.OP_BALLOT] = (val: Uint8ArrayConsumer) => schemaDecoder(decoders)(BallotSchema)(val);
decoders[CODEC.OP_ENDORSEMENT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(EndorsementSchema)(val);
decoders[CODEC.OP_SEED_NONCE_REVELATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(SeedNonceRevelationSchema)(val);
decoders[CODEC.OP_PROPOSALS] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(ProposalsSchema)(val);
decoders[CODEC.OP_REVEAL] = (val: Uint8ArrayConsumer) => schemaDecoder(decoders)(RevealSchema)(val);
decoders[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(RegisterGlobalConstantSchema)(val);
decoders[CODEC.OP_TRANSFER_TICKET] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(TransferTicketSchema)(val);
decoders[CODEC.OP_TX_ROLLUP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(TxRollupOriginationSchema)(val);
decoders[CODEC.OP_TX_ROLLUP_SUBMIT_BATCH] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(TxRollupSubmitBatchSchema)(val);
decoders[CODEC.OP_INCREASE_PAID_STORAGE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(IncreasePaidStorageSchema)(val);
decoders[CODEC.OP_UPDATE_CONSENSUS_KEY] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(UpdateConsensusKeySchema)(val);
decoders[CODEC.OP_DRAIN_DELEGATE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(DrainDelegateSchema)(val);
decoders[CODEC.OP_SMART_ROLLUP_ORIGINATE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(SmartRollupOriginateSchema)(val);
decoders[CODEC.OP_SMART_ROLLUP_ADD_MESSAGES] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(SmartRollupAddMessagesSchema)(val);
decoders[CODEC.OP_SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(SmartRollupExecuteOutboxMessageSchema)(val);
decoders[CODEC.MANAGER] = schemaDecoder(decoders)(ManagerOperationSchema);
decoders[CODEC.OP_SET_DEPOSITS_LIMIT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(SetDepositsLimitSchema)(val);
